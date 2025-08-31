import backend.database;
import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/regex as re;
import ballerina/lang.array as arrays;
import ballerina/time;
import ballerina/crypto;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowCredentials: true
    }
}

service /donors on new http:Listener(9095) {


    //get all campaigns
resource function get campaigns() returns http:Response|error {
    http:Response response = new;

    sql:ParameterizedQuery query = `SELECT bc.campaign_id, bc.hospital_id, h.hospital_name,
                                          bc.title, bc.location, bc.date, bc.status,
                                          bc.image
                                   FROM blood_campaign bc
                                   JOIN hospital h ON bc.hospital_id = h.hospital_id
                                   WHERE bc.status = 'active'
                                   ORDER BY bc.date DESC`;

    stream<BloodCampaign, sql:Error?> campaignStream = database:dbClient->query(query);
    
    BloodCampaignResponse[] campaigns = [];
    error? streamError = campaignStream.forEach(function(BloodCampaign campaign) {
        string? imageBase64 = campaign.image is byte[] ? arrays:toBase64(campaign.image ?: []) : null;
        
        BloodCampaignResponse responseCampaign = {
            campaign_id: campaign.campaign_id,
            hospital_id: campaign.hospital_id,
            hospital_name: campaign.hospital_name,
            title: campaign.title,
            location: campaign.location,
            date: campaign.date,
            status: campaign.status,
            image: imageBase64
        };
        campaigns.push(responseCampaign);
    });

    error? closeError = campaignStream.close();
    if closeError is error {
        io:println("Error closing campaign stream: ", closeError.message());
        response.setJsonPayload({
            status: "error",
            message: "Failed to close database stream"
        });
        response.statusCode = 500;
        return response;
    }

    if streamError is error {
        io:println("Error processing campaign stream: ", streamError.message());
        response.setJsonPayload({
            status: "error",
            message: "Failed to fetch campaigns: " + streamError.message()
        });
        response.statusCode = 500;
        return response;
    }

    io:println("Fetched ", campaigns.length(), " active campaigns");

    response.setJsonPayload({
        status: "success",
        campaigns: campaigns
    });
    response.statusCode = 200;
    return response;
}

    // Districts endpoint for signup form
resource function get districts() returns District[]|http:Response|error {
    http:Response response = new;
    
    sql:ParameterizedQuery districtQuery = `SELECT district_id, district_name 
                                           FROM district 
                                           ORDER BY district_name`;
    
    stream<District, sql:Error?> districtStream = database:dbClient->query(districtQuery);
    
    District[] districts = [];
    error? streamError = districtStream.forEach(function(District district) {
        districts.push(district);
    });
    
    if streamError is error {
        response.setJsonPayload({
            status: "error",
            message: "Failed to fetch districts"
        });
        response.statusCode = 500;
        return response;
    }
    
    response.setJsonPayload({
        status: "success",
        districts: districts
    });
    response.statusCode = 200;
    return response;
}
   //signup for donors
   resource function post signup(http:Request req) returns http:Response|error {
    http:Response response = new;
    
    io:println("=== DONOR SIGNUP REQUEST ===");
    
    // Parse request body
    json payload = check req.getJsonPayload();
    DonorSignupRequest signupData = check payload.cloneWithType(DonorSignupRequest);
    
    io:println("Signup request for email: ", signupData.email);

    // Validate required fields
    if signupData.donor_name.trim() == "" || 
       signupData.email.trim() == "" || 
       signupData.phone_number.trim() == "" ||
       signupData.password.trim() == "" ||
       signupData.district_name.trim() == "" ||
       signupData.blood_group.trim() == "" ||
       signupData.gender.trim() == "" {
        io:println("Validation failed: Missing required fields");
        response.setJsonPayload({
            status: "error",
            message: "All required fields must be provided"
        });
        response.statusCode = 400;
        return response;
    }

    // Validate blood group
    string[] validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if validBloodGroups.indexOf(signupData.blood_group) is () {
        io:println("Validation failed: Invalid blood group - ", signupData.blood_group);
        response.setJsonPayload({
            status: "error",
            message: "Invalid blood group"
        });
        response.statusCode = 400;
        return response;
    }

    // Validate gender
    string[] validGenders = ["Male", "Female", "Other"];
    if validGenders.indexOf(signupData.gender) is () {
        io:println("Validation failed: Invalid gender - ", signupData.gender);
        response.setJsonPayload({
            status: "error",
            message: "Invalid gender"
        });
        response.statusCode = 400;
        return response;
    }

    // Validate phone number (10 digits)
    if signupData.phone_number.length() != 10 {
        io:println("Validation failed: Invalid phone number length - ", signupData.phone_number.length());
        response.setJsonPayload({
            status: "error",
            message: "Phone number must be 10 digits"
        });
        response.statusCode = 400;
        return response;
    }

    // Validate email format (basic validation)
    if !signupData.email.includes("@") {
        io:println("Validation failed: Invalid email format");
        response.setJsonPayload({
            status: "error",
            message: "Invalid email format"
        });
        response.statusCode = 400;
        return response;
    }

    // Check if email already exists
    sql:ParameterizedQuery emailCheckQuery = `SELECT donor_id FROM donor WHERE email = ${signupData.email}`;
    int|error existingDonor = database:dbClient->queryRow(emailCheckQuery);
    
    if existingDonor is int {
        io:println("Email already exists: ", signupData.email);
        response.setJsonPayload({
            status: "error",
            message: "Email already exists. Please use a different email address."
        });
        response.statusCode = 409; // Conflict
        return response;
    }

    // Get district_id from district_name
    sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${signupData.district_name}`;
    record {|int district_id;|}? districtResult = check database:dbClient->queryRow(districtQuery);
    
    if districtResult is () {
        io:println("District lookup failed: ", signupData.district_name);
        response.setJsonPayload({
            status: "error",
            message: "Invalid district name"
        });
        response.statusCode = 400;
        return response;
    }

    int district_id = districtResult.district_id;
    io:println("District ID found: ", district_id);

    // Hash the password using bcrypt (matching your auth system)
    string|crypto:Error passwordHash = check crypto:hashBcrypt(signupData.password, 12);
    
    if passwordHash is crypto:Error {
        io:println("Password hashing failed: ", passwordHash.message());
        response.setJsonPayload({
            status: "error",
            message: "Failed to process password"
        });
        response.statusCode = 500;
        return response;
    }

    io:println("Password hashed successfully");

    // Parse last donation date if provided
    string? lastDonationDate = ();
    if signupData?.last_donation_date is string && signupData?.last_donation_date != "" {
        lastDonationDate = signupData?.last_donation_date;
        io:println("Last donation date provided: ", lastDonationDate);
    }

    // Insert donor into database
    sql:ParameterizedQuery insertQuery = `INSERT INTO donor 
        (donor_name, email, phone_number, password_hash, district_id, blood_group, last_donation_date, gender, status)
        VALUES (${signupData.donor_name}, ${signupData.email}, ${signupData.phone_number}, 
                ${passwordHash}, ${district_id}, ${signupData.blood_group}, ${lastDonationDate}, 
                ${signupData.gender}, 'active')`;

    sql:ExecutionResult|error insertResult = database:dbClient->execute(insertQuery);
    
    if insertResult is error {
        io:println("Database insertion failed: ", insertResult.message());
        
        // Check if it's a duplicate entry error
        if insertResult.message().includes("Duplicate entry") {
            response.setJsonPayload({
                status: "error",
                message: "Email already exists. Please use a different email address."
            });
            response.statusCode = 409; // Conflict
        } else {
            response.setJsonPayload({
                status: "error",
                message: "Failed to register donor. Please try again."
            });
            response.statusCode = 500;
        }
        return response;
    }

    // Get the generated donor_id
    int|string? generatedId = insertResult.lastInsertId;
    int donorId = 0;
    if generatedId is int {
        donorId = generatedId;
        io:println("New donor created with ID: ", donorId);
    }

    // Success response
    io:println("Donor signup successful for: ", signupData.email);
    response.setJsonPayload({
        status: "success",
        message: "Donor registered successfully",
        donor_id: donorId
    });
    response.statusCode = 201;
    return response;
}

    // Get donor details by donor_id (donors can only access their own data)
    resource function get [int donorId](http:Request req) returns Donor|error {
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int authenticatedDonorId = check int:fromString(authResult.userId);
        if authenticatedDonorId != donorId {
            return error("Access denied: You can only access your own donor information");
        }

        sql:ParameterizedQuery query = `SELECT d.donor_id, d.donor_name, d.email, d.phone_number, 
                                       d.district_id, dis.district_name, d.blood_group, d.last_donation_date,
                                       d.gender, d.status
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
                                       d.gender, d.status
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
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

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
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int authenticatedDonorId = check int:fromString(authResult.userId);
        if authenticatedDonorId != donorId {
            return error("Access denied: You can only update your own donor information");
        }

        json payload = check req.getJsonPayload();
        string donor_name = (check payload.donor_name).toString().trim();
        string email = (check payload.email).toString().trim();
        string phone_number = (check payload.phone_number).toString().trim();
        string blood_group = (check payload.blood_group).toString().trim();
        string district_name = (check payload.district_name).toString().trim();
        string gender = (check payload.gender).toString().trim();

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
        if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
            return error("Invalid blood group");
        }
        if ["male", "female"].indexOf(gender) == -1 {
            return error("Gender must be 'male' or 'female'");
        }

        sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
        record {|int district_id; anydata...;|}?|sql:Error districtResult = database:dbClient->queryRow(districtQuery);

        if districtResult is () {
            return error("District not found");
        } else if districtResult is record {|int district_id; anydata...;|} {
            int districtId = districtResult.district_id;

            sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
            record {|int donor_id; anydata...;|}?|sql:Error existingDonor = database:dbClient->queryRow(emailCheck);

            if existingDonor is record {|int donor_id; anydata...;|} {
                return error("Email already in use");
            }

            sql:ParameterizedQuery updateQuery = `UPDATE donor 
                                                 SET donor_name = ${donor_name}, email = ${email}, 
                                                     phone_number = ${phone_number}, blood_group = ${blood_group}, 
                                                     district_id = ${districtId}, gender = ${gender}
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
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);
        json payload = check req.getJsonPayload();
        string donor_name = (check payload.donor_name).toString().trim();
        string email = (check payload.email).toString().trim();
        string phone_number = (check payload.phone_number).toString().trim();
        string blood_group = (check payload.blood_group).toString().trim();
        string district_name = (check payload.district_name).toString().trim();
        string gender = (check payload.gender).toString().trim();

        if donor_name.length() == 0 {
            return error("Donor name cannot be empty");
        }
        if email.length() == 0 {
            return error("Email cannot be empty");
        }
        if phone_number.length() == 0 {
            return error("Phone number cannot be empty");
        }
        if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
            return error("Invalid blood group");
        }
        if ["male", "female"].indexOf(gender) == -1 {
            return error("Gender must be 'male' or 'female'");
        }

        sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
        record {|int district_id; anydata...;|}?|sql:Error districtResult = database:dbClient->queryRow(districtQuery);

        if districtResult is () {
            return error("District not found");
        } else if districtResult is record {|int district_id; anydata...;|} {
            int districtId = districtResult.district_id;

            sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
            record {|int donor_id; anydata...;|}?|sql:Error existingDonor = database:dbClient->queryRow(emailCheck);

            if existingDonor is record {|int donor_id; anydata...;|} {
                return error("Email already in use");
            }

            sql:ParameterizedQuery updateQuery = `UPDATE donor 
                                                 SET donor_name = ${donor_name}, email = ${email}, 
                                                     phone_number = ${phone_number}, blood_group = ${blood_group}, 
                                                     district_id = ${districtId}, gender = ${gender}
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
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);

        sql:ParameterizedQuery query = `SELECT last_donation_date, blood_group, gender 
                                       FROM donor WHERE donor_id = ${donorId}`;
        record {|string? last_donation_date; string blood_group; string? gender;|}? donor = 
            check database:dbClient->queryRow(query);

        if donor is () {
            return error("Donor not found");
        }

        boolean isEligible = true;
        string eligibilityMessage = "You are eligible to donate blood";
        int daysUntilEligible = 0;

        if donor.last_donation_date is string {
            time:Utc lastDonationTime = check time:utcFromString(donor.last_donation_date ?: "");
            time:Utc currentTime = time:utcNow();
            decimal secondsDiff = time:utcDiffSeconds(currentTime, lastDonationTime);
            decimal daysDiff = secondsDiff / (24 * 60 * 60);
            daysUntilEligible = 56 - <int>daysDiff; // 56-day waiting period for whole blood
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
            "bloodGroup": donor.blood_group,
            "gender": donor.gender
        };
    }

    // Get nearby hospitals for donation
    resource function get hospitals/nearby(http:Request req) returns Hospital[]|error {
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);
        // Verify donor exists
        sql:ParameterizedQuery donorQuery = `SELECT donor_id FROM donor WHERE donor_id = ${donorId}`;
        record {|int donor_id;|}? donor = check database:dbClient->queryRow(donorQuery);
        if donor is () {
            return error("Donor not found");
        }

        // Get query parameters
        string? latStr = req.getQueryParamValue("latitude");
        string? lonStr = req.getQueryParamValue("longitude");
        string? radStr = req.getQueryParamValue("radius");

        if latStr is () || lonStr is () {
            return error("Missing query parameters: latitude and longitude are required");
        }

        float|error latitude = float:fromString(latStr);
        float|error longitude = float:fromString(lonStr);
        float radius = radStr is () ? 20.0 : check float:fromString(radStr);

        if latitude is error || longitude is error {
            return error("Invalid query parameters: latitude and longitude must be valid numbers");
        }

        // Query hospitals with Haversine formula for distance calculation
        sql:ParameterizedQuery query = `
            SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.hospital_address, 
                   h.contact_number, h.district_id, d.district_name, h.latitude, h.longitude,
                   (6371 * acos(cos(radians(${latitude})) * cos(radians(h.latitude)) * 
                    cos(radians(h.longitude) - radians(${longitude})) + 
                    sin(radians(${latitude})) * sin(radians(h.latitude)))) AS distance
            FROM hospital h
            JOIN district d ON h.district_id = d.district_id
            WHERE h.latitude IS NOT NULL AND h.longitude IS NOT NULL
            HAVING distance <= ${radius.toString()}
            ORDER BY distance
        `;
        stream<Hospital, sql:Error?> resultStream = database:dbClient->query(query);
        Hospital[] hospitals = [];
        check resultStream.forEach(function(Hospital hospital) {
            hospitals.push(hospital);
        });
        check resultStream.close();
        io:println("Fetched ", hospitals.length(), " hospitals within ", radius, " km");
        return hospitals;
    }

    // Get pending donation requests for the current donor
    resource function get donations/pending(http:Request req) returns DonationRequest[]|error {
        AuthValidationResult|error authResult = validateDonorToken(req);
        if authResult is error {
            return error("Authentication failed: " + authResult.message());
        }
        if !authResult.isValid {
            return error("Access denied: Authentication required");
        }

        int donorId = check int:fromString(authResult.userId);

        stream<DonationRequest, sql:Error?> resultStream = database:dbClient->query(
            `SELECT donation_id, donor_id, hospital_id, donate_status
             FROM donation
             WHERE donor_id = ${donorId} AND donate_status = 'Pending'`
        );
        DonationRequest[] pending = [];
        check resultStream.forEach(function(DonationRequest donation) {
            pending.push(donation);
        });
        check resultStream.close();
        return pending;
    }

    // Create a new donation record
    // resource function post donation(http:Request req) returns json|error {
    //     AuthValidationResult|error authResult = validateDonorToken(req);
    //     if authResult is error {
    //         return error("Authentication failed: " + authResult.message());
    //     }
    //     if !authResult.isValid {
    //         return error("Access denied: Authentication required");
    //     }

    //     int donorId = check int:fromString(authResult.userId);
    //     json payload = check req.getJsonPayload();
    //     int hospitalId = check int:fromString((check payload.hospitalId).toString());

    //     // Verify donor exists
    //     sql:ParameterizedQuery donorQuery = `SELECT donor_id FROM donor WHERE donor_id = ${donorId}`;
    //     record {|int donor_id;|}? donor = check database:dbClient->queryRow(donorQuery);
    //     if donor is () {
    //         return error("Donor not found");
    //     }

    //     // Verify hospital exists
    //     sql:ParameterizedQuery hospitalQuery = `SELECT hospital_id FROM hospital WHERE hospital_id = ${hospitalId}`;
    //     record {|int hospital_id;|}? hospital = check database:dbClient->queryRow(hospitalQuery);
    //     if hospital is () {
    //         return error("Hospital not found");
    //     }

    //     // Check for existing pending request
    //     sql:ParameterizedQuery checkQuery = `SELECT donation_id FROM donation 
    //                                          WHERE donor_id = ${donorId} 
    //                                          AND hospital_id = ${hospitalId} 
    //                                          AND donate_status = 'Pending'`;
    //     record {|int donation_id;|}?|sql:Error existing = database:dbClient->queryRow(checkQuery);

    //     if existing is record {|int donation_id;|} {
    //         return error("You have already requested to donate at this hospital");
    //     } else if existing is sql:Error {
    //         return error("Database error checking existing request");
    //     }

    //     // Insert donation record
    //     sql:ParameterizedQuery insertQuery = `INSERT INTO donation (donor_id, hospital_id, donate_status)
    //                                          VALUES (${donorId}, ${hospitalId}, 'Pending')`;
    //     sql:ExecutionResult result = check database:dbClient->execute(insertQuery);

    //     if result.affectedRowCount == 0 {
    //         return error("Failed to record donation");
    //     }

    //     string|int? donationId = result.lastInsertId;
    //     io:println("Donation recorded for donor_id: ", donorId, ", hospital_id: ", hospitalId, ", donation_id: ", donationId);
    //     return {"message": "Donation request recorded successfully", "donationId": donationId};
    // }

    resource function post donation(http:Request req) returns http:Response|error {
    http:Response response = new;
    
    // Validate authentication
    AuthValidationResult|error authResult = validateDonorToken(req);
    if authResult is error {
        response.statusCode = 401;
        response.setJsonPayload({"error": "Authentication failed", "message": authResult.message()});
        return response;
    }
    if !authResult.isValid {
        response.statusCode = 401;
        response.setJsonPayload({"error": "Access denied", "message": "Authentication required"});
        return response;
    }

    // Extract donor ID from authentication token
    int|error donorIdResult = int:fromString(authResult.userId);
    if donorIdResult is error {
        response.statusCode = 400;
        response.setJsonPayload({"error": "Invalid authenticated user ID"});
        return response;
    }
    int donorId = donorIdResult;

    // Parse request payload
    json|error payloadResult = req.getJsonPayload();
    if payloadResult is error {
        response.statusCode = 400;
        response.setJsonPayload({"error": "Invalid JSON payload", "message": payloadResult.message()});
        return response;
    }
    json payload = payloadResult;

    // Extract and validate hospitalId from payload (donorId no longer needed in payload)
    json|error hospitalIdJson = payload.hospitalId;
    if hospitalIdJson is error {
        response.statusCode = 400;
        response.setJsonPayload({"error": "Missing hospitalId in request"});
        return response;
    }
    
    int|error hospitalIdResult = int:fromString(hospitalIdJson.toString());
    if hospitalIdResult is error {
        response.statusCode = 400;
        response.setJsonPayload({"error": "Invalid hospitalId format"});
        return response;
    }
    int hospitalId = hospitalIdResult;

    // Verify donor exists using query to handle not found properly
    sql:ParameterizedQuery donorQuery = `SELECT donor_id FROM donor WHERE donor_id = ${donorId}`;
    stream<record {|int donor_id;|}, sql:Error?> donorStream = database:dbClient->query(donorQuery);
    record {|int donor_id;|}[]|sql:Error donorRecords = from record {|int donor_id;|} donor in donorStream
                                                        select donor;
    
    if donorRecords is sql:Error {
        io:println("SQL Error verifying donor: ", donorRecords.message());
        response.statusCode = 500;
        response.setJsonPayload({"error": "Database error", "message": "Failed to verify donor"});
        return response;
    }
    
    if donorRecords.length() == 0 {
        response.statusCode = 404;
        response.setJsonPayload({"error": "Donor not found"});
        return response;
    }

    // Verify hospital exists using query
    sql:ParameterizedQuery hospitalQuery = `SELECT hospital_id FROM hospital WHERE hospital_id = ${hospitalId}`;
    stream<record {|int hospital_id;|}, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery);
    record {|int hospital_id;|}[]|sql:Error hospitalRecords = from record {|int hospital_id;|} hospital in hospitalStream
                                                              select hospital;
    
    if hospitalRecords is sql:Error {
        io:println("SQL Error verifying hospital: ", hospitalRecords.message());
        response.statusCode = 500;
        response.setJsonPayload({"error": "Database error", "message": "Failed to verify hospital"});
        return response;
    }
    
    if hospitalRecords.length() == 0 {
        response.statusCode = 404;
        response.setJsonPayload({"error": "Hospital not found"});
        return response;
    }

    // Check for existing pending request
    sql:ParameterizedQuery checkQuery = `SELECT donation_id FROM donation 
                                         WHERE donor_id = ${donorId} 
                                         AND hospital_id = ${hospitalId} 
                                         AND donate_status = 'Pending'`;
    
    stream<record {|int donation_id;|}, sql:Error?> existingStream = database:dbClient->query(checkQuery);
    record {|int donation_id;|}[]|sql:Error existingRecords = from record {|int donation_id;|} donation in existingStream
                                                               select donation;
    
    if existingRecords is sql:Error {
        io:println("SQL Error checking existing request: ", existingRecords.message());
        response.statusCode = 500;
        response.setJsonPayload({"error": "Database error", "message": "Failed to check existing requests"});
        return response;
    }
    
    if existingRecords.length() > 0 {
        response.statusCode = 409; // Conflict
        response.setJsonPayload({"error": "Duplicate request", "message": "You have already requested to donate at this hospital"});
        return response;
    }

    // Insert donation record
    sql:ParameterizedQuery insertQuery = `INSERT INTO donation (donor_id, hospital_id, donate_status)
                                         VALUES (${donorId}, ${hospitalId}, 'Pending')`;
    
    sql:ExecutionResult|sql:Error insertResult = database:dbClient->execute(insertQuery);
    if insertResult is sql:Error {
        io:println("SQL Error inserting donation: ", insertResult.message());
        response.statusCode = 500;
        response.setJsonPayload({"error": "Database error", "message": "Failed to record donation"});
        return response;
    }

    sql:ExecutionResult result = insertResult;
    if result.affectedRowCount == 0 {
        response.statusCode = 500;
        response.setJsonPayload({"error": "Insert failed", "message": "No rows affected during donation recording"});
        return response;
    }

    string|int? donationId = result.lastInsertId;
    io:println("Donation recorded successfully - donor_id: ", donorId, ", hospital_id: ", hospitalId, ", donation_id: ", donationId);
    
    response.statusCode = 201; // Created
    response.setJsonPayload({
        "message": "Donation request recorded successfully", 
        "donationId": donationId,
        "donorId": donorId,
        "hospitalId": hospitalId
    });
    return response;
}


}

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
    
    io:println("validateDonorToken: Token is valid");
    io:println("validateDonorToken: Extracted role: '" + authResult.role + "'");
    io:println("validateDonorToken: Extracted userId: '" + authResult.userId + "'");
    io:println("validateDonorToken: Extracted email: '" + authResult.email + "'");
    
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

public function startDonorsService() returns error? {
    io:println("Donors service with authentication started on port: 9095");
}


