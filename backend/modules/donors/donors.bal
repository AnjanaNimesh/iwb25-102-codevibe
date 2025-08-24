
// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }

// service /donors on new http:Listener(9095) {
//     // Get donor details by donor_id
//     resource function get [int donorId](http:Request req) returns Donor|error {
//         sql:ParameterizedQuery query = `SELECT d.donor_id, d.donor_name, d.email, d.phone_number, 
//                                        d.district_id, dis.district_name, d.blood_group, d.last_donation_date
//                                        FROM donor d
//                                        JOIN district dis ON d.district_id = dis.district_id
//                                        WHERE d.donor_id = ${donorId}`;
//         Donor? donor = check database:dbClient->queryRow(query);
//         if donor is () {
//             return error("Donor not found");
//         }
//         return donor;
//     }

//     // Get donation history by donor_id
//     resource function get [int donorId]/history(http:Request req) returns DonationHistory[]|error {
//         stream<DonationHistory, sql:Error?> resultStream = database:dbClient->query(
//             `SELECT donation_id, donor_id, donation_date, location, donation_type
//              FROM donation_history
//              WHERE donor_id = ${donorId}
//              ORDER BY donation_date DESC`
//         );
//         DonationHistory[] history = [];
//         check resultStream.forEach(function(DonationHistory donation) {
//             history.push(donation);
//         });
//         check resultStream.close();
//         return history;
//     }

//     // // Update donor details
//     // resource function put [int donorId](http:Request req) returns json|error {
//     //     json payload = check req.getJsonPayload();
//     //     string donor_name = (check payload.donor_name).toString();
//     //     string email = (check payload.email).toString();
//     //     string phone_number = (check payload.phone_number).toString();
//     //     string blood_group = (check payload.blood_group).toString();
//     //     string district_name = (check payload.district_name).toString();

//     //     // Validate blood_group
//     //     if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
//     //         return error("Invalid blood group");
//     //     }

//     //     // Get district_id from district_name
//     //     sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
//     //     record { int district_id; }? district = check database:dbClient->queryRow(districtQuery);
//     //     if district is () {
//     //         return error("District not found");
//     //     }

//     //     // Check email uniqueness (excluding current donor)
//     //     sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
//     //     record { int donor_id; }? existingDonor = check database:dbClient->queryRow(emailCheck);
//     //     if existingDonor is record { int donor_id; } {
//     //         return error("Email already in use");
//     //     }

//     //     // Update donor
//     //     sql:ParameterizedQuery updateQuery = `UPDATE donor 
//     //                                          SET donor_name = ${donor_name}, email = ${email}, 
//     //                                              phone_number = ${phone_number}, blood_group = ${blood_group}, 
//     //                                              district_id = ${district.district_id}
//     //                                          WHERE donor_id = ${donorId}`;
//     //     sql:ExecutionResult result = check database:dbClient->execute(updateQuery);
//     //     if result.affectedRowCount == 0 {
//     //         return error("Donor not found or update failed");
//     //     }
//     //     return {"message": "Donor details updated successfully"};
//     // }


// // Update donor details
// resource function put [int donorId](http:Request req) returns json|error {
//     // Get JSON payload
//     json payload = check req.getJsonPayload();

//     // Extract and trim values from payload
//     string donor_name = (check payload.donor_name).toString().trim();
//     string email = (check payload.email).toString().trim();
//     string phone_number = (check payload.phone_number).toString().trim();
//     string blood_group = (check payload.blood_group).toString().trim();
//     string district_name = (check payload.district_name).toString().trim();

//     // Validate blood_group
//     if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
//         return error("Invalid blood group");
//     }

//     // Get district_id from district_name
//     sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
//     record {|int district_id; anydata...;|}?|sql:Error districtResult = database:dbClient->queryRow(districtQuery);

//     if districtResult is () {
//         return error("District not found");
//     } else if districtResult is record {|int district_id; anydata...;|} {
//         int districtId = districtResult.district_id;

