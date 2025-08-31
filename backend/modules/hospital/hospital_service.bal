


import ballerina/http;
import ballerina/sql;
import ballerina/log;
import ballerina/time;
import ballerina/email;
import ballerina/mime;
import ballerina/io;
import backend.database;
import ballerina/regex as re;
import ballerina/lang.array as arrays;
import ballerina/crypto;

// // Gmail SMTP configuration
// email:SmtpConfiguration smtpConfig = {
//     port: 587,
//     security: email:START_TLS_AUTO
// };

// email:SmtpClient smtpClient = check new (
//     "smtp.gmail.com",
//     "anjana.n.sathsara123@gmail.com",  // Replace with your Gmail address
//     "your-app-password",  // Replace with your Gmail App Password
//     smtpConfig
// );

// configurable string smtpHost = ?;
// configurable int smtpPort = ?;
// configurable string smtpUser = ?;
// configurable string smtpPassword = ?;

// email:SmtpConfiguration smtpConfig = {
//     port: smtpPort,
//     security: email:START_TLS_AUTO
// };

// email:SmtpClient smtpClient = check new (
//     smtpHost,
//     smtpUser,
//     smtpPassword,
//     smtpConfig
// );


// In donors.bal
configurable string smtpHost = ?;
configurable int smtpPort = ?;
configurable string smtpUser = ?;
configurable string smtpPassword = ?;

email:SmtpConfiguration smtpConfig = {
    port: smtpPort,
    security: email:START_TLS_AUTO
};

