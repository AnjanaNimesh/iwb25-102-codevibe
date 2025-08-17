// import ballerina/http;
// import ballerina/sql;
// import ballerina/log;
// import backend.database;
// import ballerina/time;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }

// service /hospital on database:hospitalListener {

//     // Get all blood requests for a hospital
//     resource function get bloodrequests(http:Request req) returns BloodRequest[]|error {
//         // jwt:Payload payload = check common:getValidatedPayload(req);
//         // if !common:hasAnyRole(payload, ["Admin", "Hospital", "SuperAdmin"]) {
//         //     return error("Forbidden: No permission to view blood requests.");
//         // }

//         // int hospitalId = check common:getOrgId(payload);
//         // int hospitalId = 1; // Temporary: Set your testing hospital_id here

//             string? hospitalIdStr = req.getQueryParamValue("hospital_id");
// if hospitalIdStr is () {
//     return error("Missing hospital_id in request");
// }
// int hospitalId = check 'int:fromString(hospitalIdStr);

//         // stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
//         //     SELECT request_id, hospital_id,admission_number ,blood_group, units_required, request_date, request_status, notes
//         //     FROM blood_request
//         //     WHERE hospital_id = ${hospitalId}
//         //     ORDER BY request_date DESC
//         // `);

//         stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
//     SELECT request_id, hospital_id, admission_number, blood_group, units_required, request_date, request_status, notes
//     FROM blood_request
//     WHERE hospital_id = ${hospitalId} AND is_deleted = 0
//     ORDER BY request_date DESC
// `);


//         BloodRequest[] requests = [];
//         check resultStream.forEach(function(BloodRequest row) {
//         requests.push(row);
// });


//         return requests;
//     }



// resource function put bloodrequests/[int requestId](http:Request req, @http:Payload BloodRequestUpdate updateData) returns json|error {
//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//     if hospitalIdStr is () {
//         return error("Missing hospital_id in request");
//     }
//     int hospitalId = check 'int:fromString(hospitalIdStr);

//     sql:ExecutionResult result = check database:dbClient->execute(`
//         UPDATE blood_request
//         SET admission_number = ${updateData.admission_number},
//             blood_group = ${updateData.blood_group},
//             units_required = ${updateData.units_required},
//             notes = ${updateData.notes},
//             request_status = ${updateData.request_status}
//         WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//     `);

//     if result.affectedRowCount == 0 {
//         return { message: "Update failed. Request not found or access denied." };
//     }

//     return { message: "Request updated successfully." };
// }

// resource function post bloodrequests/add(http:Request req, @http:Payload NewBloodRequest requestData) returns json|error {
//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//     if hospitalIdStr is () {
//         return error("Missing hospital_id in request");
//     }
//     int hospitalId = check 'int:fromString(hospitalIdStr);

//     // Use the request_status from the payload instead of hardcoding 'Pending'
//     sql:ExecutionResult result = check database:dbClient->execute(`
//         INSERT INTO blood_request 
//             (hospital_id, blood_group, units_required, request_status, notes, admission_number, is_deleted)
//         VALUES (${hospitalId}, ${requestData.blood_group}, ${requestData.units_required}, ${requestData.request_status}, ${requestData.notes}, ${requestData.admission_number}, 0)
//     `);

//     if result.affectedRowCount == 0 {
//         return { message: "Failed to create blood request." };
//     }

//     return { message: "Blood request submitted successfully." };
// }

// // Soft delete a request
// resource function delete bloodrequests/[int requestId](http:Request req) returns json|error {
//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//     if hospitalIdStr is () {
//         return error("Missing hospital_id in request");
//     }
//     int hospitalId = check 'int:fromString(hospitalIdStr);

//     sql:ExecutionResult result = check database:dbClient->execute(`
//         UPDATE blood_request
//         SET is_deleted = 1
//         WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//     `);

//     if result.affectedRowCount == 0 {
//         return { message: "Delete failed. Request not found or access denied." };
//     }

//     return { message: "Request deleted successfully." };
// }



// // Add or update blood group stock for a hospital
// resource function post bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//     // jwt:Payload payload = check common:getValidatedPayload(req);
//     // int hospitalId = check common:getOrgId(payload);
    
//     // int hospitalId = 2; // Temp hardcoded hospital_id for testing

//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
// if hospitalIdStr is () {
//     return error("Missing hospital_id in request");
// }
// int hospitalId = check 'int:fromString(hospitalIdStr);


//     // Try to update the existing stock
//     sql:ExecutionResult result = check database:dbClient->execute(`
//         INSERT INTO blood_group (hospital_id, blood_name, quantity)
//         VALUES (${hospitalId}, ${stockData.blood_name}, ${stockData.quantity})
//         ON DUPLICATE KEY UPDATE quantity = ${stockData.quantity}
//     `);

//     if result.affectedRowCount > 0 {
//         return { message: "Blood group stock saved successfully." };
//     } else {
//         return { message: "Failed to save blood group stock." };
//     }
// }


// // Get all blood group stocks for the hospital
// resource function get bloodgroups(http:Request req) returns BloodGroupStock[]|error {
//         // jwt:Payload payload = check common:getValidatedPayload(req);
//     // int hospitalId = check common:getOrgId(payload);
    
//     // int hospitalId = 2; // Temp hardcoded hospital_id for testing


//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
// if hospitalIdStr is () {
//     return error("Missing hospital_id in request");
// }
// int hospitalId = check 'int:fromString(hospitalIdStr);


//     stream<BloodGroupStock, sql:Error?> resultStream = database:dbClient->query(`
//         SELECT blood_name, quantity
//         FROM blood_group
//         WHERE hospital_id = ${hospitalId}
//         ORDER BY blood_name
//     `);

//     BloodGroupStock[] stockList = [];
//     check resultStream.forEach(function(BloodGroupStock row) {
//         stockList.push(row);
//     });

//     return stockList;
// }

// //edit blood stock
// resource function put bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//     if hospitalIdStr is () {
//         return error("Missing hospital_id in request");
//     }
//     int hospitalId = check 'int:fromString(hospitalIdStr);

//     sql:ExecutionResult result = check database:dbClient->execute(`
//         UPDATE blood_group
//         SET quantity = ${stockData.quantity}
//         WHERE hospital_id = ${hospitalId} 
//           AND blood_name = ${stockData.blood_name}
//     `);

//     if result.affectedRowCount > 0 {
//         return { message: "Blood group stock updated successfully." };
//     } else {
//         return { message: "Blood group not found or already deleted." };
//     }
// }

//     // Update donation status and set donate_date to current time when completed
//     resource function post updateStatus(http:Request req, @http:Payload DonationStatusUpdate statusUpdate) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check 'int:fromString(hospitalIdStr);

//         sql:ExecutionResult result;
        
//         if statusUpdate.new_status == "Complete" {
//             // Update status to Complete and set donate_date to current time
//             string currentDateTime = time:utcToString(time:utcNow());
//             // Format to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
//             string datePart = currentDateTime.substring(0, 10);
//             string timePart = currentDateTime.substring(11, 19);
//             string formattedDateTime = datePart + " " + timePart;
            
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status},
//                     donate_date = ${formattedDateTime}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         } else {
//             // Update status only (for Reject or other statuses)
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         }

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Donation not found or access denied." };
//         }

//         return { message: "Donation status updated successfully." };
//     }


//     // Get donations with donor details
//     resource function get donationsWithDonors(http:Request req) returns DonationDonor[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check 'int:fromString(hospitalIdStr);

//         stream<DonationDonor, sql:Error?> resultStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.hospital_id = ${hospitalId}
//              ORDER BY d.donate_date DESC`
//         );

//         DonationDonor[] donations = [];
//         check resultStream.forEach(function(DonationDonor row) {
//             donations.push(row);
//         });

//         return donations;
//     }

// }


// public function startHospitalService() returns error? {
//     log:printInfo("Hospital service started on port 9090");
// }










// import ballerina/http;
// import ballerina/sql;
// import ballerina/log;
// import ballerina/time;
// import ballerina/email;
// import ballerina/mime;
// import backend.database;

// // Email configuration
// email:SmtpConfiguration smtpConfig = {
//     port: 587,
//     security: email:START_TLS_AUTO
// };

// email:SmtpClient smtpClient = check new (
//     "sandbox.smtp.mailtrap.io",
//     "bf439a5221113d",  // Replace with your Mailtrap username
//     "1a402fe31c7448",  // Replace with your Mailtrap password
//     smtpConfig
// );

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }
// service /hospital on database:hospitalListener {

