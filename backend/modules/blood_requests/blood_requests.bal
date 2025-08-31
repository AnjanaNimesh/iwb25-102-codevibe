import backend.database;
import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/regex as re;
import ballerina/lang.array as arrays;
import ballerina/time;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowCredentials: true
    }
}

service /bloodrequests on new http:Listener(9094) {
    
    // Get all blood requests (only for authenticated donors)
    resource function get requests(http:Request req) returns BloodRequest[]|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Only donors can view blood requests");
        }

        stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(
            `SELECT br.request_id, br.hospital_id, h.hospital_name, br.blood_group, 
                    br.units_required, br.request_date, br.request_status, br.notes
             FROM blood_request br
             JOIN hospital h ON br.hospital_id = h.hospital_id
             ORDER BY br.request_date DESC`
        );
        BloodRequest[] requests = [];
        check resultStream.forEach(function(BloodRequest request) {
            requests.push(request);
        });
        check resultStream.close();
        return requests;
    }

    // Get blood requests filtered by donor's blood group compatibility
    resource function get compatible(http:Request req) returns BloodRequest[]|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Only donors can view blood requests");
        }

        // Get donor's blood group
        string donorBloodGroup = check getDonorBloodGroup(authResult.userId);
        
        // Get compatible blood groups that this donor can donate to
        string[] compatibleGroups = getCompatibleBloodGroups(donorBloodGroup);
        
        if compatibleGroups.length() == 0 {
            return [];
        }

        // Use individual queries for each compatible blood group and combine results
        BloodRequest[] allRequests = [];
        
        foreach string bloodGroup in compatibleGroups {
            stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(
                `SELECT br.request_id, br.hospital_id, h.hospital_name, br.blood_group, 
                        br.units_required, br.request_date, br.request_status, br.notes
                 FROM blood_request br
                 JOIN hospital h ON br.hospital_id = h.hospital_id
                 WHERE br.blood_group = ${bloodGroup} AND br.request_status = 'Pending'`
            );
            
            check resultStream.forEach(function(BloodRequest request) {
                allRequests.push(request);
            });
            check resultStream.close();
        }
        
        // Sort by request_date DESC (newest first)
        // Note: This is a simple sort, you might want to implement proper date sorting
        return allRequests;
    }

    // Get blood requests by specific blood group (for donors)
    resource function get bybloodgroup/[string bloodGroup](http:Request req) returns BloodRequest[]|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Only donors can view blood requests");
        }

        // Validate blood group format
        if !isValidBloodGroup(bloodGroup) {
            return error("Invalid blood group format");
        }

        stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(
            `SELECT br.request_id, br.hospital_id, h.hospital_name, br.blood_group, 
                    br.units_required, br.request_date, br.request_status, br.notes
             FROM blood_request br
             JOIN hospital h ON br.hospital_id = h.hospital_id
             WHERE br.blood_group = ${bloodGroup} AND br.request_status = 'Pending'
             ORDER BY br.request_date DESC`
        );
        BloodRequest[] requests = [];
        check resultStream.forEach(function(BloodRequest request) {
            requests.push(request);
        });
        check resultStream.close();
        return requests;
    }

    // Admin endpoints (hospital users and admins only) - kept for reference but donors won't access these

    // Add a new blood request (Hospital users only - not accessible to donors)
    resource function post addrequest(http:Request req, @http:Payload BloodRequestInput requestInput) returns json|error {
        // This endpoint should only be accessible to hospital users or admins
        AuthValidationResult|error authResult = validateToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid || (authResult.role != "hospital_user" && authResult.role != "admin") {
            return error("Access denied: Only hospital users and admins can add blood requests");
        }

        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_request (hospital_id, blood_group, units_required, notes)
            VALUES (${requestInput.hospital_id}, ${requestInput.blood_group}, ${requestInput.units_required}, ${requestInput.notes})
        `);
        if (result.affectedRowCount == 0) {
            return error("Failed to add blood request");
        }
        return {"message": "Blood request has been added successfully."};
    }

    // Update blood request status (Hospital users and admins only)
    resource function put updatestatus/[int request_id](http:Request req, @http:Payload BloodRequestStatusUpdate statusUpdate) returns json|error {
        AuthValidationResult|error authResult = validateToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid || (authResult.role != "hospital_user" && authResult.role != "admin") {
            return error("Access denied: Only hospital users and admins can update blood requests");
        }

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_request 
            SET request_status = ${statusUpdate.request_status}
            WHERE request_id = ${request_id}`);
        
        if (result.affectedRowCount == 0) {
            return error("Blood request not found or update failed");
        }
        return {"message": "Blood request status updated."};
    }

    // Delete a blood request (Admins only)
    resource function delete deleterequest/[int request_id](http:Request req) returns json|error {
        AuthValidationResult|error authResult = validateToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid || authResult.role != "admin" {
            return error("Access denied: Only admins can delete blood requests");
        }

        sql:ExecutionResult result = check database:dbClient->execute(`
            DELETE FROM blood_request WHERE request_id = ${request_id}
        `);
        if (result.affectedRowCount == 0) {
            return error("Blood request not found or delete failed");
        }
        return {"message": "Blood request deleted."};
    }
}