//         // Check email uniqueness (excluding current donor)
//         sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
//         record {|int donor_id; anydata...;|}?|sql:Error existingDonor = database:dbClient->queryRow(emailCheck);

//         if existingDonor is record {|int donor_id; anydata...;|} {
//             return error("Email already in use");
//         }

//         // Update donor details
//         sql:ParameterizedQuery updateQuery = `UPDATE donor 
//                                              SET donor_name = ${donor_name}, email = ${email}, 
//                                                  phone_number = ${phone_number}, blood_group = ${blood_group}, 
//                                                  district_id = ${districtId}
//                                              WHERE donor_id = ${donorId}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount == 0 {
//             return error("Donor not found or update failed");
//         }

//         return {"message": "Donor details updated successfully"};
//     } else {
//         return error("Database error occurred while fetching district");
//     }
// }

// // Get nearby hospitals within a radius (default 50 km)
//     resource function get hospitals/nearby(http:Request req) returns Hospital[]|error {
//         float latitude = check float:fromString(req.getQueryParamValue("latitude") ?: "0");
//         float longitude = check float:fromString(req.getQueryParamValue("longitude") ?: "0");
//         float radius = check float:fromString(req.getQueryParamValue("radius") ?: "50");

//         // Haversine formula in SQL to calculate distance
//         sql:ParameterizedQuery query = `
//             SELECT 
//                 h.hospital_id,
//                 h.hospital_name,
//                 h.hospital_type,
//                 h.hospital_address,
//                 h.contact_number,
//                 h.district_id,
//                 d.district_name,
//                 h.latitude,
//                 h.longitude,
//                 (
//                     6371 * acos(
//                         cos(radians(${latitude})) * cos(radians(h.latitude)) *
//                         cos(radians(h.longitude) - radians(${longitude})) +
//                         sin(radians(${latitude})) * sin(radians(h.latitude))
//                     )
//                 ) AS distance
//             FROM hospital h
//             JOIN district d ON h.district_id = d.district_id
//             HAVING distance <= ${radius}
//             ORDER BY distance
//         `;
//         stream<Hospital, sql:Error?> resultStream = database:dbClient->query(query);
//         Hospital[] hospitals = [];
//         check resultStream.forEach(function(Hospital hospital) {
//             hospitals.push(hospital);
//         });
//         check resultStream.close();
//         return hospitals;
//     }


// }

// public function startDonorsService() returns error? {
//     io:println("Donors service started on port: 9095");
// }















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