//     // Get all blood requests for a hospital
//     resource function get bloodrequests(http:Request req) returns BloodRequest[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
//             SELECT request_id, hospital_id, admission_number, blood_group, units_required, request_date, request_status, notes
//             FROM blood_request
//             WHERE hospital_id = ${hospitalId} AND is_deleted = 0
//             ORDER BY request_date DESC
//         `);

//         BloodRequest[] requests = [];
//         check resultStream.forEach(function(BloodRequest row) {
//             requests.push(row);
//         });

//         return requests;
//     }

//     resource function put bloodrequests/[int requestId](http:Request req, @http:Payload BloodRequestUpdate updateData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_request
//             SET admission_number = ${updateData.admission_number},
//                 blood_group = ${updateData.blood_group},
//                 units_required = ${updateData.units_required},
//                 notes = ${updateData.notes},
//                 request_status = ${updateData.request_status}
//             WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Request not found or access denied." };
//         }

//         return { message: "Request updated successfully." };
//     }

//     resource function post bloodrequests/add(http:Request req, @http:Payload NewBloodRequest requestData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             INSERT INTO blood_request 
//                 (hospital_id, blood_group, units_required, request_status, notes, admission_number, is_deleted)
//             VALUES (${hospitalId}, ${requestData.blood_group}, ${requestData.units_required}, ${requestData.request_status}, ${requestData.notes}, ${requestData.admission_number}, 0)
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Failed to create blood request." };
//         }

//         return { message: "Blood request submitted successfully." };
//     }

//     // Soft delete a request
//     resource function delete bloodrequests/[int requestId](http:Request req) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_request
//             SET is_deleted = 1
//             WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Delete failed. Request not found or access denied." };
//         }

//         return { message: "Request deleted successfully." };
//     }

//     // Add or update blood group stock for a hospital
//     resource function post bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             INSERT INTO blood_group (hospital_id, blood_name, quantity)
//             VALUES (${hospitalId}, ${stockData.blood_name}, ${stockData.quantity})
//             ON DUPLICATE KEY UPDATE quantity = ${stockData.quantity}
//         `);

//         if result.affectedRowCount > 0 {
//             return { message: "Blood group stock saved successfully." };
//         } else {
//             return { message: "Failed to save blood group stock." };
//         }
//     }

//     // Get all blood group stocks for the hospital
//     resource function get bloodgroups(http:Request req) returns BloodGroupStock[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<BloodGroupStock, sql:Error?> resultStream = database:dbClient->query(`
//             SELECT blood_name, quantity
//             FROM blood_group
//             WHERE hospital_id = ${hospitalId}
//             ORDER BY blood_name
//         `);

//         BloodGroupStock[] stockList = [];
//         check resultStream.forEach(function(BloodGroupStock row) {
//             stockList.push(row);
//         });

//         return stockList;
//     }

//     //edit blood stock
//     resource function put bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_group
//             SET quantity = ${stockData.quantity}
//             WHERE hospital_id = ${hospitalId} 
//               AND blood_name = ${stockData.blood_name}
//         `);

//         if result.affectedRowCount > 0 {
//             return { message: "Blood group stock updated successfully." };
//         } else {
//             return { message: "Blood group not found or already deleted." };
//         }
//     }

//     // Update donation status and set donate_date to current time when completed
//     resource function post updateStatus(http:Request req, @http:Payload DonationStatusUpdate statusUpdate) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result;
        
//         if statusUpdate.new_status == "Complete" {
//             // Update status to Complete and set donate_date to current time
//             string currentDateTime = time:utcToString(time:utcNow());
//             string datePart = currentDateTime.substring(0, 10);
//             string timePart = currentDateTime.substring(11, 19);
//             string formattedDateTime = datePart + " " + timePart;
            
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status},
//                     donate_date = ${formattedDateTime}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         } else {
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         }

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Donation not found or access denied." };
//         }

//         return { message: "Donation status updated successfully." };
//     }

//     // Get donations with donor details
//     resource function get donationsWithDonors(http:Request req) returns DonationDonor[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<DonationDonor, sql:Error?> resultStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.hospital_id = ${hospitalId}
//              ORDER BY d.donate_date DESC`
//         );

//         DonationDonor[] donations = [];
//         check resultStream.forEach(function(DonationDonor row) {
//             donations.push(row);
//         });

//         return donations;
//     }

//     // Generate and send donation certificate
//     resource function post sendCertificate(http:Request req, @http:Payload CertificateRequest certificateRequest) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         // Get donation details
//         stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.donation_id = ${certificateRequest.donation_id} 
//              AND d.hospital_id = ${hospitalId}
//              AND d.donate_status = 'Complete'`
//         );

//         DonationDonor[] donationDetails = [];
//         check donationStream.forEach(function(DonationDonor row) {
//             donationDetails.push(row);
//         });

//         if donationDetails.length() == 0 {
//             return error("Donation not found or not completed");
//         }

//         DonationDonor donation = donationDetails[0];

//         // Generate certificate HTML
//         string certificateHtml = generateCertificateHtml(donation, certificateRequest.hospital_name ?: "City General Hospital");

//         // Send email with certificate
//         check smtpClient->send(
//             donation.email,
//             "Blood Donation Certificate - Thank You for Your Contribution",
//             "noreply@hospital.com",
//             certificateHtml,
//             contentType = mime:TEXT_HTML
//         );
        
//         // Update donation record to mark certificate as sent
//         sql:ExecutionResult _ = check database:dbClient->execute(`
//             UPDATE donation 
//             SET certificate_sent = 1,
//                 certificate_sent_date = ${time:utcToString(time:utcNow())}
//             WHERE donation_id = ${certificateRequest.donation_id} 
//             AND hospital_id = ${hospitalId}
//         `);

//         return { 
//             message: "Certificate sent successfully to " + donation.email,
//             success: true,
//             donor_name: donation.donor_name
//         };
//     }

//     // Get certificate preview (for frontend display)
//     resource function get certificatePreview/[int donationId](http:Request req) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         string? hospitalNameParam = req.getQueryParamValue("hospital_name");
//         string hospitalName = hospitalNameParam ?: "City General Hospital";

//         // Get donation details
//         stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.donation_id = ${donationId} 
//              AND d.hospital_id = ${hospitalId}
//              AND d.donate_status = 'Complete'`
//         );

//         DonationDonor[] donationDetails = [];
//         check donationStream.forEach(function(DonationDonor row) {
//             donationDetails.push(row);
//         });

//         if donationDetails.length() == 0 {
//             return error("Donation not found or not completed");
//         }

//         DonationDonor donation = donationDetails[0];
//         string certificateHtml = generateCertificateHtml(donation, hospitalName);

//         return {
//             success: true,
//             html: certificateHtml,
//             donor_name: donation.donor_name,
//             blood_group: donation.blood_group,
//             donation_date: donation.donate_date
//         };
//     }
// }

// // Function to generate certificate HTML
// function generateCertificateHtml(DonationDonor donation, string hospitalName) returns string {
// string donationDate = donation.donate_date;
// if donationDate.length() > 0 {
//     int? spaceIndex = donationDate.indexOf(" ");
//     string isoDate;
//     if spaceIndex != -1 {
//         // Construct ISO string by slicing before and after the first space
//         isoDate = donationDate.substring(0, spaceIndex ?: 0) + "T" + donationDate.substring(spaceIndex + 1 ?: 0) + "Z";
//     } else {
//         isoDate = donationDate + "Z";
//     }
//     time:Utc|error utcTime = time:utcFromString(isoDate);
//     if utcTime is time:Utc {
//         time:Civil civilTime = time:utcToCivil(utcTime);
//         donationDate = string `${civilTime.month}/${civilTime.day}/${civilTime.year}`;
//     }
// } else {
//     donationDate = "N/A";
// }


//     string certificateId = string `CERT-${donation.donation_id}-${time:utcNow()[0]}`;