email:SmtpClient smtpClient = check new (
    smtpHost,
    smtpUser,
    smtpPassword,
    smtpConfig
);

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"], // Restrict to specific origin for security
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowCredentials: true
    }
}
service /hospital on database:hospitalListener {

    // Protected: Get user profile from JWT token
    resource function get profile(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        stream<HospitalUser, sql:Error?> resultStream = database:dbClient->query(`
            SELECT hospital_email as user_id, hospital_email as email, hospital_email as full_name, 
                   hospital_id, 'hospital_user' as role, status
            FROM hospital_user
            WHERE hospital_email = ${userData.email} AND status = 'active'
        `);

        HospitalUser[] users = [];
        check resultStream.forEach(function(HospitalUser row) {
            users.push(row);
        });

        http:Response response = new;
        if users.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "User not found or inactive" 
            });
            response.statusCode = 404;
        } else {
            response.setJsonPayload({
                status: "success",
                data: users[0].toJson()
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Get all blood requests for the user's hospital
    resource function get bloodrequests(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
            SELECT request_id, hospital_id, admission_number, blood_group, units_required, 
                   request_date, request_status, notes
            FROM blood_request
            WHERE hospital_id = ${hospitalId} AND is_deleted = 0
            ORDER BY request_date DESC
        `);

        BloodRequest[] requests = [];
        check resultStream.forEach(function(BloodRequest row) {
            requests.push(row);
        });

        http:Response response = new;
        response.setJsonPayload({
            status: "success",
            data: requests.map(r => r.toJson())
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Update blood request
    resource function put bloodrequests/[int requestId](http:Request req, @http:Payload BloodRequestUpdate updateData) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_request
            SET admission_number = ${updateData.admission_number},
                blood_group = ${updateData.blood_group},
                units_required = ${updateData.units_required},
                notes = ${updateData.notes},
                request_status = ${updateData.request_status}
            WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
        `);

        http:Response response = new;
        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Update failed. Request not found or access denied." 
            });
            response.statusCode = 404;
        } else {
            response.setJsonPayload({ 
                status: "success", 
                message: "Request updated successfully."
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Add new blood request
    resource function post bloodrequests/add(http:Request req, @http:Payload NewBloodRequest requestData) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_request 
                (hospital_id, blood_group, units_required, request_status, notes, admission_number, is_deleted)
            VALUES (${hospitalId}, ${requestData.blood_group}, ${requestData.units_required}, 
                    ${requestData.request_status}, ${requestData.notes}, ${requestData.admission_number}, 0)
        `);

        http:Response response = new;
        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to create blood request." 
            });
            response.statusCode = 500;
        } else {
            response.setJsonPayload({ 
                status: "success", 
                message: "Blood request submitted successfully."
            });
            response.statusCode = 201;
        }
        return response;
    }

    // Protected: Delete blood request
    resource function delete bloodrequests/[int requestId](http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Check if blood request exists and belongs to hospital
        stream<record {| int request_id; string request_status; |}, sql:Error?> requestStream = database:dbClient->query(`
            SELECT request_id, request_status
            FROM blood_request 
            WHERE request_id = ${requestId} AND hospital_id = ${hospitalId} AND is_deleted = 0
        `);

        record {| int request_id; string request_status; |}[] requests = [];
        error? streamError = requestStream.forEach(function(record {| int request_id; string request_status; |} row) {
            requests.push(row);
        });

        http:Response response = new;
        if streamError is error {
            log:printError("Database query error: " + streamError.message());
            response.setJsonPayload({ 
                status: "error", 
                message: "Database error: " + streamError.message() 
            });
            response.statusCode = 500;
            return response;
        }

        if requests.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Blood request not found or access denied." 
            });
            response.statusCode = 404;
            return response;
        }

        // Soft delete - mark as deleted instead of actually deleting
        sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
            UPDATE blood_request 
            SET is_deleted = 1
            WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
        `);

        if result is sql:Error {
            log:printError("Delete query error: " + result.message());
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to delete request: " + result.message() 
            });
            response.statusCode = 500;
            return response;
        }

        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to delete blood request. No rows affected." 
            });
            response.statusCode = 500;
            return response;
        }

        log:printInfo("Blood request deleted successfully: request_id=" + requestId.toString() + ", hospital_id=" + hospitalId.toString());

        response.setJsonPayload({ 
            status: "success", 
            message: "Blood request deleted successfully.",
            request_id: requestId
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Get blood groups stock
    resource function get bloodgroups(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        stream<BloodGroupStock, sql:Error?> resultStream = database:dbClient->query(`
            SELECT blood_name, quantity
            FROM blood_group
            WHERE hospital_id = ${hospitalId}
            ORDER BY blood_name
        `);

        BloodGroupStock[] stockList = [];
        check resultStream.forEach(function(BloodGroupStock row) {
            stockList.push(row);
        });

        http:Response response = new;
        response.setJsonPayload({
            status: "success",
            data: stockList.map(s => s.toJson())
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Add/Update blood group stock
    resource function post bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_group (hospital_id, blood_name, quantity)
            VALUES (${hospitalId}, ${stockData.blood_name}, ${stockData.quantity})
            ON DUPLICATE KEY UPDATE quantity = ${stockData.quantity}
        `);

        http:Response response = new;
        if result.affectedRowCount > 0 {
            response.setJsonPayload({ 
                status: "success", 
                message: "Blood group stock saved successfully." 
            });
            response.statusCode = 200;
        } else {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to save blood group stock." 
            });
            response.statusCode = 500;
        }
        return response;
    }

    // Protected: Update blood group stock
    resource function put bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_group
            SET quantity = ${stockData.quantity},
                last_modified = NOW()
            WHERE hospital_id = ${hospitalId} 
              AND blood_name = ${stockData.blood_name}
        `);

        http:Response response = new;
        if result.affectedRowCount > 0 {
            response.setJsonPayload({ 
                status: "success", 
                message: "Blood group stock updated successfully." 
            });
            response.statusCode = 200;
        } else {
            response.setJsonPayload({ 
                status: "error", 
                message: "Blood group not found or already deleted." 
            });
            response.statusCode = 404;
        }
        return response;
    }

    // Protected: Update donation status
    resource function post updateStatus(http:Request req, @http:Payload DonationStatusUpdate statusUpdate) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        sql:ExecutionResult result;
        
        if statusUpdate.new_status == "Complete" {
            time:Utc slTime = getSriLankaTime();
            string currentDateTime = time:utcToString(slTime);
            string datePart = currentDateTime.substring(0, 10);
            string timePart = currentDateTime.substring(11, 19);
            string formattedDateTime = datePart + " " + timePart;
            
            result = check database:dbClient->execute(`
                UPDATE donation 
                SET donate_status = ${statusUpdate.new_status},
                    donate_date = ${formattedDateTime}
                WHERE donation_id = ${statusUpdate.donation_id} 
                AND hospital_id = ${hospitalId}
            `);

            if result.affectedRowCount > 0 {
                record {| int donor_id; |} donorRow = check database:dbClient->queryRow(
                    `SELECT donor_id FROM donation WHERE donation_id = ${statusUpdate.donation_id}`
                );
                int donorId = donorRow.donor_id;

                sql:ExecutionResult donorUpdateResult = check database:dbClient->execute(`
                    UPDATE donor 
                    SET last_donation_date = ${formattedDateTime}
                    WHERE donor_id = ${donorId}
                `);

                if donorUpdateResult.affectedRowCount == 0 {
                    log:printWarn("Failed to update donor's last_donation_date for donor_id: " + donorId.toString());
                }
            }
        } else {
            result = check database:dbClient->execute(`
                UPDATE donation 
                SET donate_status = ${statusUpdate.new_status}
                WHERE donation_id = ${statusUpdate.donation_id} 
                AND hospital_id = ${hospitalId}
            `);
        }

        http:Response response = new;
        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Update failed. Donation not found or access denied." 
            });
            response.statusCode = 404;
        } else {
            response.setJsonPayload({ 
                status: "success", 
                message: "Donation status updated successfully." 
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Get donations with donor details
    resource function get donationsWithDonors(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        stream<DonationDonor, sql:Error?> resultStream = database:dbClient->query(
            `SELECT 
                d.donation_id,
                dn.donor_id,
                dn.donor_name,
                dn.email,
                dn.phone_number,
                dn.blood_group,
                dn.last_donation_date,
                d.donate_status,
                d.donate_date,
                dn.status
             FROM donation d
             INNER JOIN donor dn ON d.donor_id = dn.donor_id
             WHERE d.hospital_id = ${hospitalId} 
             AND dn.status = 'active'
             ORDER BY d.donate_date DESC`
        );

        DonationDonor[] donations = [];
        check resultStream.forEach(function(DonationDonor row) {
            donations.push(row);
        });

        http:Response response = new;
        response.setJsonPayload({
            status: "success",
            data: donations.map(d => d.toJson())
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Delete (deactivate) donor
    resource function delete donors/[int donorId](http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Check if donor exists
        stream<record {| int donor_id; string status; |}, sql:Error?> donorStream = database:dbClient->query(`
            SELECT donor_id, status
            FROM donor 
            WHERE donor_id = ${donorId}
        `);

        record {| int donor_id; string status; |}[] donors = [];
        error? streamError = donorStream.forEach(function(record {| int donor_id; string status; |} row) {
            donors.push(row);
        });

        http:Response response = new;
        if streamError is error {
            log:printError("Database query error: " + streamError.message());
            response.setJsonPayload({ 
                status: "error", 
                message: "Database error: " + streamError.message() 
            });
            response.statusCode = 500;
            return response;
        }

        if donors.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Donor not found or access denied." 
            });
            response.statusCode = 404;
            return response;
        }

        record {| int donor_id; string status; |} donor = donors[0];

        if donor.status == "deactive" {
            response.setJsonPayload({ 
                status: "error", 
                message: "Donor is already deactivated." 
            });
            response.statusCode = 400;
            return response;
        }

        sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
            UPDATE donor 
            SET status = 'deactive'
            WHERE donor_id = ${donorId}
        `);

        if result is sql:Error {
            log:printError("Update query error: " + result.message());
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to update donor: " + result.message() 
            });
            response.statusCode = 500;
            return response;
        }

        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to deactivate donor. No rows affected." 
            });
            response.statusCode = 500;
            return response;
        }

        log:printInfo("Donor deactivated successfully: donor_id=" + donorId.toString() + ", hospital_id=" + hospitalId.toString());

        response.setJsonPayload({ 
            status: "success", 
            message: "Donor deactivated successfully.",
            donor_id: donorId
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Send donation certificate
    resource function post sendCertificate(http:Request req, @http:Payload CertificateRequest certificateRequest) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Get donation details
        stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
            `SELECT 
                d.donation_id,
                dn.donor_id,
                dn.donor_name,
                dn.email,
                dn.phone_number,
                dn.blood_group,
                dn.last_donation_date,
                d.donate_status,
                d.donate_date
             FROM donation d
             INNER JOIN donor dn ON d.donor_id = dn.donor_id
             WHERE d.donation_id = ${certificateRequest.donation_id} 
             AND d.hospital_id = ${hospitalId}
             AND d.donate_status = 'Complete'`
        );

        DonationDonor[] donationDetails = [];
        error? streamError = donationStream.forEach(function(DonationDonor row) {
            donationDetails.push(row);
        });

        http:Response response = new;
        if streamError is error {
            log:printError("Failed to fetch donation details: " + streamError.message());
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to fetch donation details: " + streamError.message() 
            });
            response.statusCode = 500;
            return response;
        }

        if donationDetails.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Donation not found or not completed" 
            });
            response.statusCode = 404;
            return response;
        }

        DonationDonor donation = donationDetails[0];
        string certificateHtml = generateCertificateHtml(donation, certificateRequest.hospital_name ?: "City General Hospital");

        // Send email with certificate
        if donation.email is string && donation.email.trim().length() > 0 {
            error? emailResult = smtpClient->sendMessage({
                to: donation.email,
                subject: "Blood Donation Certificate - Thank You for Your Contribution",
                body: certificateHtml,
                'from: "anjana.n.sathsara123@gmail.com",
                contentType: mime:TEXT_HTML
            });

            if emailResult is error {
                log:printError("Failed to send certificate email to " + donation.email + ": " + emailResult.message());
                response.setJsonPayload({ 
                    status: "error", 
                    message: "Failed to send certificate: " + emailResult.message() 
                });
                response.statusCode = 500;
                return response;
            }
        } else {
            log:printWarn("No valid email address found for donor: " + donation.donor_name);
            response.setJsonPayload({ 
                status: "error", 
                message: "No valid email address available for donor" 
            });
            response.statusCode = 400;
            return response;
        }

        // Update certificate sent status
        time:Utc slTime = getSriLankaTime();
        time:Civil civilTime = time:utcToCivil(slTime);
        string formattedDateTime = string `${civilTime.year}-${civilTime.month.toString().padStart(2, "0")}-${civilTime.day.toString().padStart(2, "0")} ${civilTime.hour.toString().padStart(2, "0")}:${civilTime.minute.toString().padStart(2, "0")}:${civilTime.second.toString().padStart(2, "0")}`;

        sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
            UPDATE donation 
            SET certificate_sent = 1,
                certificate_sent_date = ${formattedDateTime}
            WHERE donation_id = ${certificateRequest.donation_id} 
            AND hospital_id = ${hospitalId}
        `);

        if result is sql:Error {
            log:printError("Failed to update certificate status: " + result.message());
        }

        log:printInfo("Certificate sent successfully to: " + donation.email);
        
        response.setJsonPayload({ 
            status: "success", 
            message: "Certificate sent successfully to " + donation.email,
            donor_name: donation.donor_name
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Get certificate preview
    resource function get certificatePreview/[int donationId](http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        string? hospitalNameParam = req.getQueryParamValue("hospital_name");
        string hospitalName = hospitalNameParam ?: "City General Hospital";

        // Get donation details
        stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
            `SELECT 
                d.donation_id,
                dn.donor_id,
                dn.donor_name,
                dn.email,
                dn.phone_number,
                dn.blood_group,
                dn.last_donation_date,
                d.donate_status,
                d.donate_date
             FROM donation d
             INNER JOIN donor dn ON d.donor_id = dn.donor_id
             WHERE d.donation_id = ${donationId} 
             AND d.hospital_id = ${hospitalId}
             AND d.donate_status = 'Complete'`
        );

        DonationDonor[] donationDetails = [];
        check donationStream.forEach(function(DonationDonor row) {
            donationDetails.push(row);
        });

        http:Response response = new;
        if donationDetails.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Donation not found or not completed" 
            });
            response.statusCode = 404;
            return response;
        }

        DonationDonor donation = donationDetails[0];
        string certificateHtml = generateCertificateHtml(donation, hospitalName);

        response.setJsonPayload({
            status: "success",
            html: certificateHtml,
            donor_name: donation.donor_name,
            blood_group: donation.blood_group,
            donation_date: donation.donate_date
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Get hospital details
    resource function get hospital(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        record {| string hospital_name; |}? hospital = check database:dbClient->queryRow(
            `SELECT hospital_name FROM hospital WHERE hospital_id = ${hospitalId}`
        );

        http:Response response = new;
        if hospital is () {
            response.setJsonPayload({ 
                status: "error", 
                message: "Hospital not found" 
            });
            response.statusCode = 404;
        } else {
            response.setJsonPayload({ 
                status: "success", 
                hospital_name: hospital.hospital_name 
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Get total donors count
    resource function get totalDonors(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        record {| int donor_count; |} result = check database:dbClient->queryRow(
            `SELECT COUNT(DISTINCT donor_id) AS donor_count 
             FROM donation 
             WHERE hospital_id = ${hospitalId}`
        );

        http:Response response = new;
        response.setJsonPayload({ 
            status: "success", 
            total_donors: result.donor_count 
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Get total donations count
    resource function get totalDonations(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        record {| int donation_count; |} result = check database:dbClient->queryRow(
            `SELECT COUNT(*) AS donation_count 
             FROM donation 
             WHERE hospital_id = ${hospitalId} 
             AND donate_status = 'Complete'`
        );

        http:Response response = new;
        response.setJsonPayload({ 
            status: "success", 
            total_donations: result.donation_count 
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Get all blood campaigns
    resource function get bloodcampaigns(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        stream<BloodCampaign, sql:Error?> resultStream = database:dbClient->query(`
            SELECT campaign_id, hospital_id, title, location, date, status
            FROM blood_campaign
            WHERE hospital_id = ${hospitalId} AND status = 'active'
            ORDER BY date DESC
        `);

        BloodCampaign[] campaigns = [];
        check resultStream.forEach(function(BloodCampaign row) {
            campaigns.push(row);
        });

        http:Response response = new;
        response.setJsonPayload({
            status: "success",
            data: campaigns.map(c => c.toJson())
        });
        response.statusCode = 200;
        return response;
    }

    // Protected: Add new blood campaign
    resource function post bloodcampaigns/add(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Handle multipart form data
        mime:Entity[]? bodyParts = check req.getBodyParts();
        http:Response response = new;
        
        if bodyParts is () {
            response.setJsonPayload({ 
                status: "error", 
                message: "No form data received" 
            });
            response.statusCode = 400;
            return response;
        }

        string title = "";
        string location = "";
        string campaignDate = "";
        byte[]? imageData = ();

        // Process form data
        foreach mime:Entity part in bodyParts {
            string? contentDisposition = part.getContentDisposition().name;
            if contentDisposition is string {
                match contentDisposition {
                    "title" => {
                        title = check part.getText();
                    }
                    "location" => {
                        location = check part.getText();
                    }
                    "date" => {
                        campaignDate = check part.getText();
                    }
                    "image" => {
                        imageData = check part.getByteArray();
                    }
                }
            }
        }

        // Validate required fields
        if title.trim().length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Campaign title is required" 
            });
            response.statusCode = 400;
            return response;
        }
        if location.trim().length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Location is required" 
            });
            response.statusCode = 400;
            return response;
        }
        if campaignDate.trim().length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Date is required" 
            });
            response.statusCode = 400;
            return response;
        }
        if imageData is () {
            response.setJsonPayload({ 
                status: "error", 
                message: "Image is required" 
            });
            response.statusCode = 400;
            return response;
        }

        // Insert campaign into database
        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_campaign (hospital_id, title, location, image, date, status)
            VALUES (${hospitalId}, ${title.trim()}, ${location.trim()}, ${imageData}, ${campaignDate}, 'active')
        `);

        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to add campaign" 
            });
            response.statusCode = 500;
        } else {
            response.setJsonPayload({ 
                status: "success", 
                message: "Campaign added successfully",
                campaign_id: result.lastInsertId
            });
            response.statusCode = 201;
        }
        return response;
    }

    // Protected: Update blood campaign
    resource function put bloodcampaigns/[int campaignId](http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Handle multipart form data
        mime:Entity[]? bodyParts = check req.getBodyParts();
        http:Response response = new;
        
        if bodyParts is () {
            response.setJsonPayload({ 
                status: "error", 
                message: "No form data received" 
            });
            response.statusCode = 400;
            return response;
        }

        string title = "";
        string location = "";
        string campaignDate = "";
        byte[]? imageData = ();

        // Process form data
        foreach mime:Entity part in bodyParts {
            string? contentDisposition = part.getContentDisposition().name;
            if contentDisposition is string {
                match contentDisposition {
                    "title" => {
                        title = check part.getText();
                    }
                    "location" => {
                        location = check part.getText();
                    }
                    "date" => {
                        campaignDate = check part.getText();
                    }
                    "image" => {
                        imageData = check part.getByteArray();
                    }
                }
            }
        }

        // Validate required fields
        if title.trim().length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Campaign title is required" 
            });
            response.statusCode = 400;
            return response;
        }
        if location.trim().length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Location is required" 
            });
            response.statusCode = 400;
            return response;
        }
        if campaignDate.trim().length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Date is required" 
            });
            response.statusCode = 400;
            return response;
        }

        // First verify campaign exists and belongs to hospital
        stream<record {| int campaign_id; |}, sql:Error?> verifyStream = database:dbClient->query(`
            SELECT campaign_id
            FROM blood_campaign
            WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId} AND status = 'active'
        `);

        record {| int campaign_id; |}[] campaigns = [];
        check verifyStream.forEach(function(record {| int campaign_id; |} row) {
            campaigns.push(row);
        });

        if campaigns.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Campaign not found or access denied" 
            });
            response.statusCode = 404;
            return response;
        }

        // Update campaign - with or without image
        sql:ExecutionResult result;
        if imageData is byte[] {
            // Update with new image
            result = check database:dbClient->execute(`
                UPDATE blood_campaign 
                SET title = ${title.trim()}, 
                    location = ${location.trim()}, 
                    image = ${imageData}, 
                    date = ${campaignDate}
                WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId}
            `);
        } else {
            // Update without changing image
            result = check database:dbClient->execute(`
                UPDATE blood_campaign 
                SET title = ${title.trim()}, 
                    location = ${location.trim()}, 
                    date = ${campaignDate}
                WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId}
            `);
        }

        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to update campaign" 
            });
            response.statusCode = 500;
        } else {
            response.setJsonPayload({ 
                status: "success", 
                message: "Campaign updated successfully" 
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Delete (deactivate) blood campaign
    resource function delete bloodcampaigns/[int campaignId](http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // First check if campaign exists and is active
        stream<record {| int campaign_id; string status; |}, sql:Error?> campaignStream = database:dbClient->query(`
            SELECT campaign_id, status
            FROM blood_campaign 
            WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId}
        `);

        record {| int campaign_id; string status; |}[] campaigns = [];
        check campaignStream.forEach(function(record {| int campaign_id; string status; |} row) {
            campaigns.push(row);
        });

        http:Response response = new;
        if campaigns.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Campaign not found or access denied" 
            });
            response.statusCode = 404;
            return response;
        }

        record {| int campaign_id; string status; |} campaign = campaigns[0];

        // Check if campaign is already deactivated
        if campaign.status == "deactive" {
            response.setJsonPayload({ 
                status: "error", 
                message: "Campaign is already deactivated" 
            });
            response.statusCode = 400;
            return response;
        }

        // Update campaign status to deactive
        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_campaign 
            SET status = 'deactive'
            WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId}
        `);

        if result.affectedRowCount == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "Failed to deactivate campaign" 
            });
            response.statusCode = 500;
        } else {
            log:printInfo("Campaign deactivated successfully: campaign_id=" + campaignId.toString() + ", hospital_id=" + hospitalId.toString());
            response.setJsonPayload({ 
                status: "success", 
                message: "Campaign deactivated successfully",
                campaign_id: campaignId
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Get campaign image
    resource function get bloodcampaigns/image/[int campaignId](http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Get image data from database
        stream<record {| byte[] image; |}, sql:Error?> imageStream = database:dbClient->query(`
            SELECT image
            FROM blood_campaign
            WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId} AND status = 'active'
        `);

        record {| byte[] image; |}[] images = [];
        check imageStream.forEach(function(record {| byte[] image; |} row) {
            images.push(row);
        });

        if images.length() == 0 {
            return createErrorResponse("Image not found", 404);
        }

        // Create response with image
        http:Response response = new;
        response.setBinaryPayload(images[0].image);
        error? contentType = response.setContentType("image/jpeg");
        if contentType is error {
            // Handle error if needed
        }
        return response;
    }

    // Protected: Get hospital profile
    resource function get profiles(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        stream<HospitalProfile, sql:Error?> resultStream = database:dbClient->query(`
            SELECT hu.hospital_email as email, h.hospital_name as full_name, 
                   hu.hospital_id, 'hospital_user' as role, hu.status,
                   h.hospital_type, h.hospital_address, h.contact_number, 
                   h.district_id, h.latitude, h.longitude
            FROM hospital_user hu
            INNER JOIN hospital h ON hu.hospital_id = h.hospital_id
            WHERE hu.hospital_email = ${userData.email} AND hu.status = 'active'
        `);

        HospitalProfile[] profiles = [];
        check resultStream.forEach(function(HospitalProfile row) {
            profiles.push(row);
        });

        http:Response response = new;
        if profiles.length() == 0 {
            response.setJsonPayload({ 
                status: "error", 
                message: "User not found or inactive" 
            });
            response.statusCode = 404;
        } else {
            response.setJsonPayload({
                status: "success",
                data: profiles[0].toJson()
            });
            response.statusCode = 200;
        }
        return response;
    }

    // Protected: Update hospital profile
    resource function put profile(http:Request req, @http:Payload HospitalUpdate updateData) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        int|http:Response hospitalIdResult = getHospitalIdFromUser(userData.email);
        if hospitalIdResult is http:Response {
            return hospitalIdResult;
        }
        int hospitalId = hospitalIdResult;

        // Fetch current hospital details
        record {| 
            string hospital_name; 
            string? hospital_type; 
            string? hospital_address; 
            string? contact_number; 
            int district_id; 
            decimal latitude; 
            decimal longitude; 
        |}? currentHospital = check database:dbClient->queryRow(`
            SELECT hospital_name, hospital_type, hospital_address, contact_number, 
                   district_id, latitude, longitude
            FROM hospital
            WHERE hospital_id = ${hospitalId}
        `);

        if currentHospital is () {
            return createErrorResponse("Hospital not found", 404);
        }

        // Use updated values or current values
        string hospital_name = updateData.hospital_name ?: currentHospital.hospital_name;
        string? hospital_type = updateData.hospital_type ?: currentHospital.hospital_type;
        string? hospital_address = updateData.hospital_address ?: currentHospital.hospital_address;
        string? contact_number = updateData.contact_number ?: currentHospital.contact_number;
        int district_id = updateData.district_id ?: currentHospital.district_id;
        decimal latitude = updateData.latitude ?: currentHospital.latitude;
        decimal longitude = updateData.longitude ?: currentHospital.longitude;

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE hospital
            SET hospital_name = ${hospital_name},
                hospital_type = ${hospital_type},
                hospital_address = ${hospital_address},
                contact_number = ${contact_number},
                district_id = ${district_id},
                latitude = ${latitude},
                longitude = ${longitude}
            WHERE hospital_id = ${hospitalId}
        `);

        http:Response response = new;
        if result.affectedRowCount > 0 {
            response.setJsonPayload({ 
                status: "success", 
                message: "Profile updated successfully." 
            });
            response.statusCode = 200;
        } else {
            response.setJsonPayload({ 
                status: "error", 
                message: "No changes made or update failed." 
            });
            response.statusCode = 400;
        }
        return response;
    }

    // Protected: Get district list
    resource function get districts(http:Request req) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }

        stream<District, sql:Error?> resultStream = database:dbClient->query(`
            SELECT district_id, district_name 
            FROM district 
            ORDER BY district_name ASC
        `);

        District[] districts = [];
        check resultStream.forEach(function(District row) {
            districts.push(row);
        });

        http:Response response = new;
        response.setJsonPayload({
            status: "success",
            data: districts.map(d => d.toJson())
        });
        response.statusCode = 200;
        return response;
    }

    // New: Protected endpoint to change password
resource function post changePassword(http:Request req, @http:Payload PasswordChangeRequest passwordData) returns http:Response|error {
        UserPayload|http:Response userResult = extractUserFromToken(req);
        if userResult is http:Response {
            return userResult;
        }
        UserPayload userData = userResult;

        // Ensure user has hospital_user role
        if userData.role != "hospital_user" {
            return createErrorResponse("Insufficient permissions - hospital_user role required", 403);
        }

        // Validate input
        if passwordData.old_password.trim().length() == 0 || passwordData.new_password.trim().length() == 0 {
            return createErrorResponse("Old and new passwords are required", 400);
        }

        if passwordData.new_password.length() < 6 {
            return createErrorResponse("New password must be at least 6 characters long", 400);
        }

        // Fetch current password hash
        stream<record {| string hospital_email; string password_hash; |}, sql:Error?> userStream = database:dbClient->query(`
            SELECT hospital_email, password_hash
            FROM hospital_user
            WHERE hospital_email = ${userData.email} AND status = 'active'
        `);

        record {| string hospital_email; string password_hash; |}[] users = [];
        error? streamError = userStream.forEach(function(record {| string hospital_email; string password_hash; |} row) {
            users.push(row);
        });

        http:Response response = new;
        if streamError is error {
            log:printError("Database error fetching user: " + streamError.message());
            return createErrorResponse("Database error: " + streamError.message(), 500);
        }

        if users.length() == 0 {
            return createErrorResponse("User not found or inactive", 404);
        }

        // Verify old password
        boolean|crypto:Error isValid = crypto:verifyBcrypt(passwordData.old_password, users[0].password_hash);
        if isValid is crypto:Error {
            log:printError("Password verification error: " + isValid.message());
            return createErrorResponse("Password verification failed", 500);
        }

        if !isValid {
            return createErrorResponse("Incorrect old password", 401);
        }

        // Hash new password
        string|crypto:Error newPasswordHash = crypto:hashBcrypt(passwordData.new_password);
        if newPasswordHash is crypto:Error {
            log:printError("Password hashing error: " + newPasswordHash.message());
            return createErrorResponse("Failed to process new password", 500);
        }

        // Update password in database
        sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
            UPDATE hospital_user
            SET password_hash = ${newPasswordHash}
            WHERE hospital_email = ${userData.email}
        `);

        if result is sql:Error {
            log:printError("Database update error: " + result.message());
            return createErrorResponse("Failed to update password: " + result.message(), 500);
        }

        if result.affectedRowCount == 0 {
            return createErrorResponse("Failed to update password. No rows affected.", 500);
        }

        log:printInfo("Password changed successfully for user: " + userData.email);

        response.setJsonPayload({
            status: "success",
            message: "Password changed successfully."
        });
        response.statusCode = 200;
        return response;
    }
}