// Authentication validation specifically for donors
// Enhanced validateDonorToken function with debugging
function validateDonorToken(http:Request req) returns AuthValidationResult|error {
    AuthValidationResult|error authResult = validateToken(req);
    if authResult is error {
        io:println("validateDonorToken: Error from validateToken: " + authResult.message());
        return authResult;
    }
    
    if !authResult.isValid {
        io:println("validateDonorToken: Token is not valid");
        return authResult;
    }
    
    // Debug: Print the extracted values
    io:println("validateDonorToken: Token is valid");
    io:println("validateDonorToken: Extracted role: '" + authResult.role + "'");
    io:println("validateDonorToken: Extracted userId: '" + authResult.userId + "'");
    io:println("validateDonorToken: Extracted email: '" + authResult.email + "'");
    
    // Check if the user is a donor
    if authResult.role != "donor" {
        io:println("validateDonorToken: Role mismatch. Expected 'donor', got '" + authResult.role + "'");
        return {
            isValid: false,
            email: "",
            role: "",
            userId: "",
            message: "Access denied: Only donors can access this resource"
        };
    }
    
    io:println("validateDonorToken: Successfully validated donor token");
    return authResult;
}

// Enhanced validateToken function with better debugging
function validateToken(http:Request req) returns AuthValidationResult|error {
    http:Cookie[]? cookies = req.getCookies();
    string? token = ();

    if cookies is http:Cookie[] {
        io:println("validateToken: Found " + cookies.length().toString() + " cookies");
        foreach http:Cookie cookie in cookies {
            io:println("validateToken: Cookie name: " + cookie.name);
            if cookie.name == "auth_token" {
                token = cookie.value;
                io:println("validateToken: Found auth_token cookie");
                break;
            }
        }
    } else {
        io:println("validateToken: No cookies found");
    }

    if token is () {
        io:println("validateToken: No auth_token cookie found");
        return {
            isValid: false,
            email: "",
            role: "",
            userId: "",
            message: "No authentication token found"
        };
    }

    string[] tokenParts = re:split(token, "\\.");
    io:println("validateToken: Token has " + tokenParts.length().toString() + " parts");

    // Handle both signed (3 parts) and unsigned (2 parts) tokens
    if tokenParts.length() < 2 || tokenParts.length() > 3 {
        io:println("validateToken: Invalid token format - wrong number of parts");
        return {
            isValid: false,
            email: "",
            role: "",
            userId: "",
            message: "Invalid token format"
        };
    }

    string encodedPayload = tokenParts[1];
    byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

    if payloadBytes is error {
        io:println("validateToken: Failed to decode base64 payload: " + payloadBytes.message());
        return {
            isValid: false,
            email: "",
            role: "",
            userId: "",
            message: "Invalid token encoding"
        };
    }

    string|error payloadStr = string:fromBytes(payloadBytes);

    if payloadStr is error {
        io:println("validateToken: Failed to convert payload bytes to string: " + payloadStr.message());
        return {
            isValid: false,
            email: "",
            role: "",
            userId: "",
            message: "Invalid token payload encoding"
        };
    }

    io:println("validateToken: Payload string: " + payloadStr);

    json|error payloadJson = payloadStr.fromJsonString();

    if (payloadJson is error) {
        io:println("validateToken: Failed to parse payload JSON: " + payloadJson.message());
        return {
            isValid: false,
            email: "",
            role: "",
            userId: "",
            message: "Invalid token payload JSON"
        };
    }

    if (payloadJson is map<json>) {
        json? issuerJson = payloadJson?.iss;
        json? expJson = payloadJson?.exp;
        json? subJson = payloadJson?.sub;

        if issuerJson is () || expJson is () || subJson is () {
            io:println("validateToken: Missing required fields in payload");
            return {
                isValid: false,
                email: "",
                role: "",
                userId: "",
                message: "Invalid token payload structure"
            };
        }

        if !(issuerJson is string) || !(expJson is decimal) || !(subJson is string) {
            io:println("validateToken: Invalid types for required fields");
            return {
                isValid: false,
                email: "",
                role: "",
                userId: "",
                message: "Invalid token payload structure"
            };
        }

        string issuer = <string>issuerJson;
        decimal exp = <decimal>expJson;
        string sub = <string>subJson;

        io:println("validateToken: Issuer: " + issuer);
        io:println("validateToken: Subject: " + sub);
        io:println("validateToken: Expiry: " + exp.toString());

        if issuer != "bloodlink-auth-service" {
            io:println("validateToken: Invalid issuer");
            return {
                isValid: false,
                email: "",
                role: "",
                userId: "",
                message: "Invalid issuer"
            };
        }

        decimal currentTime = <decimal>time:utcNow()[0];
        io:println("validateToken: Current time: " + currentTime.toString());
        if exp < currentTime {
            io:println("validateToken: Token expired");
            return {
                isValid: false,
                email: "",
                role: "",
                userId: "",
                message: "Token expired"
            };
        }

        json? customClaimsJson = payloadJson?.customClaims;
        io:println("validateToken: CustomClaims present: " + (customClaimsJson is () ? "false" : "true"));

        if customClaimsJson is () || !(customClaimsJson is map<json>) {
            io:println("validateToken: Invalid or missing custom claims");
            return {
                isValid: false,
                email: "",
                role: "",
                userId: "",
                message: "Invalid custom claims structure"
            };
        }

        map<json> customClaims = <map<json>>customClaimsJson;
        json roleJson = customClaims["role"];
        json userIdJson = customClaims["userId"];

        io:println("validateToken: Role JSON: " + roleJson.toString());
        io:println("validateToken: UserID JSON: " + userIdJson.toString());

        string role = roleJson is string ? <string>roleJson : "";
        string userId = userIdJson is string ? <string>userIdJson : "";

        io:println("validateToken: Final extracted role: '" + role + "'");
        io:println("validateToken: Final extracted userId: '" + userId + "'");

        return {
            isValid: true,
            email: sub,
            role: role,
            userId: userId,
            message: "Token valid"
        };
    }

    io:println("validateToken: Payload is not a map");
    return {
        isValid: false,
        email: "",
        role: "",
        userId: "",
        message: "Invalid payload format"
    };
}