//     return string `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <style>
//             body {
//                 font-family: 'Times New Roman', serif;
//                 margin: 0;
//                 padding: 40px;
//                 background-color: #f5f5f5;
//             }
//             .certificate {
//                 max-width: 800px;
//                 margin: 0 auto;
//                 background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
//                 border: 8px solid #dc3545;
//                 border-radius: 15px;
//                 padding: 60px;
//                 text-align: center;
//                 box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//                 position: relative;
//             }
//             .certificate::before {
//                 content: '';
//                 position: absolute;
//                 top: 20px;
//                 left: 20px;
//                 right: 20px;
//                 bottom: 20px;
//                 border: 2px solid #dc3545;
//                 border-radius: 8px;
//                 opacity: 0.3;
//             }
//             .header {
//                 margin-bottom: 40px;
//             }
//             .logo {
//                 font-size: 48px;
//                 color: #dc3545;
//                 margin-bottom: 10px;
//             }
//             .hospital-name {
//                 font-size: 28px;
//                 font-weight: bold;
//                 color: #333;
//                 margin-bottom: 10px;
//                 text-transform: uppercase;
//                 letter-spacing: 2px;
//             }
//             .title {
//                 font-size: 36px;
//                 font-weight: bold;
//                 color: #dc3545;
//                 margin: 30px 0;
//                 text-transform: uppercase;
//                 letter-spacing: 3px;
//                 text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
//             }
//             .subtitle {
//                 font-size: 20px;
//                 color: #666;
//                 margin-bottom: 40px;
//                 font-style: italic;
//             }
//             .recipient {
//                 font-size: 32px;
//                 font-weight: bold;
//                 color: #333;
//                 margin: 30px 0;
//                 text-decoration: underline;
//                 text-underline-offset: 8px;
//                 text-decoration-color: #dc3545;
//             }
//             .content {
//                 font-size: 18px;
//                 line-height: 1.8;
//                 color: #444;
//                 margin: 30px 0;
//                 max-width: 600px;
//                 margin-left: auto;
//                 margin-right: auto;
//             }
//             .details {
//                 display: flex;
//                 justify-content: space-around;
//                 margin: 40px 0;
//                 flex-wrap: wrap;
//             }
//             .detail-item {
//                 text-align: center;
//                 margin: 10px;
//             }
//             .detail-label {
//                 font-size: 14px;
//                 color: #666;
//                 text-transform: uppercase;
//                 letter-spacing: 1px;
//                 margin-bottom: 5px;
//             }
//             .detail-value {
//                 font-size: 18px;
//                 font-weight: bold;
//                 color: #dc3545;
//                 border-bottom: 2px solid #dc3545;
//                 padding-bottom: 5px;
//                 display: inline-block;
//                 min-width: 120px;
//             }
//             .signature-section {
//                 margin-top: 50px;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: end;
//             }
//             .signature {
//                 text-align: center;
//                 width: 200px;
//             }
//             .signature-line {
//                 border-top: 2px solid #333;
//                 margin-bottom: 10px;
//                 height: 1px;
//             }
//             .signature-title {
//                 font-size: 14px;
//                 color: #666;
//                 font-weight: bold;
//             }
//             .certificate-id {
//                 position: absolute;
//                 top: 30px;
//                 right: 30px;
//                 font-size: 12px;
//                 color: #999;
//                 font-family: 'Courier New', monospace;
//             }
//             .heart {
//                 color: #dc3545;
//                 font-size: 24px;
//                 margin: 0 10px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="certificate">
//             <div class="certificate-id">Certificate ID: ${certificateId}</div>
            
//             <div class="header">
//                 <div class="logo">🏥</div>
//                 <div class="hospital-name">${hospitalName}</div>
//             </div>
            
//             <div class="title">Certificate of Appreciation</div>
//             <div class="subtitle">Blood Donation Recognition</div>
            
//             <div class="content">
//                 This is to certify that
//             </div>
            
//             <div class="recipient">${donation.donor_name}</div>
            
//             <div class="content">
//                 has generously donated blood and made a significant contribution to saving lives in our community. 
//                 Your selfless act of kindness demonstrates the highest form of humanity and compassion.
//                 <span class="heart">❤️</span>
//                 <br><br>
//                 <em>"The gift of blood is the gift of life. Thank you for being a hero."</em>
//             </div>
            
//             <div class="details">
//                 <div class="detail-item">
//                     <div class="detail-label">Blood Group</div>
//                     <div class="detail-value">${donation.blood_group}</div>
//                 </div>
//                 <div class="detail-item">
//                     <div class="detail-label">Donation Date</div>
//                     <div class="detail-value">${donationDate}</div>
//                 </div>
//                 <div class="detail-item">
//                     <div class="detail-label">Donor ID</div>
//                     <div class="detail-value">#${donation.donor_id}</div>
//                 </div>
//             </div>
            
//             <div class="signature-section">
//                 <div class="signature">
//                     <div class="signature-line"></div>
//                     <div class="signature-title">Medical Director</div>
//                 </div>
//                 <div style="text-align: center; margin-top: 20px;">
//                     <div style="font-size: 16px; color: #666;">
//                         Issued on ${time:utcToString(time:utcNow()).substring(0, 10)}
//                     </div>
//                 </div>
//                 <div class="signature">
//                     <div class="signature-line"></div>
//                     <div class="signature-title">Blood Bank Manager</div>
//                 </div>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
// }

// public function startHospitalService() returns error? {
//     log:printInfo("Hospital service started on port 9090");
// }



// import ballerina/http;
// import ballerina/sql;
// import ballerina/log;
// import ballerina/time;
// import ballerina/email;
// import ballerina/mime;
// import backend.database;

// // Gmail SMTP configuration
// email:SmtpConfiguration smtpConfig = {
//     port: 587,
//     security: email:START_TLS_AUTO
// };

// email:SmtpClient smtpClient = check new (
//     "smtp.gmail.com",
//     "anjana.n.sathsara123@gmail.com",  // Your Gmail address
//     "kfmrr fmekmfr fekmf",  // Replace with your Gmail App Password
//     smtpConfig
// );

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }
// service /hospital on database:hospitalListener {

//     // Get all blood requests for a hospital
//     resource function get bloodrequests(http:Request req) returns BloodRequest[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
//             SELECT request_id, hospital_id, admission_number, blood_group, units_required, request_date, request_status, notes
//             FROM blood_request
//             WHERE hospital_id = ${hospitalId} AND is_deleted = 0
//             ORDER BY request_date DESC
//         `);

//         BloodRequest[] requests = [];
//         check resultStream.forEach(function(BloodRequest row) {
//             requests.push(row);
//         });

//         return requests;
//     }

//     resource function put bloodrequests/[int requestId](http:Request req, @http:Payload BloodRequestUpdate updateData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_request
//             SET admission_number = ${updateData.admission_number},
//                 blood_group = ${updateData.blood_group},
//                 units_required = ${updateData.units_required},
//                 notes = ${updateData.notes},
//                 request_status = ${updateData.request_status}
//             WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Request not found or access denied." };
//         }

//         return { message: "Request updated successfully." };
//     }

//     resource function post bloodrequests/add(http:Request req, @http:Payload NewBloodRequest requestData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             INSERT INTO blood_request 
//                 (hospital_id, blood_group, units_required, request_status, notes, admission_number, is_deleted)
//             VALUES (${hospitalId}, ${requestData.blood_group}, ${requestData.units_required}, ${requestData.request_status}, ${requestData.notes}, ${requestData.admission_number}, 0)
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Failed to create blood request." };
//         }

//         return { message: "Blood request submitted successfully." };
//     }

//     // Soft delete a request
//     resource function delete bloodrequests/[int requestId](http:Request req) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_request
//             SET is_deleted = 1
//             WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Delete failed. Request not found or access denied." };
//         }

//         return { message: "Request deleted successfully." };
//     }

//     // Add or update blood group stock for a hospital
//     resource function post bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             INSERT INTO blood_group (hospital_id, blood_name, quantity)
//             VALUES (${hospitalId}, ${stockData.blood_name}, ${stockData.quantity})
//             ON DUPLICATE KEY UPDATE quantity = ${stockData.quantity}
//         `);

//         if result.affectedRowCount > 0 {
//             return { message: "Blood group stock saved successfully." };
//         } else {
//             return { message: "Failed to save blood group stock." };
//         }
//     }

//     // Get all blood group stocks for the hospital
//     resource function get bloodgroups(http:Request req) returns BloodGroupStock[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<BloodGroupStock, sql:Error?> resultStream = database:dbClient->query(`
//             SELECT blood_name, quantity
//             FROM blood_group
//             WHERE hospital_id = ${hospitalId}
//             ORDER BY blood_name
//         `);

//         BloodGroupStock[] stockList = [];
//         check resultStream.forEach(function(BloodGroupStock row) {
//             stockList.push(row);
//         });

//         return stockList;
//     }

//     //edit blood stock
//     resource function put bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_group
//             SET quantity = ${stockData.quantity}
//             WHERE hospital_id = ${hospitalId} 
//               AND blood_name = ${stockData.blood_name}
//         `);

//         if result.affectedRowCount > 0 {
//             return { message: "Blood group stock updated successfully." };
//         } else {
//             return { message: "Blood group not found or already deleted." };
//         }
//     }