// Helper function to get hospital_id from user email
function getHospitalIdFromUser(string email) returns int|http:Response {
    stream<record {int hospital_id;}, sql:Error?> hospitalStream = database:dbClient->query(`
        SELECT hospital_id 
        FROM hospital_user 
        WHERE hospital_email = ${email} AND status = 'active'
    `);

    record {int hospital_id;}[] hospitalResults = [];
    error? streamError = hospitalStream.forEach(function(record {int hospital_id;} row) {
        hospitalResults.push(row);
    });

    if streamError is error {
        log:printError("Database error while fetching hospital_id: " + streamError.message());
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Database error while fetching user hospital" 
        });
        response.statusCode = 500;
        return response;
    }

    if hospitalResults.length() == 0 {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "User not found or not associated with any hospital" 
        });
        response.statusCode = 403;
        return response;
    }

    return hospitalResults[0].hospital_id;
}

// Helper function to create error responses
function createErrorResponse(string message, int statusCode) returns http:Response {
    http:Response response = new;
    response.statusCode = statusCode;
    response.setJsonPayload({
        status: "error", 
        message: message
    });
    return response;
}

// Function to extract user data from JWT token
function extractUserFromToken(http:Request req) returns UserPayload|http:Response {
    // Get JWT token from cookie
    http:Cookie[] cookies = req.getCookies();
    string? token = ();
    
    foreach http:Cookie cookie in cookies {
        if cookie.name == "auth_token" || cookie.name == "hospital_auth_token" {
            token = cookie.value;
            break;
        }
    }
    
    if token is () {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Authentication required - no token found" 
        });
        response.statusCode = 401;
        return response;
    }

    // Parse the simple JWT token
    string[] tokenParts = re:split(token, "\\.");
    
    if tokenParts.length() < 2 {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Invalid token format" 
        });
        response.statusCode = 401;
        return response;
    }

    // Decode the payload (second part)
    string encodedPayload = tokenParts[1];
    byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);
    
    if payloadBytes is error {
        io:println("Base64 decode error: ", payloadBytes.message());
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Invalid token encoding" 
        });
        response.statusCode = 401;
        return response;
    }

    string|error payloadStr = string:fromBytes(payloadBytes);
    
    if payloadStr is error {
        io:println("String conversion error: ", payloadStr.message());
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Invalid token payload" 
        });
        response.statusCode = 401;
        return response;
    }

    json|error payloadJson = payloadStr.fromJsonString();
    
    if payloadJson is error {
        io:println("JSON parse error: ", payloadJson.message());
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Invalid token payload JSON" 
        });
        response.statusCode = 401;
        return response;
    }

    if !(payloadJson is map<json>) {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Invalid payload structure" 
        });
        response.statusCode = 401;
        return response;
    }

    map<json> payload = <map<json>>payloadJson;

    // Extract basic claims
    json? subData = payload["sub"];  // email
    json? expData = payload["exp"];  // expiration
    json? customClaimsData = payload["customClaims"];

    if subData is () || expData is () || customClaimsData is () {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Missing required token claims" 
        });
        response.statusCode = 401;
        return response;
    }

    // Validate expiration
    if expData is decimal {
        decimal currentTime = <decimal>time:utcNow()[0];
        if currentTime > expData {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Token has expired" 
            });
            response.statusCode = 401;
            return response;
        }
    }

    // Extract custom claims
    if !(customClaimsData is map<json>) {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Invalid custom claims structure" 
        });
        response.statusCode = 401;
        return response;
    }

    map<json> customClaims = <map<json>>customClaimsData;
    json? roleData = customClaims["role"];
    json? userIdData = customClaims["userId"];
    json? emailData = customClaims["email"];

    // Validate required fields
    if roleData is () || userIdData is () || emailData is () {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Missing user data in token" 
        });
        response.statusCode = 401;
        return response;
    }

    // Convert to proper types
    string role = roleData is string ? roleData : roleData.toString();
    string userId = userIdData is string ? userIdData : userIdData.toString();
    string email = emailData is string ? emailData : emailData.toString();

    // Check role - allow hospital_user role
    if role != "hospital_user" {
        http:Response response = new;
        response.setJsonPayload({ 
            status: "error", 
            message: "Insufficient permissions - hospital_user role required" 
        });
        response.statusCode = 403;
        return response;
    }

    // Extract hospital_id if present
    int? hospitalId = ();
    if userId != "" {
        int|error hospitalIdResult = int:fromString(userId);
        if hospitalIdResult is int {
            hospitalId = hospitalIdResult;
        }
    }

    io:println("Token validation successful for user: ", email, " with role: ", role);

    // Return user data
    UserPayload userData = {
        user_id: email, // Use email as user_id for hospital users
        email: email,
        role: role,
        hospital_id: hospitalId
    };

    return userData;
}