service /donors on new http:Listener(9095) {
    
    // Get donor details by donor_id (donors can only access their own data)
    resource function get [int donorId](http:Request req) returns Donor|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        // Check if the authenticated donor is trying to access their own data
        int authenticatedDonorId = check int:fromString(authResult.userId);
        if authenticatedDonorId != donorId {
            return error("Access denied: You can only access your own donor information");
        }

        sql:ParameterizedQuery query = `SELECT d.donor_id, d.donor_name, d.email, d.phone_number, 
                                       d.district_id, dis.district_name, d.blood_group, d.last_donation_date
                                       FROM donor d
                                       JOIN district dis ON d.district_id = dis.district_id
                                       WHERE d.donor_id = ${donorId}`;
        Donor? donor = check database:dbClient->queryRow(query);
        if donor is () {
            return error("Donor not found");
        }
        return donor;
    }

    // Get current donor's details (using token information)
    resource function get profile(http:Request req) returns Donor|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);

        sql:ParameterizedQuery query = `SELECT d.donor_id, d.donor_name, d.email, d.phone_number, 
                                       d.district_id, dis.district_name, d.blood_group, d.last_donation_date,
                                       d.status
                                       FROM donor d
                                       JOIN district dis ON d.district_id = dis.district_id
                                       WHERE d.donor_id = ${donorId}`;
        Donor? donor = check database:dbClient->queryRow(query);
        if donor is () {
            return error("Donor not found");
        }
        return donor;
    }

    // Get donation history by donor_id (donors can only access their own history)
    resource function get [int donorId]/history(http:Request req) returns DonationHistory[]|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        // Check if the authenticated donor is trying to access their own data
        int authenticatedDonorId = check int:fromString(authResult.userId);
        if authenticatedDonorId != donorId {
            return error("Access denied: You can only access your own donation history");
        }

        stream<DonationHistory, sql:Error?> resultStream = database:dbClient->query(
            `SELECT donation_id, donor_id, donation_date, location, donation_type
             FROM donation_history
             WHERE donor_id = ${donorId}
             ORDER BY donation_date DESC`
        );
        DonationHistory[] history = [];
        check resultStream.forEach(function(DonationHistory donation) {
            history.push(donation);
        });
        check resultStream.close();
        return history;
    }

    // Get current donor's donation history (using token information)
    resource function get history(http:Request req) returns DonationHistory[]|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);

        stream<DonationHistory, sql:Error?> resultStream = database:dbClient->query(
            `SELECT donation_id, donor_id, donation_date, location, donation_type
             FROM donation_history
             WHERE donor_id = ${donorId}
             ORDER BY donation_date DESC`
        );
        DonationHistory[] history = [];
        check resultStream.forEach(function(DonationHistory donation) {
            history.push(donation);
        });
        check resultStream.close();
        return history;
    }

    // Update donor details (donors can only update their own information)
    resource function put [int donorId](http:Request req) returns json|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        // Check if the authenticated donor is trying to update their own data
        int authenticatedDonorId = check int:fromString(authResult.userId);
        if authenticatedDonorId != donorId {
            return error("Access denied: You can only update your own donor information");
        }

        // Get JSON payload
        json payload = check req.getJsonPayload();

        // Extract and trim values from payload
        string donor_name = (check payload.donor_name).toString().trim();
        string email = (check payload.email).toString().trim();
        string phone_number = (check payload.phone_number).toString().trim();
        string blood_group = (check payload.blood_group).toString().trim();
        string district_name = (check payload.district_name).toString().trim();

        // Validate input
        if donor_name.length() == 0 {
            return error("Donor name cannot be empty");
        }
        if email.length() == 0 {
            return error("Email cannot be empty");
        }
        if phone_number.length() == 0 {
            return error("Phone number cannot be empty");
        }

        // Validate blood_group
        if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
            return error("Invalid blood group");
        }

        // Get district_id from district_name
        sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
        record {|int district_id; anydata...;|}?|sql:Error districtResult = database:dbClient->queryRow(districtQuery);

        if districtResult is () {
            return error("District not found");
        } else if districtResult is record {|int district_id; anydata...;|} {
            int districtId = districtResult.district_id;

            // Check email uniqueness (excluding current donor)
            sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
            record {|int donor_id; anydata...;|}?|sql:Error existingDonor = database:dbClient->queryRow(emailCheck);

            if existingDonor is record {|int donor_id; anydata...;|} {
                return error("Email already in use");
            }

            // Update donor details
            sql:ParameterizedQuery updateQuery = `UPDATE donor 
                                                 SET donor_name = ${donor_name}, email = ${email}, 
                                                     phone_number = ${phone_number}, blood_group = ${blood_group}, 
                                                     district_id = ${districtId}
                                                 WHERE donor_id = ${donorId}`;
            sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

            if result.affectedRowCount == 0 {
                return error("Donor not found or update failed");
            }

            return {"message": "Donor details updated successfully"};
        } else {
            return error("Database error occurred while fetching district");
        }
    }

    // Update current donor's profile (using token information)
    resource function put profile(http:Request req) returns json|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);

        // Get JSON payload
        json payload = check req.getJsonPayload();

        // Extract and trim values from payload
        string donor_name = (check payload.donor_name).toString().trim();
        string email = (check payload.email).toString().trim();
        string phone_number = (check payload.phone_number).toString().trim();
        string blood_group = (check payload.blood_group).toString().trim();
        string district_name = (check payload.district_name).toString().trim();

        // Validate input
        if donor_name.length() == 0 {
            return error("Donor name cannot be empty");
        }
        if email.length() == 0 {
            return error("Email cannot be empty");
        }
        if phone_number.length() == 0 {
            return error("Phone number cannot be empty");
        }

        // Validate blood_group
        if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
            return error("Invalid blood group");
        }

        // Get district_id from district_name
        sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
        record {|int district_id; anydata...;|}?|sql:Error districtResult = database:dbClient->queryRow(districtQuery);

        if districtResult is () {
            return error("District not found");
        } else if districtResult is record {|int district_id; anydata...;|} {
            int districtId = districtResult.district_id;

            // Check email uniqueness (excluding current donor)
            sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
            record {|int donor_id; anydata...;|}?|sql:Error existingDonor = database:dbClient->queryRow(emailCheck);

            if existingDonor is record {|int donor_id; anydata...;|} {
                return error("Email already in use");
            }

            // Update donor details
            sql:ParameterizedQuery updateQuery = `UPDATE donor 
                                                 SET donor_name = ${donor_name}, email = ${email}, 
                                                     phone_number = ${phone_number}, blood_group = ${blood_group}, 
                                                     district_id = ${districtId}
                                                 WHERE donor_id = ${donorId}`;
            sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

            if result.affectedRowCount == 0 {
                return error("Donor not found or update failed");
            }

            return {"message": "Donor profile updated successfully"};
        } else {
            return error("Database error occurred while fetching district");
        }
    }

    // Check if donor is eligible to donate (based on last donation date)
    resource function get eligibility(http:Request req) returns json|error {
        // Validate donor authentication
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);

        sql:ParameterizedQuery query = `SELECT last_donation_date, blood_group 
                                       FROM donor WHERE donor_id = ${donorId}`;
        record {|string? last_donation_date; string blood_group;|}? donor = 
            check database:dbClient->queryRow(query);

        if donor is () {
            return error("Donor not found");
        }

        boolean isEligible = true;
        string eligibilityMessage = "You are eligible to donate blood";
        int daysUntilEligible = 0;

        if donor.last_donation_date is string {
            // Calculate days since last donation (simplified calculation)
            // In a real implementation, you would use proper date parsing and calculation
            // For now, assume a 56-day (8 weeks) waiting period for whole blood donation
            daysUntilEligible = 56; // This should be calculated based on actual date difference
            if daysUntilEligible > 0 {
                isEligible = false;
                eligibilityMessage = string `You need to wait ${daysUntilEligible} more days before your next donation`;
            }
        }

        return {
            "isEligible": isEligible,
            "message": eligibilityMessage,
            "daysUntilEligible": daysUntilEligible,
            "lastDonationDate": donor.last_donation_date,
            "bloodGroup": donor.blood_group
        };
    }
}


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