//     // Update donation status and set donate_date to current time when completed
//     resource function post updateStatus(http:Request req, @http:Payload DonationStatusUpdate statusUpdate) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result;
        
//         if statusUpdate.new_status == "Complete" {
//             // Update status to Complete and set donate_date to current time
//             string currentDateTime = time:utcToString(time:utcNow());
//             string datePart = currentDateTime.substring(0, 10);
//             string timePart = currentDateTime.substring(11, 19);
//             string formattedDateTime = datePart + " " + timePart;
            
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status},
//                     donate_date = ${formattedDateTime}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         } else {
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         }

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Donation not found or access denied." };
//         }

//         return { message: "Donation status updated successfully." };
//     }

//     // Get donations with donor details
//     resource function get donationsWithDonors(http:Request req) returns DonationDonor[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<DonationDonor, sql:Error?> resultStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.hospital_id = ${hospitalId}
//              ORDER BY d.donate_date DESC`
//         );

//         DonationDonor[] donations = [];
//         check resultStream.forEach(function(DonationDonor row) {
//             donations.push(row);
//         });

//         return donations;
//     }

//     // Generate and send donation certificate via Gmail
//     resource function post sendCertificate(http:Request req, @http:Payload CertificateRequest certificateRequest) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         // Get donation details
//         stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.donation_id = ${certificateRequest.donation_id} 
//              AND d.hospital_id = ${hospitalId}
//              AND d.donate_status = 'Complete'`
//         );

//         DonationDonor[] donationDetails = [];
//         check donationStream.forEach(function(DonationDonor row) {
//             donationDetails.push(row);
//         });

//         if donationDetails.length() == 0 {
//             return error("Donation not found or not completed");
//         }

//         DonationDonor donation = donationDetails[0];

//         // Generate certificate HTML
//         string certificateHtml = generateCertificateHtml(donation, certificateRequest.hospital_name ?: "City General Hospital");

//         // Send email with certificate using Gmail SMTP
//         error? emailResult = smtpClient->sendMessage({
//             to: ["anjana.n.sathsara.j.k.d@gmail.com"],
//             subject: "Blood Donation Certificate - Thank You for Your Contribution",
//             body: certificateHtml,
//             'from: "anjana.n.sathsara123@gmail.com",
//             contentType: mime:TEXT_HTML
//         });

//         if emailResult is error {
//             log:printError("Failed to send certificate email: " + emailResult.message());
//             return { 
//                 message: "Failed to send certificate: " + emailResult.message(),
//                 success: false 
//             };
//         }
        
//         // Update donation record to mark certificate as sent
//         sql:ExecutionResult _ = check database:dbClient->execute(`
//             UPDATE donation 
//             SET certificate_sent = 1,
//                 certificate_sent_date = ${time:utcToString(time:utcNow())}
//             WHERE donation_id = ${certificateRequest.donation_id} 
//             AND hospital_id = ${hospitalId}
//         `);

//         log:printInfo("Certificate sent successfully to: " + donation.email);
        
//         return { 
//             message: "Certificate sent successfully to " + donation.email,
//             success: true,
//             donor_name: donation.donor_name
//         };
//     }

//     // Get certificate preview (for frontend display)
//     resource function get certificatePreview/[int donationId](http:Request req) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         string? hospitalNameParam = req.getQueryParamValue("hospital_name");
//         string hospitalName = hospitalNameParam ?: "City General Hospital";

//         // Get donation details
//         stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.donation_id = ${donationId} 
//              AND d.hospital_id = ${hospitalId}
//              AND d.donate_status = 'Complete'`
//         );

//         DonationDonor[] donationDetails = [];
//         check donationStream.forEach(function(DonationDonor row) {
//             donationDetails.push(row);
//         });

//         if donationDetails.length() == 0 {
//             return error("Donation not found or not completed");
//         }

//         DonationDonor donation = donationDetails[0];
//         string certificateHtml = generateCertificateHtml(donation, hospitalName);

//         return {
//             success: true,
//             html: certificateHtml,
//             donor_name: donation.donor_name,
//             blood_group: donation.blood_group,
//             donation_date: donation.donate_date
//         };
//     }
// }

// // Function to generate certificate HTML
// function generateCertificateHtml(DonationDonor donation, string hospitalName) returns string {
// string donationDate = donation.donate_date;
// if donationDate.length() > 0 {
//     int? spaceIndex = donationDate.indexOf(" ");
//     string isoDate;
//     if spaceIndex != -1 {
//         // Construct ISO string by slicing before and after the first space
//         isoDate = donationDate.substring(0, spaceIndex ?: 0) + "T" + donationDate.substring(spaceIndex + 1 ?: 0) + "Z";
//     } else {
//         isoDate = donationDate + "Z";
//     }
//     time:Utc|error utcTime = time:utcFromString(isoDate);
//     if utcTime is time:Utc {
//         time:Civil civilTime = time:utcToCivil(utcTime);
//         donationDate = string `${civilTime.month}/${civilTime.day}/${civilTime.year}`;
//     }
// } else {
//     donationDate = "N/A";
// }


//     string certificateId = string `CERT-${donation.donation_id}-${time:utcNow()[0]}`;

//     return string `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <style>
//             body {
//                 font-family: 'Times New Roman', serif;
//                 margin: 0;
//                 padding: 40px;
//                 background-color: #f5f5f5;
//             }
//             .certificate {
//                 max-width: 800px;
//                 margin: 0 auto;
//                 background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
//                 border: 8px solid #dc3545;
//                 border-radius: 15px;
//                 padding: 60px;
//                 text-align: center;
//                 box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//                 position: relative;
//             }
//             .certificate::before {
//                 content: '';
//                 position: absolute;
//                 top: 20px;
//                 left: 20px;
//                 right: 20px;
//                 bottom: 20px;
//                 border: 2px solid #dc3545;
//                 border-radius: 8px;
//                 opacity: 0.3;
//             }
//             .header {
//                 margin-bottom: 40px;
//             }
//             .logo {
//                 font-size: 48px;
//                 color: #dc3545;
//                 margin-bottom: 10px;
//             }
//             .hospital-name {
//                 font-size: 28px;
//                 font-weight: bold;
//                 color: #333;
//                 margin-bottom: 10px;
//                 text-transform: uppercase;
//                 letter-spacing: 2px;
//             }
//             .title {
//                 font-size: 36px;
//                 font-weight: bold;
//                 color: #dc3545;
//                 margin: 30px 0;
//                 text-transform: uppercase;
//                 letter-spacing: 3px;
//                 text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
//             }
//             .subtitle {
//                 font-size: 20px;
//                 color: #666;
//                 margin-bottom: 40px;
//                 font-style: italic;
//             }
//             .recipient {
//                 font-size: 32px;
//                 font-weight: bold;
//                 color: #333;
//                 margin: 30px 0;
//                 text-decoration: underline;
//                 text-underline-offset: 8px;
//                 text-decoration-color: #dc3545;
//             }
//             .content {
//                 font-size: 18px;
//                 line-height: 1.8;
//                 color: #444;
//                 margin: 30px 0;
//                 max-width: 600px;
//                 margin-left: auto;
//                 margin-right: auto;
//             }
//             .details {
//                 display: flex;
//                 justify-content: space-around;
//                 margin: 40px 0;
//                 flex-wrap: wrap;
//             }
//             .detail-item {
//                 text-align: center;
//                 margin: 10px;
//             }
//             .detail-label {
//                 font-size: 14px;
//                 color: #666;
//                 text-transform: uppercase;
//                 letter-spacing: 1px;
//                 margin-bottom: 5px;
//             }
//             .detail-value {
//                 font-size: 18px;
//                 font-weight: bold;
//                 color: #dc3545;
//                 border-bottom: 2px solid #dc3545;
//                 padding-bottom: 5px;
//                 display: inline-block;
//                 min-width: 120px;
//             }
//             .signature-section {
//                 margin-top: 50px;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: end;
//             }
//             .signature {
//                 text-align: center;
//                 width: 200px;
//             }
//             .signature-line {
//                 border-top: 2px solid #333;
//                 margin-bottom: 10px;
//                 height: 1px;
//             }
//             .signature-title {
//                 font-size: 14px;
//                 color: #666;
//                 font-weight: bold;
//             }
//             .certificate-id {
//                 position: absolute;
//                 top: 30px;
//                 right: 30px;
//                 font-size: 12px;
//                 color: #999;
//                 font-family: 'Courier New', monospace;
//             }
//             .heart {
//                 color: #dc3545;
//                 font-size: 24px;
//                 margin: 0 10px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="certificate">
//             <div class="certificate-id">Certificate ID: ${certificateId}</div>
            