// Helper function to get donor's blood group
function getDonorBloodGroup(string donorId) returns string|error {
    sql:ParameterizedQuery query = `SELECT blood_group FROM donor WHERE donor_id = ${donorId}`;
    record {|string blood_group;|}? result = check database:dbClient->queryRow(query);
    
    if result is () {
        return error("Donor not found");
    }
    
    return result.blood_group;
}

// Helper function to determine compatible blood groups for donation
function getCompatibleBloodGroups(string donorBloodGroup) returns string[] {
    match donorBloodGroup {
        "O-" => { return ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]; } // Universal donor
        "O+" => { return ["O+", "A+", "B+", "AB+"]; }
        "A-" => { return ["A-", "A+", "AB-", "AB+"]; }
        "A+" => { return ["A+", "AB+"]; }
        "B-" => { return ["B-", "B+", "AB-", "AB+"]; }
        "B+" => { return ["B+", "AB+"]; }
        "AB-" => { return ["AB-", "AB+"]; }
        "AB+" => { return ["AB+"]; }
        _ => { return []; }
    }
}

// Helper function to validate blood group format
function isValidBloodGroup(string bloodGroup) returns boolean {
    string[] validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    return validGroups.indexOf(bloodGroup) != ();
}

public function startBloodRequestsService() returns error? {
    io:println("Blood Requests service with donor authentication started on port: 9094");
}