// General token validation function
// Fixed token validation function that handles both signed and unsigned tokens
// function validateToken(http:Request req) returns AuthValidationResult|error {
//     http:Cookie[]? cookies = req.getCookies();
//     string? token = ();

//     if cookies is http:Cookie[] {
//         foreach http:Cookie cookie in cookies {
//             if cookie.name == "auth_token" {
//                 token = cookie.value;
//                 break;
//             }
//         }
//     }

//     if token is () {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "No authentication token found"
//         };
//     }

//     string[] tokenParts = re:split(token, "\\.");

//     // Handle both signed (3 parts) and unsigned (2 parts) tokens
//     if tokenParts.length() < 2 || tokenParts.length() > 3 {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token format"
//         };
//     }

//     // Check if this is an unsigned token (alg: "none")
//     string encodedHeader = tokenParts[0];
//     byte[]|error headerBytes = arrays:fromBase64(encodedHeader);
    
//     if headerBytes is error {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token header encoding"
//         };
//     }

//     string|error headerStr = string:fromBytes(headerBytes);
//     if headerStr is error {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token header encoding"
//         };
//     }

//     json|error headerJson = headerStr.fromJsonString();
//     if headerJson is error {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token header JSON"
//         };
//     }

//     // Check algorithm
//     if headerJson is map<json> {
//         json? algJson = headerJson?.alg;
//         if algJson is string {
//             string algorithm = <string>algJson;
//             // For unsigned tokens (alg: "none"), we expect exactly 2 parts
//             if algorithm == "none" && tokenParts.length() != 2 {
//                 return {
//                     isValid: false,
//                     email: "",
//                     role: "",
//                     userId: "",
//                     message: "Invalid unsigned token format"
//                 };
//             }
//             // For signed tokens, we expect exactly 3 parts
//             else if algorithm != "none" && tokenParts.length() != 3 {
//                 return {
//                     isValid: false,
//                     email: "",
//                     role: "",
//                     userId: "",
//                     message: "Invalid signed token format"
//                 };
//             }
//         }
//     }