//             <div class="header">
//                 <div class="logo">🏥</div>
//                 <div class="hospital-name">${hospitalName}</div>
//             </div>
            
//             <div class="title">Certificate of Appreciation</div>
//             <div class="subtitle">Blood Donation Recognition</div>
            
//             <div class="content">
//                 This is to certify that
//             </div>
            
//             <div class="recipient">${donation.donor_name}</div>
            
//             <div class="content">
//                 has generously donated blood and made a significant contribution to saving lives in our community. 
//                 Your selfless act of kindness demonstrates the highest form of humanity and compassion.
//                 <span class="heart">❤️</span>
//                 <br><br>
//                 <em>"The gift of blood is the gift of life. Thank you for being a hero."</em>
//             </div>
            
//             <div class="details">
//                 <div class="detail-item">
//                     <div class="detail-label">Blood Group</div>
//                     <div class="detail-value">${donation.blood_group}</div>
//                 </div>
//                 <div class="detail-item">
//                     <div class="detail-label">Donation Date</div>
//                     <div class="detail-value">${donationDate}</div>
//                 </div>
//                 <div class="detail-item">
//                     <div class="detail-label">Donor ID</div>
//                     <div class="detail-value">#${donation.donor_id}</div>
//                 </div>
//             </div>
            
//             <div class="signature-section">
//                 <div class="signature">
//                     <div class="signature-line"></div>
//                     <div class="signature-title">Medical Director</div>
//                 </div>
//                 <div style="text-align: center; margin-top: 20px;">
//                     <div style="font-size: 16px; color: #666;">
//                         Issued on ${time:utcToString(time:utcNow()).substring(0, 10)}
//                     </div>
//                 </div>
//                 <div class="signature">
//                     <div class="signature-line"></div>
//                     <div class="signature-title">Blood Bank Manager</div>
//                 </div>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
// }

// public function startHospitalService() returns error? {
//     log:printInfo("Hospital service started on port 9090");
// }




// import ballerina/http;
// import ballerina/sql;
// import ballerina/log;
// import ballerina/time;
// import ballerina/email;
// import ballerina/mime;
// import backend.database;

// // Gmail SMTP configuration
// email:SmtpConfiguration smtpConfig = {
//     port: 587,
//     security: email:START_TLS_AUTO
// };

// email:SmtpClient smtpClient = check new (
//     "smtp.gmail.com",
//     "anjana.n.sathsara123@gmail.com",  // Your Gmail address
//     "app password",  // Replace with your Gmail App Password
//     smtpConfig
// );

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }
// service /hospital on database:hospitalListener {

//     // Get all blood requests for a hospital
//     resource function get bloodrequests(http:Request req) returns BloodRequest[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
//             SELECT request_id, hospital_id, admission_number, blood_group, units_required, request_date, request_status, notes
//             FROM blood_request
//             WHERE hospital_id = ${hospitalId} AND is_deleted = 0
//             ORDER BY request_date DESC
//         `);

//         BloodRequest[] requests = [];
//         check resultStream.forEach(function(BloodRequest row) {
//             requests.push(row);
//         });

//         return requests;
//     }

//     resource function put bloodrequests/[int requestId](http:Request req, @http:Payload BloodRequestUpdate updateData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_request
//             SET admission_number = ${updateData.admission_number},
//                 blood_group = ${updateData.blood_group},
//                 units_required = ${updateData.units_required},
//                 notes = ${updateData.notes},
//                 request_status = ${updateData.request_status}
//             WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Request not found or access denied." };
//         }

//         return { message: "Request updated successfully." };
//     }

//     resource function post bloodrequests/add(http:Request req, @http:Payload NewBloodRequest requestData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             INSERT INTO blood_request 
//                 (hospital_id, blood_group, units_required, request_status, notes, admission_number, is_deleted)
//             VALUES (${hospitalId}, ${requestData.blood_group}, ${requestData.units_required}, ${requestData.request_status}, ${requestData.notes}, ${requestData.admission_number}, 0)
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Failed to create blood request." };
//         }

//         return { message: "Blood request submitted successfully." };
//     }

//     // Soft delete a request
//     resource function delete bloodrequests/[int requestId](http:Request req) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_request
//             SET is_deleted = 1
//             WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
//         `);

//         if result.affectedRowCount == 0 {
//             return { message: "Delete failed. Request not found or access denied." };
//         }

//         return { message: "Request deleted successfully." };
//     }

//     // Add or update blood group stock for a hospital
//     resource function post bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             INSERT INTO blood_group (hospital_id, blood_name, quantity)
//             VALUES (${hospitalId}, ${stockData.blood_name}, ${stockData.quantity})
//             ON DUPLICATE KEY UPDATE quantity = ${stockData.quantity}
//         `);

//         if result.affectedRowCount > 0 {
//             return { message: "Blood group stock saved successfully." };
//         } else {
//             return { message: "Failed to save blood group stock." };
//         }
//     }

//     // Get all blood group stocks for the hospital
//     resource function get bloodgroups(http:Request req) returns BloodGroupStock[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<BloodGroupStock, sql:Error?> resultStream = database:dbClient->query(`
//             SELECT blood_name, quantity
//             FROM blood_group
//             WHERE hospital_id = ${hospitalId}
//             ORDER BY blood_name
//         `);

//         BloodGroupStock[] stockList = [];
//         check resultStream.forEach(function(BloodGroupStock row) {
//             stockList.push(row);
//         });

//         return stockList;
//     }

//     //edit blood stock
//     resource function put bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result = check database:dbClient->execute(`
//             UPDATE blood_group
//             SET quantity = ${stockData.quantity}
//             WHERE hospital_id = ${hospitalId} 
//               AND blood_name = ${stockData.blood_name}
//         `);

//         if result.affectedRowCount > 0 {
//             return { message: "Blood group stock updated successfully." };
//         } else {
//             return { message: "Blood group not found or already deleted." };
//         }
//     }

//     // Update donation status and set donate_date to current time when completed
//     resource function post updateStatus(http:Request req, @http:Payload DonationStatusUpdate statusUpdate) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         sql:ExecutionResult result;
        
//         if statusUpdate.new_status == "Complete" {
//             // Update status to Complete and set donate_date to current time
//             string currentDateTime = time:utcToString(time:utcNow());
//             string datePart = currentDateTime.substring(0, 10);
//             string timePart = currentDateTime.substring(11, 19);
//             string formattedDateTime = datePart + " " + timePart;
            
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status},
//                     donate_date = ${formattedDateTime}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         } else {
//             result = check database:dbClient->execute(`
//                 UPDATE donation 
//                 SET donate_status = ${statusUpdate.new_status}
//                 WHERE donation_id = ${statusUpdate.donation_id} 
//                 AND hospital_id = ${hospitalId}
//             `);
//         }

//         if result.affectedRowCount == 0 {
//             return { message: "Update failed. Donation not found or access denied." };
//         }

//         return { message: "Donation status updated successfully." };
//     }

//     // Get donations with donor details
//     resource function get donationsWithDonors(http:Request req) returns DonationDonor[]|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         stream<DonationDonor, sql:Error?> resultStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.hospital_id = ${hospitalId}
//              ORDER BY d.donate_date DESC`
//         );

//         DonationDonor[] donations = [];
//         check resultStream.forEach(function(DonationDonor row) {
//             donations.push(row);
//         });

//         return donations;
//     }

//      // Generate and send donation certificate via Gmail
//     resource function post sendCertificate(http:Request req, @http:Payload CertificateRequest certificateRequest) returns json|error {
//     string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//     if hospitalIdStr is () {
//         return { message: "Missing hospital_id in request", success: false };
//     }
//     int hospitalId = check int:fromString(hospitalIdStr);

//     // Get donation details
//     stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
//         `SELECT 
//             d.donation_id,
//             dn.donor_id,
//             dn.donor_name,
//             dn.email,
//             dn.phone_number,
//             dn.blood_group,
//             dn.last_donation_date,
//             d.donate_status,
//             d.donate_date
//          FROM donation d
//          INNER JOIN donor dn ON d.donor_id = dn.donor_id
//          WHERE d.donation_id = ${certificateRequest.donation_id} 
//          AND d.hospital_id = ${hospitalId}
//          AND d.donate_status = 'Complete'`
//     );

//     DonationDonor[] donationDetails = [];
//     error? streamError = donationStream.forEach(function(DonationDonor row) {
//         donationDetails.push(row);
//     });