// Utility function for Sri Lanka time (UTC+05:30)
function getSriLankaTime() returns time:Utc {
    time:Utc utcNow = time:utcNow();
    return time:utcAddSeconds(utcNow, 5.5 * 3600); // Add 5 hours 30 minutes
}

// Function to generate certificate HTML
function generateCertificateHtml(DonationDonor donation, string hospitalName) returns string {
    string donationDateStr = donation.donate_date;
    string donationDate;
    if donationDateStr.length() >= 10 {
        string month = donationDateStr.substring(5, 7);
        string day = donationDateStr.substring(8, 10);
        string year = donationDateStr.substring(0, 4);
        donationDate = month + "/" + day + "/" + year;
    } else {
        donationDate = "N/A";
    }

    string certificateId = string `CERT-${donation.donation_id}-${time:utcNow()[0]}`;

    // Use Sri Lanka time for issued date
    time:Utc slTime = getSriLankaTime();
    string issuedDate = time:utcToString(slTime).substring(0, 10);

    return string `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Times New Roman', serif;
                margin: 0;
                padding: 40px;
                background-color: #f5f5f5;
            }
            .certificate {
                max-width: 800px;
                margin: 0 auto;
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                border: 8px solid #dc3545;
                border-radius: 15px;
                padding: 60px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                position: relative;
            }
            .certificate::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 2px solid #dc3545;
                border-radius: 8px;
                opacity: 0.3;
            }
            .header {
                margin-bottom: 40px;
            }
            .logo {
                font-size: 48px;
                color: #dc3545;
                margin-bottom: 10px;
            }
            .hospital-name {
                font-size: 28px;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .title {
                font-size: 36px;
                font-weight: bold;
                color: #dc3545;
                margin: 30px 0;
                text-transform: uppercase;
                letter-spacing: 3px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .subtitle {
                font-size: 20px;
                color: #666;
                margin-bottom: 40px;
                font-style: italic;
            }
            .recipient {
                font-size: 32px;
                font-weight: bold;
                color: #333;
                margin: 30px 0;
                text-decoration: underline;
                text-underline-offset: 8px;
                text-decoration-color: #dc3545;
            }
            .content {
                font-size: 18px;
                line-height: 1.8;
                color: #444;
                margin: 30px 0;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }
            .details {
                display: flex;
                justify-content: space-around;
                margin: 40px 0;
                flex-wrap: wrap;
            }
            .detail-item {
                text-align: center;
                margin: 10px;
            }
            .detail-label {
                font-size: 14px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            .detail-value {
                font-size: 18px;
                font-weight: bold;
                color: #dc3545;
                border-bottom: 2px solid #dc3545;
                padding-bottom: 5px;
                display: inline-block;
                min-width: 120px;
            }
            .signature-section {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
                align-items: end;
            }
            .signature {
                text-align: center;
                width: 200px;
            }
            .signature-line {
                border-top: 2px solid #333;
                margin-bottom: 10px;
                height: 1px;
            }
            .signature-title {
                font-size: 14px;
                color: #666;
                font-weight: bold;
            }
            .certificate-id {
                position: absolute;
                top: 30px;
                right: 30px;
                font-size: 12px;
                color: #999;
                font-family: 'Courier New', monospace;
            }
            .heart {
                color: #dc3545;
                font-size: 24px;
                margin: 0 10px;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="certificate-id">Certificate ID: ${certificateId}</div>
            
            <div class="header">
                <div class="logo">🏥</div>
                <div class="hospital-name">${hospitalName}</div>
            </div>
            
            <div class="title">Certificate of Appreciation</div>
            <div class="subtitle">Blood Donation Recognition</div>
            
            <div class="content">
                This is to certify that
            </div>
            
            <div class="recipient">${donation.donor_name}</div>
            
            <div class="content">
                has generously donated blood and made a significant contribution to saving lives in our community. 
                Your selfless act of kindness demonstrates the highest form of humanity and compassion.
                <span class="heart">❤️</span>
                <br><br>
                <em>"The gift of blood is the gift of life. Thank you for being a hero."</em>
            </div>
            
            <div class="details">
                <div class="detail-item">
                    <div class="detail-label">Blood Group</div>
                    <div class="detail-value">${donation.blood_group}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Donation Date</div>
                    <div class="detail-value">${donationDate}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Donor ID</div>
                    <div class="detail-value">#${donation.donor_id}</div>
                </div>
            </div>
            
            <div class="signature-section">
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-title">Medical Director</div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <div style="font-size: 16px; color: #666;">
                        Issued on ${issuedDate}
                    </div>
                </div>
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-title">Blood Bank Manager</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

public function startHospitalService() returns error? {
    log:printInfo("Hospital service started on port 9090");
}