//     // Proceed with payload validation
//     string encodedPayload = tokenParts[1];
//     byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

//     if payloadBytes is error {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token encoding"
//         };
//     }

//     string|error payloadStr = string:fromBytes(payloadBytes);

//     if payloadStr is error {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token payload encoding"
//         };
//     }

//     json|error payloadJson = payloadStr.fromJsonString();

//     if (payloadJson is error) {
//         return {
//             isValid: false,
//             email: "",
//             role: "",
//             userId: "",
//             message: "Invalid token payload JSON"
//         };
//     }

//     if (payloadJson is map<json>) {
//         json? issuerJson = payloadJson?.iss;
//         json? expJson = payloadJson?.exp;
//         json? subJson = payloadJson?.sub;

//         if issuerJson is () || expJson is () || subJson is () {
//             return {
//                 isValid: false,
//                 email: "",
//                 role: "",
//                 userId: "",
//                 message: "Invalid token payload structure"
//             };
//         }

//         if !(issuerJson is string) || !(expJson is decimal) || !(subJson is string) {
//             return {
//                 isValid: false,
//                 email: "",
//                 role: "",
//                 userId: "",
//                 message: "Invalid token payload structure"
//             };
//         }

//         string issuer = <string>issuerJson;
//         decimal exp = <decimal>expJson;
//         string sub = <string>subJson;

//         if issuer != "bloodlink-auth-service" {
//             return {
//                 isValid: false,
//                 email: "",
//                 role: "",
//                 userId: "",
//                 message: "Invalid issuer"
//             };
//         }

//         decimal currentTime = <decimal>time:utcNow()[0];
//         if exp < currentTime {
//             return {
//                 isValid: false,
//                 email: "",
//                 role: "",
//                 userId: "",
//                 message: "Token expired"
//             };
//         }

//         json? customClaimsJson = payloadJson?.customClaims;

//         if customClaimsJson is () || !(customClaimsJson is map<json>) {
//             return {
//                 isValid: false,
//                 email: "",
//                 role: "",
//                 userId: "",
//                 message: "Invalid custom claims structure"
//             };
//         }

//         map<json> customClaims = <map<json>>customClaimsJson;
//         json roleJson = customClaims["role"];
//         json userIdJson = customClaims["userId"];

//         string role = roleJson is string ? <string>roleJson : "";
//         string userId = userIdJson is string ? <string>userIdJson : "";

//         return {
//             isValid: true,
//             email: sub,
//             role: role,
//             userId: userId,
//             message: "Token valid"
//         };
//     }

//     return {
//         isValid: false,
//         email: "",
//         role: "",
//         userId: "",
//         message: "Invalid payload format"
//     };
// }

public function startDonorsService() returns error? {
    io:println("Donors service with authentication started on port: 9095");
}