//     if streamError is error {
//         log:printError("Failed to fetch donation details: " + streamError.message());
//         return { message: "Failed to fetch donation details: " + streamError.message(), success: false };
//     }

//     if donationDetails.length() == 0 {
//         return { message: "Donation not found or not completed", success: false };
//     }

//     DonationDonor donation = donationDetails[0];

//     // Generate certificate HTML
//     string certificateHtml = generateCertificateHtml(donation, certificateRequest.hospital_name ?: "City General Hospital");

//     // Send email with certificate using Gmail SMTP
//     if donation.email is string && donation.email.trim().length() > 0 {
//         error? emailResult = smtpClient->sendMessage({
//             to: "anjana.n.sathsara.j.k.d@gmail.com",
//             subject: "Blood Donation Certificate - Thank You for Your Contribution",
//             body: certificateHtml,
//             'from: "anjana.n.sathsara123@gmail.com",
//             contentType: mime:TEXT_HTML
//         });

//         if emailResult is error {
//             log:printError("Failed to send certificate email to " + donation.email + ": " + emailResult.message());
//             return { 
//                 message: "Failed to send certificate: " + emailResult.message(),
//                 success: false 
//             };
//         }
//     } else {
//         log:printWarn("No valid email address found for donor: " + donation.donor_name);
//         return { message: "No valid email address available for donor", success: false };
//     }

//     // Format date for MySQL DATETIME (YYYY-MM-DD HH:MM:SS)
//     time:Utc currentTime = time:utcNow();
//     time:Civil civilTime = time:utcToCivil(currentTime);
//     string formattedDateTime = string `${civilTime.year}-${civilTime.month.toString().padStart(2, "0")}-${civilTime.day.toString().padStart(2, "0")} ${civilTime.hour.toString().padStart(2, "0")}:${civilTime.minute.toString().padStart(2, "0")}:${civilTime.second.toString().padStart(2, "0")}`;

//     // Update donation record to mark certificate as sent
//     sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
//         UPDATE donation 
//         SET certificate_sent = 1,
//             certificate_sent_date = ${formattedDateTime}
//         WHERE donation_id = ${certificateRequest.donation_id} 
//         AND hospital_id = ${hospitalId}
//     `);

//     if result is sql:Error {
//         log:printError("Failed to update certificate status: " + result.message());
//         return { 
//             message: "Certificate sent but failed to update database: " + result.message(),
//             success: true // Email was sent, so consider it partially successful
//         };
//     }

//     if result.affectedRowCount == 0 {
//         log:printWarn("No rows updated for donation_id: " + certificateRequest.donation_id.toString());
//     }

//     log:printInfo("Certificate sent successfully to: " + donation.email);
    
//     return { 
//         message: "Certificate sent successfully to " + donation.email,
//         success: true,
//         donor_name: donation.donor_name
//     };
// }

//     // Get certificate preview (for frontend display)
//     resource function get certificatePreview/[int donationId](http:Request req) returns json|error {
//         string? hospitalIdStr = req.getQueryParamValue("hospital_id");
//         if hospitalIdStr is () {
//             return error("Missing hospital_id in request");
//         }
//         int hospitalId = check int:fromString(hospitalIdStr);

//         string? hospitalNameParam = req.getQueryParamValue("hospital_name");
//         string hospitalName = hospitalNameParam ?: "City General Hospital";

//         // Get donation details
//         stream<DonationDonor, sql:Error?> donationStream = database:dbClient->query(
//             `SELECT 
//                 d.donation_id,
//                 dn.donor_id,
//                 dn.donor_name,
//                 dn.email,
//                 dn.phone_number,
//                 dn.blood_group,
//                 dn.last_donation_date,
//                 d.donate_status,
//                 d.donate_date
//              FROM donation d
//              INNER JOIN donor dn ON d.donor_id = dn.donor_id
//              WHERE d.donation_id = ${donationId} 
//              AND d.hospital_id = ${hospitalId}
//              AND d.donate_status = 'Complete'`
//         );

//         DonationDonor[] donationDetails = [];
//         check donationStream.forEach(function(DonationDonor row) {
//             donationDetails.push(row);
//         });

//         if donationDetails.length() == 0 {
//             return error("Donation not found or not completed");
//         }

//         DonationDonor donation = donationDetails[0];
//         string certificateHtml = generateCertificateHtml(donation, hospitalName);

//         return {
//             success: true,
//             html: certificateHtml,
//             donor_name: donation.donor_name,
//             blood_group: donation.blood_group,
//             donation_date: donation.donate_date
//         };
//     }
// }

// // Function to generate certificate HTML
// function generateCertificateHtml(DonationDonor donation, string hospitalName) returns string {
// string donationDate = donation.donate_date;
// if donationDate.length() > 0 {
//     int? spaceIndex = donationDate.indexOf(" ");
//     string isoDate;
//     if spaceIndex != -1 {
//         // Construct ISO string by slicing before and after the first space
//         isoDate = donationDate.substring(0, spaceIndex ?: 0) + "T" + donationDate.substring(spaceIndex + 1 ?: 0) + "Z";
//     } else {
//         isoDate = donationDate + "Z";
//     }
//     time:Utc|error utcTime = time:utcFromString(isoDate);
//     if utcTime is time:Utc {
//         time:Civil civilTime = time:utcToCivil(utcTime);
//         donationDate = string `${civilTime.month}/${civilTime.day}/${civilTime.year}`;
//     }
// } else {
//     donationDate = "N/A";
// }


//     string certificateId = string `CERT-${donation.donation_id}-${time:utcNow()[0]}`;

//     return string `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <style>
//             body {
//                 font-family: 'Times New Roman', serif;
//                 margin: 0;
//                 padding: 40px;
//                 background-color: #f5f5f5;
//             }
//             .certificate {
//                 max-width: 800px;
//                 margin: 0 auto;
//                 background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
//                 border: 8px solid #dc3545;
//                 border-radius: 15px;
//                 padding: 60px;
//                 text-align: center;
//                 box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//                 position: relative;
//             }
//             .certificate::before {
//                 content: '';
//                 position: absolute;
//                 top: 20px;
//                 left: 20px;
//                 right: 20px;
//                 bottom: 20px;
//                 border: 2px solid #dc3545;
//                 border-radius: 8px;
//                 opacity: 0.3;
//             }
//             .header {
//                 margin-bottom: 40px;
//             }
//             .logo {
//                 font-size: 48px;
//                 color: #dc3545;
//                 margin-bottom: 10px;
//             }
//             .hospital-name {
//                 font-size: 28px;
//                 font-weight: bold;
//                 color: #333;
//                 margin-bottom: 10px;
//                 text-transform: uppercase;
//                 letter-spacing: 2px;
//             }
//             .title {
//                 font-size: 36px;
//                 font-weight: bold;
//                 color: #dc3545;
//                 margin: 30px 0;
//                 text-transform: uppercase;
//                 letter-spacing: 3px;
//                 text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
//             }
//             .subtitle {
//                 font-size: 20px;
//                 color: #666;
//                 margin-bottom: 40px;
//                 font-style: italic;
//             }
//             .recipient {
//                 font-size: 32px;
//                 font-weight: bold;
//                 color: #333;
//                 margin: 30px 0;
//                 text-decoration: underline;
//                 text-underline-offset: 8px;
//                 text-decoration-color: #dc3545;
//             }
//             .content {
//                 font-size: 18px;
//                 line-height: 1.8;
//                 color: #444;
//                 margin: 30px 0;
//                 max-width: 600px;
//                 margin-left: auto;
//                 margin-right: auto;
//             }
//             .details {
//                 display: flex;
//                 justify-content: space-around;
//                 margin: 40px 0;
//                 flex-wrap: wrap;
//             }
//             .detail-item {
//                 text-align: center;
//                 margin: 10px;
//             }
//             .detail-label {
//                 font-size: 14px;
//                 color: #666;
//                 text-transform: uppercase;
//                 letter-spacing: 1px;
//                 margin-bottom: 5px;
//             }
//             .detail-value {
//                 font-size: 18px;
//                 font-weight: bold;
//                 color: #dc3545;
//                 border-bottom: 2px solid #dc3545;
//                 padding-bottom: 5px;
//                 display: inline-block;
//                 min-width: 120px;
//             }
//             .signature-section {
//                 margin-top: 50px;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: end;
//             }
//             .signature {
//                 text-align: center;
//                 width: 200px;
//             }
//             .signature-line {
//                 border-top: 2px solid #333;
//                 margin-bottom: 10px;
//                 height: 1px;
//             }
//             .signature-title {
//                 font-size: 14px;
//                 color: #666;
//                 font-weight: bold;
//             }
//             .certificate-id {
//                 position: absolute;
//                 top: 30px;
//                 right: 30px;
//                 font-size: 12px;
//                 color: #999;
//                 font-family: 'Courier New', monospace;
//             }
//             .heart {
//                 color: #dc3545;
//                 font-size: 24px;
//                 margin: 0 10px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="certificate">
//             <div class="certificate-id">Certificate ID: ${certificateId}</div>
            
//             <div class="header">
//                 <div class="logo">🏥</div>
//                 <div class="hospital-name">${hospitalName}</div>
//             </div>
            
//             <div class="title">Certificate of Appreciation</div>
//             <div class="subtitle">Blood Donation Recognition</div>
            
//             <div class="content">
//                 This is to certify that
//             </div>
            
//             <div class="recipient">${donation.donor_name}</div>
            
//             <div class="content">
//                 has generously donated blood and made a significant contribution to saving lives in our community. 
//                 Your selfless act of kindness demonstrates the highest form of humanity and compassion.
//                 <span class="heart">❤️</span>
//                 <br><br>
//                 <em>"The gift of blood is the gift of life. Thank you for being a hero."</em>
//             </div>
            
//             <div class="details">
//                 <div class="detail-item">
//                     <div class="detail-label">Blood Group</div>
//                     <div class="detail-value">${donation.blood_group}</div>
//                 </div>
//                 <div class="detail-item">
//                     <div class="detail-label">Donation Date</div>
//                     <div class="detail-value">${donationDate}</div>
//                 </div>
//                 <div class="detail-item">
//                     <div class="detail-label">Donor ID</div>
//                     <div class="detail-value">#${donation.donor_id}</div>
//                 </div>
//             </div>
            
//             <div class="signature-section">
//                 <div class="signature">
//                     <div class="signature-line"></div>
//                     <div class="signature-title">Medical Director</div>
//                 </div>
//                 <div style="text-align: center; margin-top: 20px;">
//                     <div style="font-size: 16px; color: #666;">
//                         Issued on ${time:utcToString(time:utcNow()).substring(0, 10)}
//                     </div>
//                 </div>
//                 <div class="signature">
//                     <div class="signature-line"></div>
//                     <div class="signature-title">Blood Bank Manager</div>
//                 </div>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
// }

// public function startHospitalService() returns error? {
//     log:printInfo("Hospital service started on port 9090");
// }













import ballerina/http;
import ballerina/sql;
import ballerina/log;
import ballerina/time;
import ballerina/email;
import ballerina/mime;
import backend.database;

// Gmail SMTP configuration
email:SmtpConfiguration smtpConfig = {
    port: 587,
    security: email:START_TLS_AUTO
};

email:SmtpClient smtpClient = check new (
    "smtp.gmail.com",
    "anjana.n.sathsara123@gmail.com",  // Your Gmail address
    "app password",  // Replace with your Gmail App Password
    smtpConfig
);

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173", "*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    }
}
service /hospital on database:hospitalListener {

    // Get all blood requests for a hospital
    resource function get bloodrequests(http:Request req) returns BloodRequest[]|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(`
            SELECT request_id, hospital_id, admission_number, blood_group, units_required, request_date, request_status, notes
            FROM blood_request
            WHERE hospital_id = ${hospitalId} AND is_deleted = 0
            ORDER BY request_date DESC
        `);

        BloodRequest[] requests = [];
        check resultStream.forEach(function(BloodRequest row) {
            requests.push(row);
        });

        return requests;
    }

    resource function put bloodrequests/[int requestId](http:Request req, @http:Payload BloodRequestUpdate updateData) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_request
            SET admission_number = ${updateData.admission_number},
                blood_group = ${updateData.blood_group},
                units_required = ${updateData.units_required},
                notes = ${updateData.notes},
                request_status = ${updateData.request_status}
            WHERE request_id = ${requestId} AND hospital_id = ${hospitalId}
        `);

        if result.affectedRowCount == 0 {
            return { message: "Update failed. Request not found or access denied." };
        }

        return { message: "Request updated successfully." };
    }

    resource function post bloodrequests/add(http:Request req, @http:Payload NewBloodRequest requestData) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_request 
                (hospital_id, blood_group, units_required, request_status, notes, admission_number, is_deleted)
            VALUES (${hospitalId}, ${requestData.blood_group}, ${requestData.units_required}, ${requestData.request_status}, ${requestData.notes}, ${requestData.admission_number}, 0)
        `);

        if result.affectedRowCount == 0 {
            return { message: "Failed to create blood request." };
        }

        return { message: "Blood request submitted successfully." };
    }



    // Add or update blood group stock for a hospital
    resource function post bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_group (hospital_id, blood_name, quantity)
            VALUES (${hospitalId}, ${stockData.blood_name}, ${stockData.quantity})
            ON DUPLICATE KEY UPDATE quantity = ${stockData.quantity}
        `);

        if result.affectedRowCount > 0 {
            return { message: "Blood group stock saved successfully." };
        } else {
            return { message: "Failed to save blood group stock." };
        }
    }

    // Get all blood group stocks for the hospital
    resource function get bloodgroups(http:Request req) returns BloodGroupStock[]|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

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

        return stockList;
    }

    //edit blood stock
    resource function put bloodgroups(http:Request req, @http:Payload BloodGroupStock stockData) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_group
            SET quantity = ${stockData.quantity},
             last_modified = NOW()
            WHERE hospital_id = ${hospitalId} 
              AND blood_name = ${stockData.blood_name}
        `);

        if result.affectedRowCount > 0 {
            return { message: "Blood group stock updated successfully." };
        } else {
            return { message: "Blood group not found or already deleted." };
        }
    }

    // Update donation status and set donate_date to current time when completed
    resource function post updateStatus(http:Request req, @http:Payload DonationStatusUpdate statusUpdate) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        sql:ExecutionResult result;
        
        if statusUpdate.new_status == "Complete" {
            // Use Sri Lanka time
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
                // Fetch donor_id from donation
                record {| int donor_id; |} donorRow = check database:dbClient->queryRow(
                    `SELECT donor_id FROM donation WHERE donation_id = ${statusUpdate.donation_id}`
                );
                int donorId = donorRow.donor_id;

                // Update donor's last_donation_date
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

        if result.affectedRowCount == 0 {
            return { message: "Update failed. Donation not found or access denied." };
        }

        return { message: "Donation status updated successfully." };
    }

    // Get donations with donor details
    resource function get donationsWithDonors(http:Request req) returns DonationDonor[]|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

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

        return donations;
    }

// Delete (deactivate) donor endpoint
resource function delete donors/[int donorId](http:Request req) returns json|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return { message: "Missing hospital_id in request", success: false };
    }
    
    int hospitalId;
    do {
        int|error hospitalIdResult = int:fromString(hospitalIdStr);
        if hospitalIdResult is error {
            return { message: "Invalid hospital_id format", success: false };
        }
        hospitalId = hospitalIdResult;
    }

    // First check if donor exists and belongs to this hospital
    stream<record {| int donor_id; string status; |}, sql:Error?> donorStream = database:dbClient->query(`
        SELECT donor_id, status
        FROM donor 
        WHERE donor_id = ${donorId}
    `);

    record {| int donor_id; string status; |}[] donors = [];
    error? streamError = donorStream.forEach(function(record {| int donor_id; string status; |} row) {
        donors.push(row);
    });

    if streamError is error {
        log:printError("Database query error: " + streamError.message());
        return { 
            message: "Database error: " + streamError.message(), 
            success: false 
        };
    }

    if donors.length() == 0 {
        return { 
            message: "Donor not found or access denied.", 
            success: false 
        };
    }

    record {| int donor_id; string status; |} donor = donors[0];

    // Check if donor is already deactivated
    if donor.status == "deactive" {
        return { 
            message: "Donor is already deactivated.", 
            success: false 
        };
    }

    // Update donor status to deactive
    sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
        UPDATE donor 
        SET status = 'deactive'
        WHERE donor_id = ${donorId}
    `);

    if result is sql:Error {
        log:printError("Update query error: " + result.message());
        return { 
            message: "Failed to update donor: " + result.message(), 
            success: false 
        };
    }

    if result.affectedRowCount == 0 {
        return { 
            message: "Failed to deactivate donor. No rows affected.", 
            success: false 
        };
    }

    log:printInfo("Donor deactivated successfully: donor_id=" + donorId.toString() + ", hospital_id=" + hospitalId.toString());

    return { 
        message: "Donor deactivated successfully.", 
        success: true,
        donor_id: donorId
    };
}


     // Generate and send donation certificate via Gmail
    resource function post sendCertificate(http:Request req, @http:Payload CertificateRequest certificateRequest) returns json|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return { message: "Missing hospital_id in request", success: false };
    }
    int hospitalId = check int:fromString(hospitalIdStr);

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

    if streamError is error {
        log:printError("Failed to fetch donation details: " + streamError.message());
        return { message: "Failed to fetch donation details: " + streamError.message(), success: false };
    }

    if donationDetails.length() == 0 {
        return { message: "Donation not found or not completed", success: false };
    }

    DonationDonor donation = donationDetails[0];

    // Generate certificate HTML
    string certificateHtml = generateCertificateHtml(donation, certificateRequest.hospital_name ?: "City General Hospital");

    // Send email with certificate using Gmail SMTP
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
            return { 
                message: "Failed to send certificate: " + emailResult.message(),
                success: false 
            };
        }
    } else {
        log:printWarn("No valid email address found for donor: " + donation.donor_name);
        return { message: "No valid email address available for donor", success: false };
    }

    // Use Sri Lanka time
    time:Utc slTime = getSriLankaTime();
    time:Civil civilTime = time:utcToCivil(slTime);
    string formattedDateTime = string `${civilTime.year}-${civilTime.month.toString().padStart(2, "0")}-${civilTime.day.toString().padStart(2, "0")} ${civilTime.hour.toString().padStart(2, "0")}:${civilTime.minute.toString().padStart(2, "0")}:${civilTime.second.toString().padStart(2, "0")}`;

    // Update donation record to mark certificate as sent
    sql:ExecutionResult|sql:Error result = database:dbClient->execute(`
        UPDATE donation 
        SET certificate_sent = 1,
            certificate_sent_date = ${formattedDateTime}
        WHERE donation_id = ${certificateRequest.donation_id} 
        AND hospital_id = ${hospitalId}
    `);

    if result is sql:Error {
        log:printError("Failed to update certificate status: " + result.message());
        return { 
            message: "Certificate sent but failed to update database: " + result.message(),
            success: true // Email was sent, so consider it partially successful
        };
    }

    if result.affectedRowCount == 0 {
        log:printWarn("No rows updated for donation_id: " + certificateRequest.donation_id.toString());
    }

    log:printInfo("Certificate sent successfully to: " + donation.email);
    
    return { 
        message: "Certificate sent successfully to " + donation.email,
        success: true,
        donor_name: donation.donor_name
    };
}

    // Get certificate preview (for frontend display)
    resource function get certificatePreview/[int donationId](http:Request req) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

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

        if donationDetails.length() == 0 {
            return error("Donation not found or not completed");
        }

        DonationDonor donation = donationDetails[0];
        string certificateHtml = generateCertificateHtml(donation, hospitalName);

        return {
            success: true,
            html: certificateHtml,
            donor_name: donation.donor_name,
            blood_group: donation.blood_group,
            donation_date: donation.donate_date
        };
    }


    // New endpoint to fetch hospital details
    resource function get hospital(http:Request req) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        record {| string hospital_name; |}? hospital = check database:dbClient->queryRow(
            `SELECT hospital_name FROM hospital WHERE hospital_id = ${hospitalId}`
        );

        if hospital is () {
            return error("Hospital not found");
        }

        return { hospital_name: hospital.hospital_name };
    }

    // New endpoint to fetch total donors count
    resource function get totalDonors(http:Request req) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        record {| int donor_count; |} result = check database:dbClient->queryRow(
            `SELECT COUNT(DISTINCT donor_id) AS donor_count 
             FROM donation 
             WHERE hospital_id = ${hospitalId} 
             `
        );

        return { total_donors: result.donor_count };
    }

    // New endpoint to fetch total donations count
    resource function get totalDonations(http:Request req) returns json|error {
        string? hospitalIdStr = req.getQueryParamValue("hospital_id");
        if hospitalIdStr is () {
            return error("Missing hospital_id in request");
        }
        int hospitalId = check int:fromString(hospitalIdStr);

        record {| int donation_count; |} result = check database:dbClient->queryRow(
            `SELECT COUNT(*) AS donation_count 
             FROM donation 
             WHERE hospital_id = ${hospitalId} 
             AND donate_status = 'Complete'`
        );

        return { total_donations: result.donation_count };
    }


// Add these endpoints to your hospital service

// Get all blood campaigns for a hospital
resource function get bloodcampaigns(http:Request req) returns BloodCampaign[]|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return error("Missing hospital_id in request");
    }
    int hospitalId = check int:fromString(hospitalIdStr);

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

    return campaigns;
}

// Add new blood campaign
resource function post bloodcampaigns/add(http:Request req) returns json|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return error("Missing hospital_id in request");
    }
    int hospitalId = check int:fromString(hospitalIdStr);

    // Handle multipart form data
    mime:Entity[]? bodyParts = check req.getBodyParts();
    if bodyParts is () {
        return { message: "No form data received", success: false };
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
        return { message: "Campaign title is required", success: false };
    }
    if location.trim().length() == 0 {
        return { message: "Location is required", success: false };
    }
    if campaignDate.trim().length() == 0 {
        return { message: "Date is required", success: false };
    }
    if imageData is () {
        return { message: "Image is required", success: false };
    }

    // Insert campaign into database
    sql:ExecutionResult result = check database:dbClient->execute(`
        INSERT INTO blood_campaign (hospital_id, title, location, image, date, status)
        VALUES (${hospitalId}, ${title.trim()}, ${location.trim()}, ${imageData}, ${campaignDate}, 'active')
    `);

    if result.affectedRowCount == 0 {
        return { message: "Failed to add campaign", success: false };
    }

    return { 
        message: "Campaign added successfully", 
        success: true,
        campaign_id: result.lastInsertId
    };
}

// Update blood campaign
resource function put bloodcampaigns/[int campaignId](http:Request req) returns json|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return error("Missing hospital_id in request");
    }
    int hospitalId = check int:fromString(hospitalIdStr);

    // Handle multipart form data
    mime:Entity[]? bodyParts = check req.getBodyParts();
    if bodyParts is () {
        return { message: "No form data received", success: false };
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
        return { message: "Campaign title is required", success: false };
    }
    if location.trim().length() == 0 {
        return { message: "Location is required", success: false };
    }
    if campaignDate.trim().length() == 0 {
        return { message: "Date is required", success: false };
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
        return { message: "Campaign not found or access denied", success: false };
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
        return { message: "Failed to update campaign", success: false };
    }

    return { 
        message: "Campaign updated successfully", 
        success: true 
    };
}

// Delete (deactivate) blood campaign
resource function delete bloodcampaigns/[int campaignId](http:Request req) returns json|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return { message: "Missing hospital_id in request", success: false };
    }
    int hospitalId = check int:fromString(hospitalIdStr);

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

    if campaigns.length() == 0 {
        return { 
            message: "Campaign not found or access denied", 
            success: false 
        };
    }

    record {| int campaign_id; string status; |} campaign = campaigns[0];

    // Check if campaign is already deactivated
    if campaign.status == "deactive" {
        return { 
            message: "Campaign is already deactivated", 
            success: false 
        };
    }

    // Update campaign status to deactive
    sql:ExecutionResult result = check database:dbClient->execute(`
        UPDATE blood_campaign 
        SET status = 'deactive'
        WHERE campaign_id = ${campaignId} AND hospital_id = ${hospitalId}
    `);

    if result.affectedRowCount == 0 {
        return { 
            message: "Failed to deactivate campaign", 
            success: false 
        };
    }

    log:printInfo("Campaign deactivated successfully: campaign_id=" + campaignId.toString() + ", hospital_id=" + hospitalId.toString());

    return { 
        message: "Campaign deactivated successfully", 
        success: true,
        campaign_id: campaignId
    };
}

// Get campaign image
resource function get bloodcampaigns/image/[int campaignId](http:Request req) returns http:Response|error {
    string? hospitalIdStr = req.getQueryParamValue("hospital_id");
    if hospitalIdStr is () {
        return createErrorResponse("Missing hospital_id in request", 400);
    }
    int hospitalId = check int:fromString(hospitalIdStr);

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

    } // Default to JPEG, you might want to store content type in DB
    return response;
}
    
}



// Helper function to create error responses
function createErrorResponse(string message, int statusCode) returns http:Response {
    http:Response response = new;
    response.statusCode = statusCode;
    response.setJsonPayload({message: message, success: false});
    return response;
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