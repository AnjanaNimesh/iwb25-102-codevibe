// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;


// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }

// service /dashboard/admin on database:dashboardListener{
//     //view all donors
//      resource function get donors(http:Request req) returns donorDetails[]|error {
//         // Query all donors (no filter)
//         stream<donorDetails, sql:Error?> donorStream = database:dbClient->query(
//             `SELECT d.donor_id, d.donor_name, d.blood_group, dis.district_name,  d.email, d.phone_number, d.status
//             FROM donor d, district dis 
//             WHERE d.district_id = dis.district_id`,
//             donorDetails
//         );

//         donorDetails[] donors = [];
//         check donorStream.forEach(function(donorDetails donor) {
//             donors.push(donor);
//         });

//         return donors;
//     }

//     //deactivate a donor
//     resource function delete donors/[int donor_id](http:Request req) returns json|error {
//         sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'deactive' WHERE donor_id = ${donor_id}`;

//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor status set to deactive successfully." };
//         } else {
//             return { message: "Donor not found or already deactive." };
//         }
//     }

//     //activate a donor
//     resource function put donors/activate/[int donor_id](http:Request req) returns json|error {
//         sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'active' WHERE donor_id = ${donor_id}`;

//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor activated successfully." };
//         } else {
//             return { message: "Donor not found or already active." };
//         }
//     }


//     // Add hospitals to the system
// resource function post hospitals(http:Request req) returns json|error {
//     json payload = check req.getJsonPayload(); // Extract JSON

//     // Map JSON to record
//     addHospitalData newHospital = check payload.cloneWithType(addHospitalData);

//     // Step 1: Get district_id from district name
//     sql:ParameterizedQuery getDistrictIdQuery = 
//         `SELECT district_id FROM district WHERE district_name = ${newHospital.district_name}`;

//     record {|int district_id;|}? districtRecord = 
//         check database:dbClient->queryRow(getDistrictIdQuery);

//     if districtRecord is () {
//         return { message: "Invalid district name." };
//     }

//     int districtId = districtRecord.district_id;

//     // Step 2: Insert hospital using district_id
//     sql:ParameterizedQuery insertQuery = 
//         `INSERT INTO hospital 
//             (hospital_name, hospital_type, hospital_address, contact_number, district_id)
//          VALUES (${newHospital.hospital_name}, ${newHospital.hospital_type}, 
//                  ${newHospital.hospital_address}, ${newHospital.contact_number}, ${districtId})`;

//     _ = check database:dbClient->execute(insertQuery);

//     return { message: "Hospital added successfully." };
// }

//     // Update hospital data
// resource function put hospitals/[int hospital_id](http:Request req) returns json|error {
//     json payload = check req.getJsonPayload();
//     addHospitalData updatedHospital = check payload.cloneWithType(addHospitalData);

//     // Step 1: Get district_id from district name
//     sql:ParameterizedQuery getDistrictIdQuery = 
//         `SELECT district_id FROM district WHERE district_name = ${updatedHospital.district_name}`;

//     record {|int district_id;|}? districtRecord = 
//         check database:dbClient->queryRow(getDistrictIdQuery);

//     if districtRecord is () {
//         return { message: "Invalid district name." };
//     }

//     int districtId = districtRecord.district_id;

//     // Step 2: Update hospital with district_id
//     sql:ParameterizedQuery updateQuery = 
//         `UPDATE hospital
//          SET hospital_name = ${updatedHospital.hospital_name},
//              hospital_type = ${updatedHospital.hospital_type},
//              hospital_address = ${updatedHospital.hospital_address},
//              contact_number = ${updatedHospital.contact_number},
//              district_id = ${districtId}
//          WHERE hospital_id = ${hospital_id}`;

//     _ = check database:dbClient->execute(updateQuery);

//     return { message: "Hospital updated successfully." };
// }


//     //view all hospitals
//     resource function get hospitalData(http:Request req) returns viewHospitalData[]|error {
//          stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(
//             `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.hospital_address,h.status,h.contact_number, d.district_name
//             FROM hospital h, district d
//             WHERE h.district_id = d.district_id`,
//             viewHospitalData
//         );

//         viewHospitalData[] hospitals = [];
//         check hospitalStream.forEach(function(viewHospitalData hospital) {
//             hospitals.push(hospital);
//         });

//         return hospitals;
//     }

//     //view a slelected hospital
//     resource function get hospitalData/[int hospital_id](http:Request req) returns viewHospitalData[]|error {
//     sql:ParameterizedQuery hospitalQuery = `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.status, h.hospital_address, h.contact_number, d.district_name
//             FROM hospital h, district d
//             WHERE h.district_id = d.district_id AND h.hospital_id = ${hospital_id}`;
    
//     stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery, viewHospitalData);
    
//     viewHospitalData[] hospitals = [];
//     check hospitalStream.forEach(function(viewHospitalData hospital) {
//         hospitals.push(hospital);
//     });
    
//     return hospitals;
// }

//     //deactive hospital
//     resource function delete hospitals/[int hospital_id](http:Request req) returns json|error {

//         sql:ParameterizedQuery deleteQuery = `UPDATE hospital SET status = 'deactive' WHERE hospital_id = ${hospital_id}`;

//         sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital deleted successfully." };
//         } else {
//             return { message: "Hospital not found or already deleted." };
//         }
//     }

//     //active a hospital
//      resource function put hospitals/activate/[int hospital_id](http:Request req) returns json|error {
//         sql:ParameterizedQuery updateQuery = `UPDATE hospital SET status = 'active' WHERE hospital_id = ${hospital_id}`;

//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor activated successfully." };
//         } else {
//             return { message: "Donor not found or already active." };
//         }
//     }

//     //view hospital users
//     resource function get hospitalUserData(http:Request req) returns viewHospitalUsers[]|error {
//         stream<viewHospitalUsers, sql:Error?> hospitalUserStream = database:dbClient->query(
//             `SELECT hu.hospital_email, h.hospital_name, h.hospital_type, h.hospital_address, h.contact_number,h.status, d.district_name
//             FROM hospital_user hu, hospital h, district d
//             WHERE hu.hospital_id = h.hospital_id AND h.district_id = d.district_id`,
//             viewHospitalUsers
//         );    

//         viewHospitalUsers[] hospital_users = [];
//         check hospitalUserStream.forEach(function(viewHospitalUsers hospital_user){
//             hospital_users.push(hospital_user);
//         });
//         return hospital_users;
//     }

//     //hospital id wise hospital user data
//     resource function get hospitalUserData/[int hospital_id](http:Request req) 
//         returns viewHospitalUsers[]|error {

//     stream<viewHospitalUsers, sql:Error?> hospitalUserStream = 
//         database:dbClient->query(
//             `SELECT hu.hospital_email, 
//                     h.hospital_name, 
//                     h.hospital_type, 
//                     h.hospital_address, 
//                     h.contact_number, 
//                     h.status,
//                     d.district_name
//              FROM hospital_user hu
//              JOIN hospital h ON hu.hospital_id = h.hospital_id
//              JOIN district d ON h.district_id = d.district_id
//              WHERE h.hospital_id = ${hospital_id}`,
//             viewHospitalUsers
//         );    

//     viewHospitalUsers[] hospital_users = [];
//     check hospitalUserStream.forEach(function(viewHospitalUsers hospital_user) {
//         hospital_users.push(hospital_user);
//     });

//     return hospital_users;
// }


// resource function post hospitalUsers(http:Request req) returns json|error {
//     json payload = check req.getJsonPayload();
//     addHospitalUsers newhospitalUsers = check payload.cloneWithType(addHospitalUsers);

//     // Get hospital_id
//     sql:ParameterizedQuery getHospitalIdQuery = 
//         `SELECT hospital_id FROM hospital WHERE hospital_name = ${newhospitalUsers.hospital_name}`;
//     record {|int hospital_id;|}? hospitalRecord = check database:dbClient->queryRow(getHospitalIdQuery);

//     if hospitalRecord is () {
//         return { message: "Invalid hospital name." };
//     }

//     int hospitalId = hospitalRecord.hospital_id;

//     // Hash the password using crypto:generateBcrypt
//     string hashedPassword = check crypto:hashBcrypt(newhospitalUsers.password, 12);

//     sql:ParameterizedQuery insertQuery = `INSERT INTO hospital_user 
//         (hospital_email, hospital_id, password_hash)
//         VALUES (${newhospitalUsers.hospital_email}, ${hospitalId}, ${hashedPassword})`;

//     var result = database:dbClient->execute(insertQuery);

//     if result is error {
//         string errMsg = result.message();
//         if string:indexOf(errMsg, "Duplicate entry") != -1 {
//             return { message: "A hospital user with this email or hospital ID already exists." };
//         } else {
//             return { message: "An unexpected error occurred: " + errMsg };
//         }
//     }

//     return { message: "Hospital User added successfully." };
// }

//     //update hospital user details
//     resource function put hospitalUsers(http:Request req) returns json|error {
//     // Extract JSON payload
//     json payload = check req.getJsonPayload();

//     // Map JSON payload to record type (without password)
//     updateHospitalUsers updateUserData = check payload.cloneWithType(updateHospitalUsers);

//     // Get hospital_id from hospital_name
//     sql:ParameterizedQuery getHospitalIdQuery = 
//         `SELECT hospital_id FROM hospital WHERE hospital_name = ${updateUserData.hospital_name}`;

//     record {|int hospital_id;|}? hospitalRecord = 
//         check database:dbClient->queryRow(getHospitalIdQuery);

//     if hospitalRecord is () {
//         return { message: "Invalid hospital name." };
//     }

//     int newHospitalId = hospitalRecord.hospital_id;

//     // Update hospital_user table without changing password
//     sql:ParameterizedQuery updateQuery = 
//         `UPDATE hospital_user 
//          SET hospital_email = ${updateUserData.hospital_email}, 
//              hospital_id = ${newHospitalId}
//          WHERE hospital_id = ${updateUserData.hospital_id}`;

//     var result = database:dbClient->execute(updateQuery);

//     if result is error {
//         string errMsg = result.message();

//         if string:indexOf(errMsg, "Duplicate entry") != -1 {
//             return { message: "A hospital user with this hospital email or hospital ID already exists." };
//         } else {
//             return { message: "An unexpected error occurred: " + errMsg };
//         }
//     }

//     return { message: "Hospital User updated successfully." };
// }



//     //deactive hospital user
//     resource function delete hospitalUser/[int hospital_id](http:Request req) returns json|error {

//         sql:ParameterizedQuery deleteQuery = `UPDATE hospital_user SET status = 'deactive' WHERE hospital_id = ${hospital_id}`;

//         sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital User deactivated successfully." };
//         } else {
//             return { message: "Hospital User not found or already deactivated." };
//         }
//     }

//     //active hospital user
//     resource function put hospitalUser/activate/[int hospital_id](http:Request req) returns json|error {
//         sql:ParameterizedQuery updateQuery = `UPDATE hospital_user SET status = 'active' WHERE hospital_id = ${hospital_id}`;

//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital user activated successfully." };
//         } else {
//             return { message: "Hospital user not found or already active." };
//         }
//     }

//     //total donor count
//     resource function get donorCount(http:Request req) returns json|error{
//         sql:ParameterizedQuery countDonorsQuery = `SELECT count(*) AS cnt FROM donor`;
//         record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonorsQuery);

//         if donorCount is record {| int cnt; |} {
//             return { totalDonors: donorCount.cnt };
//         } else {
//             return { message: "Unable to retrieve donor count." };
//         }
//     }

//     //total hospital count
//     resource function get hospitalCount(http:Request req) returns  json|error {
//         sql:ParameterizedQuery countHospitalQuery = `SELECT count(*) AS cnt FROM hospital`;
//         record {|int cnt;|} ? hospitalCount = check database:dbClient->queryRow(countHospitalQuery);

//         if hospitalCount is record {|int cnt;|}{
//             return {totalHospitals: hospitalCount.cnt};
//         }else {
//             return {message: "Unable to retrieve hospital count."};
//         }
//     }

//     //total donation count
//     resource function get donationCount(http:Request req) returns json|error {
//         sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donation`;
//         record {|int cnt;|} ? donationCount = check database:dbClient->queryRow(countDonationQuery);

//         if donationCount is record {|int cnt;|}{
//             return {totalDonations: donationCount.cnt};
//         }else{
//             return {message: "Unable to retrieve hospital count."};
//         }
//     }  

//     //total request count
//     resource function get requestCount(http:Request req) returns json|error {
//         sql:ParameterizedQuery countRequestQuery = `SELECT count(*) AS cnt FROM blood_request`;
//         record {|int cnt;|} ? requestCount = check database:dbClient->queryRow(countRequestQuery);

//         if requestCount is record {|int cnt;|}{
//             return {totalRequests : requestCount.cnt};
//         }else{
//             return {message: "Unable to retrieve request count."};
//         }
//     } 

//     //total number of requests by hospital
//     resource function get requestCount/[int hospital_id](http:Request req) returns json|error {
//         sql:ParameterizedQuery countRequestQuery = `SELECT count(*) AS cnt FROM blood_request WHERE hospital_id = ${hospital_id}`;
//         record {|int cnt;|} ? requestCount = check database:dbClient->queryRow(countRequestQuery);

//         if requestCount is record {|int cnt;|}{
//             return {totalRequests : requestCount.cnt};
//         }else{
//             return {message: "Unable to retrieve request count."};
//         }
//     } 

//     //total donors in a hospital
//     resource function get donorsCount/[int hospital_id](http:Request req) returns json|error {
//         sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donation WHERE hospital_id= ${hospital_id}`;
//         record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

//         if donorCount is record {|int cnt;|}{
//             return {totalDonors : donorCount.cnt};
//         }else{
//             return {message: "Unable to retrieve donor count."};
//         }
//     }

//     //total number of donors in each district
//     // resource function get donorCount/[int district_id](http:Request req) returns json|error {
//     //     sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donor WHERE district_id= ${district_id}`;
//     //     record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

//     //     if donorCount is record {|int cnt;|}{
//     //         return {totalDonors : donorCount.cnt};
//     //     }else{
//     //         return {message: "Unable to retrieve donor count."};
//     //     }
//     // }

//     resource function get donorCount/[int district_id](http:Request req) returns json|error {
//     sql:ParameterizedQuery countDonationQuery = 
//         `SELECT d.district_name, COUNT(dr.donor_id) AS cnt
//          FROM district d
//          LEFT JOIN donor dr ON d.district_id = dr.district_id
//          WHERE d.district_id = ${district_id}
//          GROUP BY d.district_name`;

//     record {|string district_name; int cnt;|}? donorCount = 
//         check database:dbClient->queryRow(countDonationQuery);

//     if donorCount is record {|string district_name; int cnt;|} {
//         return {
//             districtName: donorCount.district_name,
//             totalDonors: donorCount.cnt
//         };
//     } else {
//         return { message: "Unable to retrieve donor count." };
//     }
// }

//     // district wise hospital count
//     resource function get hopitalCount/[int district_id](http:Request req) returns json|error {
//     sql:ParameterizedQuery countHospitalQuery = 
//         `SELECT d.district_name, COUNT(*) AS cnt
//          FROM district d, hospital h
//          WHERE d.district_id = ${district_id} AND h.district_id = d.district_id
//          GROUP BY d.district_name`;

//     record {|string district_name; int cnt;|}? hospitalCount = 
//         check database:dbClient->queryRow(countHospitalQuery);

//     if hospitalCount is record {|string district_name; int cnt;|} {
//         return {
//             districtName: hospitalCount.district_name,
//             totalHospitals: hospitalCount.cnt
//         };
//     } else {
//         return { message: "Unable to retrieve hospital count." };
//     }
// }


//     //active donor count
//     resource function get activeDonorCount(http:Request req) returns json|error {
//         sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donor WHERE status = "active"`;
//         record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

//         if donorCount is record {|int cnt;|}{
//             return {totalActiveDonors : donorCount.cnt};
//         }else{
//             return {message: "Unable to retrieve active donor count."};
//         }
//     }

//     //deactive donor count
//     resource function get deactiveDonorCount(http:Request req) returns json|error {
//         sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donor WHERE status = "deactive"`;
//         record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

//         if donorCount is record {|int cnt;|}{
//             return {totalDeactiveDonors : donorCount.cnt};
//         }else{
//             return {message: "Unable to retrieve deactive donor count."};
//         }
//     }

//     //active hospital count
//     resource function get activehospitalCount(http:Request req) returns json|error {
//         sql:ParameterizedQuery countHospitalQuery = `SELECT count(*) AS cnt FROM hospital WHERE status = "active"`;
//         record {|int cnt;|} ? hospitalCount = check database:dbClient->queryRow(countHospitalQuery);

//         if hospitalCount is record {|int cnt;|}{
//             return {totalActiveHospitals : hospitalCount.cnt};
//         }else{
//             return {message: "Unable to retrieve active hospital count."};
//         }
//     }

//     //deactive hospital count
//     resource function get deactivehospitalCount(http:Request req) returns json|error {
//         sql:ParameterizedQuery countHospitalQuery = `SELECT count(*) AS cnt FROM hospital WHERE status = "deactive"`;
//         record {|int cnt;|} ? hospitalCount = check database:dbClient->queryRow(countHospitalQuery);

//         if hospitalCount is record {|int cnt;|}{
//             return {totalActiveHospitals : hospitalCount.cnt};
//         }else{
//             return {message: "Unable to retrieve deactive hospital count."};
//         }
//     }

//     //view all districts
//     resource function get districts(http:Request req) returns District[]|error {
//     sql:ParameterizedQuery districtQuery = `SELECT district_id, district_name FROM district`;
    
//     stream<District, sql:Error?> districtStream = database:dbClient->query(districtQuery, District);
    
//     District[] districts = [];
//     check districtStream.forEach(function(District district) {
//         districts.push(district);
//     });
    
//     return districts;
// }

//     //hospital wise blood quantity
//     resource function get bloodStocks(http:Request req) returns ViewHospitalBloodStock[]|error {
//         stream<ViewHospitalBloodStock, sql:Error?> bloodStream = database:dbClient->query(
//             `SELECT h.hospital_name, d.district_name, b.blood_name, b.quantity, b.status_indicator, b.last_modified
//             FROM blood_group b, district d, hospital h 
//             WHERE b.hospital_id = h.hospital_id AND h.district_id = d.district_id`,
//             ViewHospitalBloodStock
//         );

//         ViewHospitalBloodStock[] stock = [];
//         check bloodStream.forEach(function(ViewHospitalBloodStock bloodStock) {
//             stock.push(bloodStock);
//         });

//         return stock; 
//     }   

//     //get hospital name and id
//     resource function get hospitalName(http:Request req) returns viewHospitalName[]|error {
//     sql:ParameterizedQuery hospitalQuery = `SELECT hospital_id, hospital_name FROM hospital`;
    
//     stream<viewHospitalName, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery, viewHospitalName);
    
//     viewHospitalName[] hospitals = [];
//     check hospitalStream.forEach(function(viewHospitalName hospital) {
//         hospitals.push(hospital);
//     });
    
//     return hospitals;
// }

//     //total blood quantity
//     resource function get totalBloodStock(http:Request req) returns bloodQuantity[]|error {
//         stream<bloodQuantity, sql:Error?> bloodStream = database:dbClient->query(
//             `SELECT blood_name, CAST(SUM(quantity) AS SIGNED) AS quantity
//             FROM blood_group 
//             GROUP BY blood_name`,
//             bloodQuantity
//         );

//         bloodQuantity[] stock = [];
//         check bloodStream.forEach(function(bloodQuantity bloodStock) {
//             stock.push(bloodStock);
//         });

//         return stock; 
//     }   


// }

// public function startDashboardAdminService() returns error? {
//     // Function to integrate with the service start pattern
//     io:println("Dashboard Admin service started on port 9092");
// }



// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;
// import ballerina/regex as re;
// import ballerina/lang.array as arrays;
// import ballerina/time;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }

// service /dashboard/admin on database:dashboardListener{
    
//     // Admin token validation function
//     function validateAdminToken(http:Request req) returns boolean|error {
//         http:Cookie[]? cookies = req.getCookies();
//         string? token = ();

//         // Extract token from cookies
//         if cookies is http:Cookie[] {
//             foreach http:Cookie cookie in cookies {
//                 if cookie.name == "auth_token" {
//                     token = cookie.value;
//                     break;
//                 }
//             }
//         }

//         if token is () {
//             io:println("No auth token found in request");
//             return false;
//         }

//         // Parse JWT token
//         string[] tokenParts = re:split(token, "\\.");
//         if tokenParts.length() != 3 {
//             io:println("Invalid token format");
//             return false;
//         }

//         string encodedPayload = tokenParts[1];
//         byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

//         if payloadBytes is error {
//             io:println("Invalid token encoding");
//             return false;
//         }

//         string|error payloadStr = string:fromBytes(payloadBytes);
//         if payloadStr is error {
//             io:println("Invalid token payload encoding");
//             return false;
//         }

//         json|error payloadJson = payloadStr.fromJsonString();
//         if payloadJson is error {
//             io:println("Invalid token payload JSON");
//             return false;
//         }

//         if !(payloadJson is map<json>) {
//             io:println("Invalid payload format");
//             return false;
//         }

//         map<json> payload = <map<json>>payloadJson;

//         // Check token expiration
//         json? expJson = payload?.exp;
//         if expJson is () || !(expJson is decimal) {
//             io:println("Invalid or missing expiration");
//             return false;
//         }

//         decimal exp = <decimal>expJson;
//         decimal currentTime = <decimal>time:utcNow()[0];
//         if exp < currentTime {
//             io:println("Token expired");
//             return false;
//         }

//         // Check issuer
//         json? issuerJson = payload?.iss;
//         if issuerJson is () || !(issuerJson is string) || <string>issuerJson != "bloodlink-auth-service" {
//             io:println("Invalid issuer");
//             return false;
//         }

//         // Check role
//         json? customClaimsJson = payload?.customClaims;
//         if customClaimsJson is () || !(customClaimsJson is map<json>) {
//             io:println("Invalid custom claims");
//             return false;
//         }

//         map<json> customClaims = <map<json>>customClaimsJson;
//         json? roleJson = customClaims?.role;
        
//         if roleJson is () || !(roleJson is string) || <string>roleJson != "admin" {
//             io:println("Access denied: User role is not admin");
//             return false;
//         }

//         io:println("Admin token validation successful");
//         return true;
//     }

//     //view all donors - ADMIN ONLY
//     resource function get donors(http:Request req) returns donorDetails[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         // Query all donors (no filter)
//         stream<donorDetails, sql:Error?> donorStream = database:dbClient->query(
//             `SELECT d.donor_id, d.donor_name, d.blood_group, dis.district_name, d.email, d.phone_number, d.status
//             FROM donor d, district dis 
//             WHERE d.district_id = dis.district_id`,
//             donorDetails
//         );

//         donorDetails[] donors = [];
//         check donorStream.forEach(function(donorDetails donor) {
//             donors.push(donor);
//         });

//         return donors;
//     }

//     //deactivate a donor - ADMIN ONLY
//     resource function delete donors/[int donor_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'deactive' WHERE donor_id = ${donor_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor status set to deactive successfully." };
//         } else {
//             return { message: "Donor not found or already deactive." };
//         }
//     }

//     //activate a donor - ADMIN ONLY
//     resource function put donors/activate/[int donor_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'active' WHERE donor_id = ${donor_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor activated successfully." };
//         } else {
//             return { message: "Donor not found or already active." };
//         }
//     }

//     // Add hospitals to the system - ADMIN ONLY
//     resource function post hospitals(http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         json payload = check req.getJsonPayload();
//         addHospitalData newHospital = check payload.cloneWithType(addHospitalData);

//         // Get district_id from district name
//         sql:ParameterizedQuery getDistrictIdQuery = 
//             `SELECT district_id FROM district WHERE district_name = ${newHospital.district_name}`;

//         record {|int district_id;|}? districtRecord = 
//             check database:dbClient->queryRow(getDistrictIdQuery);

//         if districtRecord is () {
//             return { message: "Invalid district name." };
//         }

//         int districtId = districtRecord.district_id;

//         // Insert hospital using district_id
//         sql:ParameterizedQuery insertQuery = 
//             `INSERT INTO hospital 
//                 (hospital_name, hospital_type, hospital_address, contact_number, district_id)
//              VALUES (${newHospital.hospital_name}, ${newHospital.hospital_type}, 
//                      ${newHospital.hospital_address}, ${newHospital.contact_number}, ${districtId})`;

//         _ = check database:dbClient->execute(insertQuery);
//         return { message: "Hospital added successfully." };
//     }

//     // Update hospital data - ADMIN ONLY
//     resource function put hospitals/[int hospital_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         json payload = check req.getJsonPayload();
//         addHospitalData updatedHospital = check payload.cloneWithType(addHospitalData);

//         // Get district_id from district name
//         sql:ParameterizedQuery getDistrictIdQuery = 
//             `SELECT district_id FROM district WHERE district_name = ${updatedHospital.district_name}`;

//         record {|int district_id;|}? districtRecord = 
//             check database:dbClient->queryRow(getDistrictIdQuery);

//         if districtRecord is () {
//             return { message: "Invalid district name." };
//         }

//         int districtId = districtRecord.district_id;

//         // Update hospital with district_id
//         sql:ParameterizedQuery updateQuery = 
//             `UPDATE hospital
//              SET hospital_name = ${updatedHospital.hospital_name},
//                  hospital_type = ${updatedHospital.hospital_type},
//                  hospital_address = ${updatedHospital.hospital_address},
//                  contact_number = ${updatedHospital.contact_number},
//                  district_id = ${districtId}
//              WHERE hospital_id = ${hospital_id}`;

//         _ = check database:dbClient->execute(updateQuery);
//         return { message: "Hospital updated successfully." };
//     }

//     //view all hospitals - ADMIN ONLY
//     resource function get hospitalData(http:Request req) returns viewHospitalData[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(
//             `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.hospital_address,h.status,h.contact_number, d.district_name
//             FROM hospital h, district d
//             WHERE h.district_id = d.district_id`,
//             viewHospitalData
//         );

//         viewHospitalData[] hospitals = [];
//         check hospitalStream.forEach(function(viewHospitalData hospital) {
//             hospitals.push(hospital);
//         });

//         return hospitals;
//     }

//     //view a selected hospital - ADMIN ONLY
//     resource function get hospitalData/[int hospital_id](http:Request req) returns viewHospitalData[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery hospitalQuery = `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.status, h.hospital_address, h.contact_number, d.district_name
//                 FROM hospital h, district d
//                 WHERE h.district_id = d.district_id AND h.hospital_id = ${hospital_id}`;
        
//         stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery, viewHospitalData);
        
//         viewHospitalData[] hospitals = [];
//         check hospitalStream.forEach(function(viewHospitalData hospital) {
//             hospitals.push(hospital);
//         });
        
//         return hospitals;
//     }

//     //deactive hospital - ADMIN ONLY
//     resource function delete hospitals/[int hospital_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery deleteQuery = `UPDATE hospital SET status = 'deactive' WHERE hospital_id = ${hospital_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital deleted successfully." };
//         } else {
//             return { message: "Hospital not found or already deleted." };
//         }
//     }

//     //active a hospital - ADMIN ONLY
//     resource function put hospitals/activate/[int hospital_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery updateQuery = `UPDATE hospital SET status = 'active' WHERE hospital_id = ${hospital_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital activated successfully." };
//         } else {
//             return { message: "Hospital not found or already active." };
//         }
//     }

//     // Continue with all other endpoints following the same pattern...
//     // For brevity, I'll show a few more examples:

//     //view hospital users - ADMIN ONLY
//     resource function get hospitalUserData(http:Request req) returns viewHospitalUsers[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         stream<viewHospitalUsers, sql:Error?> hospitalUserStream = database:dbClient->query(
//             `SELECT hu.hospital_email, h.hospital_name, h.hospital_type, h.hospital_address, h.contact_number,h.status, d.district_name
//             FROM hospital_user hu, hospital h, district d
//             WHERE hu.hospital_id = h.hospital_id AND h.district_id = d.district_id`,
//             viewHospitalUsers
//         );    

//         viewHospitalUsers[] hospital_users = [];
//         check hospitalUserStream.forEach(function(viewHospitalUsers hospital_user){
//             hospital_users.push(hospital_user);
//         });
//         return hospital_users;
//     }

//     //add hospital users to the system - ADMIN ONLY
//     resource function post hospitalUsers(http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         json payload = check req.getJsonPayload();
//         addHospitalUsers newhospitalUsers = check payload.cloneWithType(addHospitalUsers);

//         // Get hospital_id
//         sql:ParameterizedQuery getHospitalIdQuery = 
//             `SELECT hospital_id FROM hospital WHERE hospital_name = ${newhospitalUsers.hospital_name}`;
//         record {|int hospital_id;|}? hospitalRecord = check database:dbClient->queryRow(getHospitalIdQuery);

//         if hospitalRecord is () {
//             return { message: "Invalid hospital name." };
//         }

//         int hospitalId = hospitalRecord.hospital_id;

//         // Hash the password using crypto:generateBcrypt
//         string hashedPassword = check crypto:hashBcrypt(newhospitalUsers.password, 12);

//         sql:ParameterizedQuery insertQuery = `INSERT INTO hospital_user 
//             (hospital_email, hospital_id, password_hash)
//             VALUES (${newhospitalUsers.hospital_email}, ${hospitalId}, ${hashedPassword})`;

//         var result = database:dbClient->execute(insertQuery);

//         if result is error {
//             string errMsg = result.message();
//             if string:indexOf(errMsg, "Duplicate entry") != -1 {
//                 return { message: "A hospital user with this email or hospital ID already exists." };
//             } else {
//                 return { message: "An unexpected error occurred: " + errMsg };
//             }
//         }

//         return { message: "Hospital User added successfully." };
//     }

//     // Add the same admin validation to all other endpoints...
//     // (total donor count, hospital count, etc.)

//     //total donor count - ADMIN ONLY
//     resource function get donorCount(http:Request req) returns json|http:Response|error{
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery countDonorsQuery = `SELECT count(*) AS cnt FROM donor`;
//         record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonorsQuery);

//         if donorCount is record {| int cnt; |} {
//             return { totalDonors: donorCount.cnt };
//         } else {
//             return { message: "Unable to retrieve donor count." };
//         }
//     }

//     // ... Continue adding admin validation to all other endpoints
// }

// public function startDashboardAdminService() returns error? {
//     io:println("Secured Dashboard Admin service started on port 9092 - Admin access only");
// }


// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;
// import ballerina/regex as re;
// import ballerina/lang.array as arrays;
// import ballerina/time;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }

// service /dashboard/admin on database:dashboardListener{
    
//     // Admin token validation function - FIXED
//     // function validateAdminToken(http:Request req) returns boolean|error {
//     //     http:Cookie[]? cookies = req.getCookies();
//     //     string? token = ();

//     //     // Extract token from cookies
//     //     if cookies is http:Cookie[] {
//     //         foreach http:Cookie cookie in cookies {
//     //             if cookie.name == "auth_token" {
//     //                 token = cookie.value;
//     //                 break;
//     //             }
//     //         }
//     //     }

//     //     if token is () {
//     //         io:println("ADMIN ACCESS DENIED: No auth token found in request");
//     //         return false;
//     //     }

//     //     // Parse JWT token
//     //     string[] tokenParts = re:split(token, "\\.");
//     //     if tokenParts.length() != 3 {
//     //         io:println("ADMIN ACCESS DENIED: Invalid token format");
//     //         return false;
//     //     }

//     //     string encodedPayload = tokenParts[1];
//     //     byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

//     //     if payloadBytes is error {
//     //         io:println("ADMIN ACCESS DENIED: Invalid token encoding");
//     //         return false;
//     //     }

//     //     string|error payloadStr = string:fromBytes(payloadBytes);
//     //     if payloadStr is error {
//     //         io:println("ADMIN ACCESS DENIED: Invalid token payload encoding");
//     //         return false;
//     //     }

//     //     json|error payloadJson = payloadStr.fromJsonString();
//     //     if payloadJson is error {
//     //         io:println("ADMIN ACCESS DENIED: Invalid token payload JSON");
//     //         return false;
//     //     }

//     //     if !(payloadJson is map<json>) {
//     //         io:println("ADMIN ACCESS DENIED: Invalid payload format");
//     //         return false;
//     //     }

//     //     map<json> payload = <map<json>>payloadJson;

//     //     // Check token expiration
//     //     json? expJson = payload?.exp;
//     //     if expJson is () || !(expJson is decimal) {
//     //         io:println("ADMIN ACCESS DENIED: Invalid or missing expiration");
//     //         return false;
//     //     }

//     //     decimal exp = <decimal>expJson;
//     //     decimal currentTime = <decimal>time:utcNow()[0];
//     //     if exp < currentTime {
//     //         io:println("ADMIN ACCESS DENIED: Token expired");
//     //         return false;
//     //     }

//     //     // Check issuer
//     //     json? issuerJson = payload?.iss;
//     //     if issuerJson is () || !(issuerJson is string) || <string>issuerJson != "bloodlink-auth-service" {
//     //         io:println("ADMIN ACCESS DENIED: Invalid issuer");
//     //         return false;
//     //     }

//     //     // CRITICAL: Check role - must be exactly "admin"
//     //     json? customClaimsJson = payload?.customClaims;
//     //     if customClaimsJson is () || !(customClaimsJson is map<json>) {
//     //         io:println("ADMIN ACCESS DENIED: Invalid custom claims structure");
//     //         return false;
//     //     }

//     //     map<json> customClaims = <map<json>>customClaimsJson;
//     //     json? roleJson = customClaims?.role;
        
//     //     if roleJson is () {
//     //         io:println("ADMIN ACCESS DENIED: No role found in token");
//     //         return false;
//     //     }
        
//     //     if !(roleJson is string) {
//     //         io:println("ADMIN ACCESS DENIED: Role is not a string");
//     //         return false;
//     //     }
        
//     //     string userRole = <string>roleJson;
//     //     io:println("Token role found: '", userRole, "'");
        
//     //     // STRICT role check - only "admin" allowed
//     //     if userRole != "admin" {
//     //         io:println("ADMIN ACCESS DENIED: User role '", userRole, "' is not 'admin'");
//     //         return false;
//     //     }

//     //     // Additional verification: check subject (email) matches admin pattern
//     //     json? subJson = payload?.sub;
//     //     if subJson is () || !(subJson is string) {
//     //         io:println("ADMIN ACCESS DENIED: Invalid subject");
//     //         return false;
//     //     }
        
//     //     string email = <string>subJson;
//     //     io:println("Admin token validation successful for: ", email);
//     //     return true;
//     // }

//     function validateAdminToken(http:Request req) returns boolean|error {
//     http:Cookie[]? cookies = req.getCookies();
//     string? token = ();

//     // Extract token from cookies
//     if cookies is http:Cookie[] {
//         foreach http:Cookie cookie in cookies {
//             if cookie.name == "auth_token" {
//                 token = cookie.value;
//                 break;
//             }
//         }
//     }

//     if token is () {
//         io:println("ADMIN ACCESS DENIED: No auth token found in request");
//         return false;
//     }

//     io:println("Found token: ", token);

//     // Parse JWT token
//     string[] tokenParts = re:split(token, "\\.");
//     if tokenParts.length() != 3 {
//         io:println("ADMIN ACCESS DENIED: Invalid token format - parts count: ", tokenParts.length());
//         return false;
//     }

//     string encodedPayload = tokenParts[1];
//     io:println("Encoded payload: ", encodedPayload);
    
//     // Fix: Use the correct base64 decoding method
//     byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

//     if payloadBytes is error {
//         io:println("ADMIN ACCESS DENIED: Invalid token encoding - ", payloadBytes.message());
//         return false;
//     }

//     string|error payloadStr = string:fromBytes(payloadBytes);
//     if payloadStr is error {
//         io:println("ADMIN ACCESS DENIED: Invalid token payload encoding - ", payloadStr.message());
//         return false;
//     }

//     io:println("Payload string: ", payloadStr);

//     json|error payloadJson = payloadStr.fromJsonString();
//     if payloadJson is error {
//         io:println("ADMIN ACCESS DENIED: Invalid token payload JSON - ", payloadJson.message());
//         return false;
//     }

//     if !(payloadJson is map<json>) {
//         io:println("ADMIN ACCESS DENIED: Invalid payload format - not a map");
//         return false;
//     }

//     map<json> payload = <map<json>>payloadJson;

//     // Check token expiration
//     json? expJson = payload?.exp;
//     if expJson is () {
//         io:println("ADMIN ACCESS DENIED: Missing expiration");
//         return false;
//     }
    
//     if !(expJson is decimal) {
//         io:println("ADMIN ACCESS DENIED: Invalid expiration format");
//         return false;
//     }

//     decimal exp = <decimal>expJson;
//     decimal currentTime = <decimal>time:utcNow()[0];
//     io:println("Token exp: ", exp, ", Current time: ", currentTime);
    
//     if exp < currentTime {
//         io:println("ADMIN ACCESS DENIED: Token expired");
//         return false;
//     }

//     // Check issuer
//     json? issuerJson = payload?.iss;
//     if issuerJson is () || !(issuerJson is string) {
//         io:println("ADMIN ACCESS DENIED: Invalid or missing issuer");
//         return false;
//     }
    
//     string issuer = <string>issuerJson;
//     if issuer != "bloodlink-auth-service" {
//         io:println("ADMIN ACCESS DENIED: Invalid issuer: ", issuer);
//         return false;
//     }

//     // Check custom claims
//     json? customClaimsJson = payload?.customClaims;
//     if customClaimsJson is () {
//         io:println("ADMIN ACCESS DENIED: Missing custom claims");
//         return false;
//     }
    
//     if !(customClaimsJson is map<json>) {
//         io:println("ADMIN ACCESS DENIED: Invalid custom claims structure");
//         return false;
//     }

//     map<json> customClaims = <map<json>>customClaimsJson;
//     json? roleJson = customClaims?.role;
    
//     if roleJson is () {
//         io:println("ADMIN ACCESS DENIED: No role found in token");
//         return false;
//     }
    
//     if !(roleJson is string) {
//         io:println("ADMIN ACCESS DENIED: Role is not a string");
//         return false;
//     }
    
//     string userRole = <string>roleJson;
//     io:println("Token role found: '", userRole, "'");
    
//     // STRICT role check - only "admin" allowed
//     if userRole != "admin" {
//         io:println("ADMIN ACCESS DENIED: User role '", userRole, "' is not 'admin'");
//         return false;
//     }

//     // Check subject (email)
//     json? subJson = payload?.sub;
//     if subJson is () || !(subJson is string) {
//         io:println("ADMIN ACCESS DENIED: Invalid subject");
//         return false;
//     }
    
//     string email = <string>subJson;
//     io:println("Admin token validation successful for: ", email);
//     return true;
// }

// // Alternative debugging function to test token structure
// function debugToken(string token) returns error? {
//     io:println("=== DEBUG TOKEN ===");
//     string[] parts = re:split(token, "\\.");
//     io:println("Token parts count: ", parts.length());
    
//     if parts.length() >= 2 {
//         string headerPart = parts[0];
//         string payloadPart = parts[1];
        
//         io:println("Header part: ", headerPart);
//         io:println("Payload part: ", payloadPart);
        
//         // Decode header
//         byte[]|error headerBytes = arrays:fromBase64(headerPart);
//         if headerBytes is byte[] {
//             string|error headerStr = string:fromBytes(headerBytes);
//             if headerStr is string {
//                 io:println("Decoded header: ", headerStr);
//             }
//         }
        
//         // Decode payload
//         byte[]|error payloadBytes = arrays:fromBase64(payloadPart);
//         if payloadBytes is byte[] {
//             string|error payloadStr = string:fromBytes(payloadBytes);
//             if payloadStr is string {
//                 io:println("Decoded payload: ", payloadStr);
//                 json|error payloadJson = payloadStr.fromJsonString();
//                 if payloadJson is json {
//                     io:println("Parsed payload JSON: ", payloadJson.toJsonString());
//                 }
//             }
//         }
//     }
//     io:println("=== END DEBUG ===");
// }

//     //view all donors - ADMIN ONLY
//     resource function get donors(http:Request req) returns donorDetails[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         // Query all donors (no filter)
//         stream<donorDetails, sql:Error?> donorStream = database:dbClient->query(
//             `SELECT d.donor_id, d.donor_name, d.blood_group, dis.district_name, d.email, d.phone_number, d.status
//             FROM donor d, district dis 
//             WHERE d.district_id = dis.district_id`,
//             donorDetails
//         );

//         donorDetails[] donors = [];
//         check donorStream.forEach(function(donorDetails donor) {
//             donors.push(donor);
//         });

//         return donors;
//     }

//     //deactivate a donor - ADMIN ONLY
//     resource function delete donors/[int donor_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'deactive' WHERE donor_id = ${donor_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor status set to deactive successfully." };
//         } else {
//             return { message: "Donor not found or already deactive." };
//         }
//     }

//     //activate a donor - ADMIN ONLY
//     resource function put donors/activate/[int donor_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'active' WHERE donor_id = ${donor_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Donor activated successfully." };
//         } else {
//             return { message: "Donor not found or already active." };
//         }
//     }

//     // Add hospitals to the system - ADMIN ONLY
//     resource function post hospitals(http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         json payload = check req.getJsonPayload();
//         addHospitalData newHospital = check payload.cloneWithType(addHospitalData);

//         // Get district_id from district name
//         sql:ParameterizedQuery getDistrictIdQuery = 
//             `SELECT district_id FROM district WHERE district_name = ${newHospital.district_name}`;

//         record {|int district_id;|}? districtRecord = 
//             check database:dbClient->queryRow(getDistrictIdQuery);

//         if districtRecord is () {
//             return { message: "Invalid district name." };
//         }

//         int districtId = districtRecord.district_id;

//         // Insert hospital using district_id
//         sql:ParameterizedQuery insertQuery = 
//             `INSERT INTO hospital 
//                 (hospital_name, hospital_type, hospital_address, contact_number, district_id)
//              VALUES (${newHospital.hospital_name}, ${newHospital.hospital_type}, 
//                      ${newHospital.hospital_address}, ${newHospital.contact_number}, ${districtId})`;

//         _ = check database:dbClient->execute(insertQuery);
//         return { message: "Hospital added successfully." };
//     }

//     // Update hospital data - ADMIN ONLY
//     resource function put hospitals/[int hospital_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         json payload = check req.getJsonPayload();
//         addHospitalData updatedHospital = check payload.cloneWithType(addHospitalData);

//         // Get district_id from district name
//         sql:ParameterizedQuery getDistrictIdQuery = 
//             `SELECT district_id FROM district WHERE district_name = ${updatedHospital.district_name}`;

//         record {|int district_id;|}? districtRecord = 
//             check database:dbClient->queryRow(getDistrictIdQuery);

//         if districtRecord is () {
//             return { message: "Invalid district name." };
//         }

//         int districtId = districtRecord.district_id;

//         // Update hospital with district_id
//         sql:ParameterizedQuery updateQuery = 
//             `UPDATE hospital
//              SET hospital_name = ${updatedHospital.hospital_name},
//                  hospital_type = ${updatedHospital.hospital_type},
//                  hospital_address = ${updatedHospital.hospital_address},
//                  contact_number = ${updatedHospital.contact_number},
//                  district_id = ${districtId}
//              WHERE hospital_id = ${hospital_id}`;

//         _ = check database:dbClient->execute(updateQuery);
//         return { message: "Hospital updated successfully." };
//     }

//     //view all hospitals - ADMIN ONLY
//     resource function get hospitalData(http:Request req) returns viewHospitalData[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(
//             `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.hospital_address,h.status,h.contact_number, d.district_name
//             FROM hospital h, district d
//             WHERE h.district_id = d.district_id`,
//             viewHospitalData
//         );

//         viewHospitalData[] hospitals = [];
//         check hospitalStream.forEach(function(viewHospitalData hospital) {
//             hospitals.push(hospital);
//         });

//         return hospitals;
//     }

//     //view a selected hospital - ADMIN ONLY
//     resource function get hospitalData/[int hospital_id](http:Request req) returns viewHospitalData[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery hospitalQuery = `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.status, h.hospital_address, h.contact_number, d.district_name
//                 FROM hospital h, district d
//                 WHERE h.district_id = d.district_id AND h.hospital_id = ${hospital_id}`;
        
//         stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery, viewHospitalData);
        
//         viewHospitalData[] hospitals = [];
//         check hospitalStream.forEach(function(viewHospitalData hospital) {
//             hospitals.push(hospital);
//         });
        
//         return hospitals;
//     }

//     //deactive hospital - ADMIN ONLY
//     resource function delete hospitals/[int hospital_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery deleteQuery = `UPDATE hospital SET status = 'deactive' WHERE hospital_id = ${hospital_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital deleted successfully." };
//         } else {
//             return { message: "Hospital not found or already deleted." };
//         }
//     }

//     //active a hospital - ADMIN ONLY
//     resource function put hospitals/activate/[int hospital_id](http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery updateQuery = `UPDATE hospital SET status = 'active' WHERE hospital_id = ${hospital_id}`;
//         sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

//         if result.affectedRowCount > 0 {
//             return { message: "Hospital activated successfully." };
//         } else {
//             return { message: "Hospital not found or already active." };
//         }
//     }

//     // Continue with all other endpoints following the same pattern...
//     // For brevity, I'll show a few more examples:

//     //view hospital users - ADMIN ONLY
//     resource function get hospitalUserData(http:Request req) returns viewHospitalUsers[]|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         stream<viewHospitalUsers, sql:Error?> hospitalUserStream = database:dbClient->query(
//             `SELECT hu.hospital_email, h.hospital_name, h.hospital_type, h.hospital_address, h.contact_number,h.status, d.district_name
//             FROM hospital_user hu, hospital h, district d
//             WHERE hu.hospital_id = h.hospital_id AND h.district_id = d.district_id`,
//             viewHospitalUsers
//         );    

//         viewHospitalUsers[] hospital_users = [];
//         check hospitalUserStream.forEach(function(viewHospitalUsers hospital_user){
//             hospital_users.push(hospital_user);
//         });
//         return hospital_users;
//     }

//     //add hospital users to the system - ADMIN ONLY
//     resource function post hospitalUsers(http:Request req) returns json|http:Response|error {
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         json payload = check req.getJsonPayload();
//         addHospitalUsers newhospitalUsers = check payload.cloneWithType(addHospitalUsers);

//         // Get hospital_id
//         sql:ParameterizedQuery getHospitalIdQuery = 
//             `SELECT hospital_id FROM hospital WHERE hospital_name = ${newhospitalUsers.hospital_name}`;
//         record {|int hospital_id;|}? hospitalRecord = check database:dbClient->queryRow(getHospitalIdQuery);

//         if hospitalRecord is () {
//             return { message: "Invalid hospital name." };
//         }

//         int hospitalId = hospitalRecord.hospital_id;

//         // Hash the password using crypto:generateBcrypt
//         string hashedPassword = check crypto:hashBcrypt(newhospitalUsers.password, 12);

//         sql:ParameterizedQuery insertQuery = `INSERT INTO hospital_user 
//             (hospital_email, hospital_id, password_hash)
//             VALUES (${newhospitalUsers.hospital_email}, ${hospitalId}, ${hashedPassword})`;

//         var result = database:dbClient->execute(insertQuery);

//         if result is error {
//             string errMsg = result.message();
//             if string:indexOf(errMsg, "Duplicate entry") != -1 {
//                 return { message: "A hospital user with this email or hospital ID already exists." };
//             } else {
//                 return { message: "An unexpected error occurred: " + errMsg };
//             }
//         }

//         return { message: "Hospital User added successfully." };
//     }

//     // Add the same admin validation to all other endpoints...
//     // (total donor count, hospital count, etc.)

//     //total donor count - ADMIN ONLY
//     resource function get donorCount(http:Request req) returns json|http:Response|error{
//         // Validate admin token
//         boolean|error isValidAdmin = self.validateAdminToken(req);
//         if isValidAdmin is error || !isValidAdmin {
//             http:Response response = new;
//             response.setJsonPayload({ 
//                 status: "error", 
//                 message: "Access denied: Admin authentication required" 
//             });
//             response.statusCode = 403;
//             return response;
//         }

//         sql:ParameterizedQuery countDonorsQuery = `SELECT count(*) AS cnt FROM donor`;
//         record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonorsQuery);

//         if donorCount is record {| int cnt; |} {
//             return { totalDonors: donorCount.cnt };
//         } else {
//             return { message: "Unable to retrieve donor count." };
//         }
//     }

//     // ... Continue adding admin validation to all other endpoints
// }

// public function startDashboardAdminService() returns error? {
//     io:println("Secured Dashboard Admin service started on port 9092 - Admin access only");
// }







import backend.database;
import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/crypto;
import ballerina/regex as re;
import ballerina/lang.array as arrays;
import ballerina/time;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowCredentials: true,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    }
}

service /dashboard/admin on database:dashboardListener{
    
    // Admin token validation function
    // function validateAdminToken(http:Request req) returns boolean|error {
    //     http:Cookie[]? cookies = req.getCookies();
    //     string? token = ();

    //     // Extract token from cookies
    //     if cookies is http:Cookie[] {
    //         foreach http:Cookie cookie in cookies {
    //             if cookie.name == "auth_token" {
    //                 token = cookie.value;
    //                 break;
    //             }
    //         }
    //     }

    //     if token is () {
    //         io:println("ADMIN ACCESS DENIED: No auth token found in request");
    //         return false;
    //     }

    //     io:println("Found token: ", token);

    //     // Parse JWT token
    //     string[] tokenParts = re:split(token, "\\.");
    //     if tokenParts.length() != 3 {
    //         io:println("ADMIN ACCESS DENIED: Invalid token format - parts count: ", tokenParts.length());
    //         return false;
    //     }

    //     string encodedPayload = tokenParts[1];
    //     io:println("Encoded payload: ", encodedPayload);
        
    //     // Fix: Use the correct base64 decoding method
    //     byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

    //     if payloadBytes is error {
    //         io:println("ADMIN ACCESS DENIED: Invalid token encoding - ", payloadBytes.message());
    //         return false;
    //     }

    //     string|error payloadStr = string:fromBytes(payloadBytes);
    //     if payloadStr is error {
    //         io:println("ADMIN ACCESS DENIED: Invalid token payload encoding - ", payloadStr.message());
    //         return false;
    //     }

    //     io:println("Payload string: ", payloadStr);

    //     json|error payloadJson = payloadStr.fromJsonString();
    //     if payloadJson is error {
    //         io:println("ADMIN ACCESS DENIED: Invalid token payload JSON - ", payloadJson.message());
    //         return false;
    //     }

    //     if !(payloadJson is map<json>) {
    //         io:println("ADMIN ACCESS DENIED: Invalid payload format - not a map");
    //         return false;
    //     }

    //     map<json> payload = <map<json>>payloadJson;

    //     // Check token expiration
    //     json? expJson = payload?.exp;
    //     if expJson is () {
    //         io:println("ADMIN ACCESS DENIED: Missing expiration");
    //         return false;
    //     }
        
    //     if !(expJson is decimal) {
    //         io:println("ADMIN ACCESS DENIED: Invalid expiration format");
    //         return false;
    //     }

    //     decimal exp = <decimal>expJson;
    //     decimal currentTime = <decimal>time:utcNow()[0];
    //     io:println("Token exp: ", exp, ", Current time: ", currentTime);
        
    //     if exp < currentTime {
    //         io:println("ADMIN ACCESS DENIED: Token expired");
    //         return false;
    //     }

    //     // Check issuer
    //     json? issuerJson = payload?.iss;
    //     if issuerJson is () || !(issuerJson is string) {
    //         io:println("ADMIN ACCESS DENIED: Invalid or missing issuer");
    //         return false;
    //     }
        
    //     string issuer = <string>issuerJson;
    //     if issuer != "bloodlink-auth-service" {
    //         io:println("ADMIN ACCESS DENIED: Invalid issuer: ", issuer);
    //         return false;
    //     }

    //     // Check custom claims
    //     json? customClaimsJson = payload?.customClaims;
    //     if customClaimsJson is () {
    //         io:println("ADMIN ACCESS DENIED: Missing custom claims");
    //         return false;
    //     }
        
    //     if !(customClaimsJson is map<json>) {
    //         io:println("ADMIN ACCESS DENIED: Invalid custom claims structure");
    //         return false;
    //     }

    //     map<json> customClaims = <map<json>>customClaimsJson;
    //     json? roleJson = customClaims?.role;
        
    //     if roleJson is () {
    //         io:println("ADMIN ACCESS DENIED: No role found in token");
    //         return false;
    //     }
        
    //     if !(roleJson is string) {
    //         io:println("ADMIN ACCESS DENIED: Role is not a string");
    //         return false;
    //     }
        
    //     string userRole = <string>roleJson;
    //     io:println("Token role found: '", userRole, "'");
        
    //     // STRICT role check - only "admin" allowed
    //     if userRole != "admin" {
    //         io:println("ADMIN ACCESS DENIED: User role '", userRole, "' is not 'admin'");
    //         return false;
    //     }

    //     // Check subject (email)
    //     json? subJson = payload?.sub;
    //     if subJson is () || !(subJson is string) {
    //         io:println("ADMIN ACCESS DENIED: Invalid subject");
    //         return false;
    //     }
        
    //     string email = <string>subJson;
    //     io:println("Admin token validation successful for: ", email);
    //     return true;
    // }

        function validateAdminToken(http:Request req) returns boolean|error {
    http:Cookie[]? cookies = req.getCookies();
    string? token = ();

    // Extract token from cookies
    if cookies is http:Cookie[] {
        foreach http:Cookie cookie in cookies {
            if cookie.name == "auth_token" {
                token = cookie.value;
                break;
            }
        }
    }

    if token is () {
        io:println("ADMIN ACCESS DENIED: No auth token found in request");
        return false;
    }

    io:println("Found token: ", token);

    // Parse JWT token
    string[] tokenParts = re:split(token, "\\.");
    if tokenParts.length() != 3 {
        io:println("ADMIN ACCESS DENIED: Invalid token format - parts count: ", tokenParts.length());
        return false;
    }

    string encodedPayload = tokenParts[1];
    io:println("Encoded payload: ", encodedPayload);
    
    // Fix: Use the correct base64 decoding method
    byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

    if payloadBytes is error {
        io:println("ADMIN ACCESS DENIED: Invalid token encoding - ", payloadBytes.message());
        return false;
    }

    string|error payloadStr = string:fromBytes(payloadBytes);
    if payloadStr is error {
        io:println("ADMIN ACCESS DENIED: Invalid token payload encoding - ", payloadStr.message());
        return false;
    }

    io:println("Payload string: ", payloadStr);

    json|error payloadJson = payloadStr.fromJsonString();
    if payloadJson is error {
        io:println("ADMIN ACCESS DENIED: Invalid token payload JSON - ", payloadJson.message());
        return false;
    }

    if !(payloadJson is map<json>) {
        io:println("ADMIN ACCESS DENIED: Invalid payload format - not a map");
        return false;
    }

    map<json> payload = <map<json>>payloadJson;

    // Check token expiration
    json? expJson = payload?.exp;
    if expJson is () {
        io:println("ADMIN ACCESS DENIED: Missing expiration");
        return false;
    }
    
    if !(expJson is decimal) {
        io:println("ADMIN ACCESS DENIED: Invalid expiration format");
        return false;
    }

    decimal exp = <decimal>expJson;
    decimal currentTime = <decimal>time:utcNow()[0];
    io:println("Token exp: ", exp, ", Current time: ", currentTime);
    
    if exp < currentTime {
        io:println("ADMIN ACCESS DENIED: Token expired");
        return false;
    }

    // Check issuer
    json? issuerJson = payload?.iss;
    if issuerJson is () || !(issuerJson is string) {
        io:println("ADMIN ACCESS DENIED: Invalid or missing issuer");
        return false;
    }
    
    string issuer = <string>issuerJson;
    if issuer != "bloodlink-auth-service" {
        io:println("ADMIN ACCESS DENIED: Invalid issuer: ", issuer);
        return false;
    }

    // Check custom claims
    json? customClaimsJson = payload?.customClaims;
    if customClaimsJson is () {
        io:println("ADMIN ACCESS DENIED: Missing custom claims");
        return false;
    }
    
    if !(customClaimsJson is map<json>) {
        io:println("ADMIN ACCESS DENIED: Invalid custom claims structure");
        return false;
    }

    map<json> customClaims = <map<json>>customClaimsJson;
    json? roleJson = customClaims?.role;
    
    if roleJson is () {
        io:println("ADMIN ACCESS DENIED: No role found in token");
        return false;
    }
    
    if !(roleJson is string) {
        io:println("ADMIN ACCESS DENIED: Role is not a string");
        return false;
    }
    
    string userRole = <string>roleJson;
    io:println("Token role found: '", userRole, "'");
    
    // STRICT role check - only "admin" allowed
    if userRole != "admin" {
        io:println("ADMIN ACCESS DENIED: User role '", userRole, "' is not 'admin'");
        return false;
    }

    // Check subject (email)
    json? subJson = payload?.sub;
    if subJson is () || !(subJson is string) {
        io:println("ADMIN ACCESS DENIED: Invalid subject");
        return false;
    }
    
    string email = <string>subJson;
    io:println("Admin token validation successful for: ", email);
    return true;
}

// Alternative debugging function to test token structure
function debugToken(string token) returns error? {
    io:println("=== DEBUG TOKEN ===");
    string[] parts = re:split(token, "\\.");
    io:println("Token parts count: ", parts.length());
    
    if parts.length() >= 2 {
        string headerPart = parts[0];
        string payloadPart = parts[1];
        
        io:println("Header part: ", headerPart);
        io:println("Payload part: ", payloadPart);
        
        // Decode header
        byte[]|error headerBytes = arrays:fromBase64(headerPart);
        if headerBytes is byte[] {
            string|error headerStr = string:fromBytes(headerBytes);
            if headerStr is string {
                io:println("Decoded header: ", headerStr);
            }
        }
        
        // Decode payload
        byte[]|error payloadBytes = arrays:fromBase64(payloadPart);
        if payloadBytes is byte[] {
            string|error payloadStr = string:fromBytes(payloadBytes);
            if payloadStr is string {
                io:println("Decoded payload: ", payloadStr);
                json|error payloadJson = payloadStr.fromJsonString();
                if payloadJson is json {
                    io:println("Parsed payload JSON: ", payloadJson.toJsonString());
                }
            }
        }
    }
    io:println("=== END DEBUG ===");
}

    // Alternative debugging function to test token structure
    // function debugToken(string token) returns error? {
    //     io:println("=== DEBUG TOKEN ===");
    //     string[] parts = re:split(token, "\\.");
    //     io:println("Token parts count: ", parts.length());
        
    //     if parts.length() >= 2 {
    //         string headerPart = parts[0];
    //         string payloadPart = parts[1];
            
    //         io:println("Header part: ", headerPart);
    //         io:println("Payload part: ", payloadPart);
            
    //         // Decode header
    //         byte[]|error headerBytes = arrays:fromBase64(headerPart);
    //         if headerBytes is byte[] {
    //             string|error headerStr = string:fromBytes(headerBytes);
    //             if headerStr is string {
    //                 io:println("Decoded header: ", headerStr);
    //             }
    //         }
            
    //         // Decode payload
    //         byte[]|error payloadBytes = arrays:fromBase64(payloadPart);
    //         if payloadBytes is byte[] {
    //             string|error payloadStr = string:fromBytes(payloadBytes);
    //             if payloadStr is string {
    //                 io:println("Decoded payload: ", payloadStr);
    //                 json|error payloadJson = payloadStr.fromJsonString();
    //                 if payloadJson is json {
    //                     io:println("Parsed payload JSON: ", payloadJson.toJsonString());
    //                 }
    //             }
    //         }
    //     }
    //     io:println("=== END DEBUG ===");
    // }

    // ===== DONOR MANAGEMENT ENDPOINTS =====

    // View all donors - ADMIN ONLY
    resource function get donors(http:Request req) returns donorDetails[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        // Query all donors (no filter)
        stream<donorDetails, sql:Error?> donorStream = database:dbClient->query(
            `SELECT d.donor_id, d.donor_name, d.blood_group, dis.district_name, d.email, d.phone_number, d.status
            FROM donor d, district dis 
            WHERE d.district_id = dis.district_id`,
            donorDetails
        );

        donorDetails[] donors = [];
        check donorStream.forEach(function(donorDetails donor) {
            donors.push(donor);
        });

        return donors;
    }

    // Deactivate a donor - ADMIN ONLY
    resource function delete donors/[int donor_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'deactive' WHERE donor_id = ${donor_id}`;
        sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

        if result.affectedRowCount > 0 {
            return { message: "Donor status set to deactive successfully." };
        } else {
            return { message: "Donor not found or already deactive." };
        }
    }

    // Activate a donor - ADMIN ONLY
    resource function put donors/activate/[int donor_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery updateQuery = `UPDATE donor SET status = 'active' WHERE donor_id = ${donor_id}`;
        sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

        if result.affectedRowCount > 0 {
            return { message: "Donor activated successfully." };
        } else {
            return { message: "Donor not found or already active." };
        }
    }

    // ===== HOSPITAL MANAGEMENT ENDPOINTS =====

    // Add hospitals to the system - ADMIN ONLY
    resource function post hospitals(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        json payload = check req.getJsonPayload();
        addHospitalData newHospital = check payload.cloneWithType(addHospitalData);

        // Get district_id from district name
        sql:ParameterizedQuery getDistrictIdQuery = 
            `SELECT district_id FROM district WHERE district_name = ${newHospital.district_name}`;

        record {|int district_id;|}? districtRecord = 
            check database:dbClient->queryRow(getDistrictIdQuery);

        if districtRecord is () {
            return { message: "Invalid district name." };
        }

        int districtId = districtRecord.district_id;

        // Insert hospital using district_id
        sql:ParameterizedQuery insertQuery = 
            `INSERT INTO hospital 
                (hospital_name, hospital_type, hospital_address, contact_number, district_id)
             VALUES (${newHospital.hospital_name}, ${newHospital.hospital_type}, 
                     ${newHospital.hospital_address}, ${newHospital.contact_number}, ${districtId})`;

        _ = check database:dbClient->execute(insertQuery);
        return { message: "Hospital added successfully." };
    }

    // Update hospital data - ADMIN ONLY
    resource function put hospitals/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        json payload = check req.getJsonPayload();
        addHospitalData updatedHospital = check payload.cloneWithType(addHospitalData);

        // Get district_id from district name
        sql:ParameterizedQuery getDistrictIdQuery = 
            `SELECT district_id FROM district WHERE district_name = ${updatedHospital.district_name}`;

        record {|int district_id;|}? districtRecord = 
            check database:dbClient->queryRow(getDistrictIdQuery);

        if districtRecord is () {
            return { message: "Invalid district name." };
        }

        int districtId = districtRecord.district_id;

        // Update hospital with district_id
        sql:ParameterizedQuery updateQuery = 
            `UPDATE hospital
             SET hospital_name = ${updatedHospital.hospital_name},
                 hospital_type = ${updatedHospital.hospital_type},
                 hospital_address = ${updatedHospital.hospital_address},
                 contact_number = ${updatedHospital.contact_number},
                 district_id = ${districtId}
             WHERE hospital_id = ${hospital_id}`;

        _ = check database:dbClient->execute(updateQuery);
        return { message: "Hospital updated successfully." };
    }

    // View all hospitals - ADMIN ONLY
    resource function get hospitalData(http:Request req) returns viewHospitalData[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(
            `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.hospital_address,h.status,h.contact_number, d.district_name
            FROM hospital h, district d
            WHERE h.district_id = d.district_id`,
            viewHospitalData
        );

        viewHospitalData[] hospitals = [];
        check hospitalStream.forEach(function(viewHospitalData hospital) {
            hospitals.push(hospital);
        });

        return hospitals;
    }

    // View a selected hospital - ADMIN ONLY
    resource function get hospitalData/[int hospital_id](http:Request req) returns viewHospitalData[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery hospitalQuery = `SELECT h.hospital_id, h.hospital_name, h.hospital_type, h.status, h.hospital_address, h.contact_number, d.district_name
                FROM hospital h, district d
                WHERE h.district_id = d.district_id AND h.hospital_id = ${hospital_id}`;
        
        stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery, viewHospitalData);
        
        viewHospitalData[] hospitals = [];
        check hospitalStream.forEach(function(viewHospitalData hospital) {
            hospitals.push(hospital);
        });
        
        return hospitals;
    }

    // Deactivate hospital - ADMIN ONLY
    resource function delete hospitals/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery deleteQuery = `UPDATE hospital SET status = 'deactive' WHERE hospital_id = ${hospital_id}`;
        sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

        if result.affectedRowCount > 0 {
            return { message: "Hospital deactivated successfully." };
        } else {
            return { message: "Hospital not found or already deactivated." };
        }
    }

    // Activate a hospital - ADMIN ONLY
    resource function put hospitals/activate/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery updateQuery = `UPDATE hospital SET status = 'active' WHERE hospital_id = ${hospital_id}`;
        sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

        if result.affectedRowCount > 0 {
            return { message: "Hospital activated successfully." };
        } else {
            return { message: "Hospital not found or already active." };
        }
    }

    // ===== HOSPITAL USER MANAGEMENT ENDPOINTS =====

    // View hospital users - ADMIN ONLY
    resource function get hospitalUserData(http:Request req) returns viewHospitalUsers[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        stream<viewHospitalUsers, sql:Error?> hospitalUserStream = database:dbClient->query(
            `SELECT hu.hospital_email, h.hospital_name, h.hospital_type, h.hospital_address, h.contact_number,h.status, d.district_name
            FROM hospital_user hu, hospital h, district d
            WHERE hu.hospital_id = h.hospital_id AND h.district_id = d.district_id`,
            viewHospitalUsers
        );    

        viewHospitalUsers[] hospital_users = [];
        check hospitalUserStream.forEach(function(viewHospitalUsers hospital_user){
            hospital_users.push(hospital_user);
        });
        return hospital_users;
    }

    // Hospital ID wise hospital user data - ADMIN ONLY
    resource function get hospitalUserData/[int hospital_id](http:Request req) returns viewHospitalUsers[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        stream<viewHospitalUsers, sql:Error?> hospitalUserStream = 
            database:dbClient->query(
                `SELECT hu.hospital_email, 
                        h.hospital_name, 
                        h.hospital_type, 
                        h.hospital_address, 
                        h.contact_number, 
                        h.status,
                        d.district_name
                 FROM hospital_user hu
                 JOIN hospital h ON hu.hospital_id = h.hospital_id
                 JOIN district d ON h.district_id = d.district_id
                 WHERE h.hospital_id = ${hospital_id}`,
                viewHospitalUsers
            );    

        viewHospitalUsers[] hospital_users = [];
        check hospitalUserStream.forEach(function(viewHospitalUsers hospital_user) {
            hospital_users.push(hospital_user);
        });

        return hospital_users;
    }

    // Add hospital users to the system - ADMIN ONLY
    resource function post hospitalUsers(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        json payload = check req.getJsonPayload();
        addHospitalUsers newhospitalUsers = check payload.cloneWithType(addHospitalUsers);

        // Get hospital_id
        sql:ParameterizedQuery getHospitalIdQuery = 
            `SELECT hospital_id FROM hospital WHERE hospital_name = ${newhospitalUsers.hospital_name}`;
        record {|int hospital_id;|}? hospitalRecord = check database:dbClient->queryRow(getHospitalIdQuery);

        if hospitalRecord is () {
            return { message: "Invalid hospital name." };
        }

        int hospitalId = hospitalRecord.hospital_id;

        // Hash the password using crypto:generateBcrypt
        string hashedPassword = check crypto:hashBcrypt(newhospitalUsers.password, 12);

        sql:ParameterizedQuery insertQuery = `INSERT INTO hospital_user 
            (hospital_email, hospital_id, password_hash)
            VALUES (${newhospitalUsers.hospital_email}, ${hospitalId}, ${hashedPassword})`;

        var result = database:dbClient->execute(insertQuery);

        if result is error {
            string errMsg = result.message();
            if string:indexOf(errMsg, "Duplicate entry") != -1 {
                return { message: "A hospital user with this email or hospital ID already exists." };
            } else {
                return { message: "An unexpected error occurred: " + errMsg };
            }
        }

        return { message: "Hospital User added successfully." };
    }

    // Update hospital user details - ADMIN ONLY
    resource function put hospitalUsers(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        // Extract JSON payload
        json payload = check req.getJsonPayload();

        // Map JSON payload to record type (without password)
        updateHospitalUsers updateUserData = check payload.cloneWithType(updateHospitalUsers);

        // Get hospital_id from hospital_name
        sql:ParameterizedQuery getHospitalIdQuery = 
            `SELECT hospital_id FROM hospital WHERE hospital_name = ${updateUserData.hospital_name}`;

        record {|int hospital_id;|}? hospitalRecord = 
            check database:dbClient->queryRow(getHospitalIdQuery);

        if hospitalRecord is () {
            return { message: "Invalid hospital name." };
        }

        int newHospitalId = hospitalRecord.hospital_id;

        // Update hospital_user table without changing password
        sql:ParameterizedQuery updateQuery = 
            `UPDATE hospital_user 
             SET hospital_email = ${updateUserData.hospital_email}, 
                 hospital_id = ${newHospitalId}
             WHERE hospital_id = ${updateUserData.hospital_id}`;

        var result = database:dbClient->execute(updateQuery);

        if result is error {
            string errMsg = result.message();

            if string:indexOf(errMsg, "Duplicate entry") != -1 {
                return { message: "A hospital user with this hospital email or hospital ID already exists." };
            } else {
                return { message: "An unexpected error occurred: " + errMsg };
            }
        }

        return { message: "Hospital User updated successfully." };
    }

    // Deactivate hospital user - ADMIN ONLY
    resource function delete hospitalUser/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery deleteQuery = `UPDATE hospital_user SET status = 'deactive' WHERE hospital_id = ${hospital_id}`;

        sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

        if result.affectedRowCount > 0 {
            return { message: "Hospital User deactivated successfully." };
        } else {
            return { message: "Hospital User not found or already deactivated." };
        }
    }

    // Activate hospital user - ADMIN ONLY
    resource function put hospitalUser/activate/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery updateQuery = `UPDATE hospital_user SET status = 'active' WHERE hospital_id = ${hospital_id}`;

        sql:ExecutionResult result = check database:dbClient->execute(updateQuery);

        if result.affectedRowCount > 0 {
            return { message: "Hospital user activated successfully." };
        } else {
            return { message: "Hospital user not found or already active." };
        }
    }

    // ===== COUNT AND STATISTICS ENDPOINTS =====

    // Total donor count - ADMIN ONLY
    resource function get donorCount(http:Request req) returns json|http:Response|error{
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countDonorsQuery = `SELECT count(*) AS cnt FROM donor`;
        record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonorsQuery);

        if donorCount is record {| int cnt; |} {
            return { totalDonors: donorCount.cnt };
        } else {
            return { message: "Unable to retrieve donor count." };
        }
    }

    // Total hospital count - ADMIN ONLY
    resource function get hospitalCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countHospitalQuery = `SELECT count(*) AS cnt FROM hospital`;
        record {|int cnt;|} ? hospitalCount = check database:dbClient->queryRow(countHospitalQuery);

        if hospitalCount is record {|int cnt;|}{
            return {totalHospitals: hospitalCount.cnt};
        }else {
            return {message: "Unable to retrieve hospital count."};
        }
    }

    // Total donation count - ADMIN ONLY
    resource function get donationCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donation`;
        record {|int cnt;|} ? donationCount = check database:dbClient->queryRow(countDonationQuery);

        if donationCount is record {|int cnt;|}{
            return {totalDonations: donationCount.cnt};
        }else{
            return {message: "Unable to retrieve donation count."};
        }
    }  

    // Total request count - ADMIN ONLY
    resource function get requestCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countRequestQuery = `SELECT count(*) AS cnt FROM blood_request`;
        record {|int cnt;|} ? requestCount = check database:dbClient->queryRow(countRequestQuery);

        if requestCount is record {|int cnt;|}{
            return {totalRequests : requestCount.cnt};
        }else{
            return {message: "Unable to retrieve request count."};
        }
    } 

    // Total donors in a hospital - ADMIN ONLY
    resource function get donorsCount/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donation WHERE hospital_id= ${hospital_id}`;
        record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

        if donorCount is record {|int cnt;|}{
            return {totalDonors : donorCount.cnt};
        }else{
            return {message: "Unable to retrieve donor count."};
        }
    }

    // Total number of donors in each district - ADMIN ONLY
    resource function get donorCount/[int district_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countDonationQuery = 
            `SELECT d.district_name, COUNT(dr.donor_id) AS cnt
             FROM district d
             LEFT JOIN donor dr ON d.district_id = dr.district_id
             WHERE d.district_id = ${district_id}
             GROUP BY d.district_name`;

        record {|string district_name; int cnt;|}? donorCount = 
            check database:dbClient->queryRow(countDonationQuery);

        if donorCount is record {|string district_name; int cnt;|} {
            return {
                districtName: donorCount.district_name,
                totalDonors: donorCount.cnt
            };
        } else {
            return { message: "Unable to retrieve donor count." };
        }
    }

    // District wise hospital count - ADMIN ONLY
    resource function get hopitalCount/[int district_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countHospitalQuery = 
            `SELECT d.district_name, COUNT(*) AS cnt
             FROM district d, hospital h
             WHERE d.district_id = ${district_id} AND h.district_id = d.district_id
             GROUP BY d.district_name`;

        record {|string district_name; int cnt;|}? hospitalCount = 
            check database:dbClient->queryRow(countHospitalQuery);

        if hospitalCount is record {|string district_name; int cnt;|} {
            return {
                districtName: hospitalCount.district_name,
                totalHospitals: hospitalCount.cnt
            };
        } else {
            return { message: "Unable to retrieve hospital count." };
        }
    }

    // Active donor count - ADMIN ONLY
    resource function get activeDonorCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donor WHERE status = "active"`;
        record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

        if donorCount is record {|int cnt;|}{
            return {totalActiveDonors : donorCount.cnt};
        }else{
            return {message: "Unable to retrieve active donor count."};
        }
    }

    // Deactive donor count - ADMIN ONLY
    resource function get deactiveDonorCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countDonationQuery = `SELECT count(*) AS cnt FROM donor WHERE status = "deactive"`;
        record {|int cnt;|} ? donorCount = check database:dbClient->queryRow(countDonationQuery);

        if donorCount is record {|int cnt;|}{
            return {totalDeactiveDonors : donorCount.cnt};
        }else{
            return {message: "Unable to retrieve deactive donor count."};
        }
    }

    // Active hospital count - ADMIN ONLY
    resource function get activehospitalCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countHospitalQuery = `SELECT count(*) AS cnt FROM hospital WHERE status = "active"`;
        record {|int cnt;|} ? hospitalCount = check database:dbClient->queryRow(countHospitalQuery);

        if hospitalCount is record {|int cnt;|}{
            return {totalActiveHospitals : hospitalCount.cnt};
        }else{
            return {message: "Unable to retrieve active hospital count."};
        }
    }

    // Deactive hospital count - ADMIN ONLY
    resource function get deactivehospitalCount(http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countHospitalQuery = `SELECT count(*) AS cnt FROM hospital WHERE status = "deactive"`;
        record {|int cnt;|} ? hospitalCount = check database:dbClient->queryRow(countHospitalQuery);

        if hospitalCount is record {|int cnt;|}{
            return {totalDeactiveHospitals : hospitalCount.cnt};
        }else{
            return {message: "Unable to retrieve deactive hospital count."};
        }
    }

    // ===== REFERENCE DATA ENDPOINTS =====

    // View all districts - ADMIN ONLY
    resource function get districts(http:Request req) returns District[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery districtQuery = `SELECT district_id, district_name FROM district`;
        
        stream<District, sql:Error?> districtStream = database:dbClient->query(districtQuery, District);
        
        District[] districts = [];
        check districtStream.forEach(function(District district) {
            districts.push(district);
        });
        
        return districts;
    }

    // Get hospital name and id - ADMIN ONLY
    resource function get hospitalName(http:Request req) returns viewHospitalName[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery hospitalQuery = `SELECT hospital_id, hospital_name FROM hospital`;
        
        stream<viewHospitalName, sql:Error?> hospitalStream = database:dbClient->query(hospitalQuery, viewHospitalName);
        
        viewHospitalName[] hospitals = [];
        check hospitalStream.forEach(function(viewHospitalName hospital) {
            hospitals.push(hospital);
        });
        
        return hospitals;
    }

    // ===== BLOOD STOCK ENDPOINTS =====

    // Hospital wise blood quantity - ADMIN ONLY
    resource function get bloodStocks(http:Request req) returns ViewHospitalBloodStock[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        stream<ViewHospitalBloodStock, sql:Error?> bloodStream = database:dbClient->query(
            `SELECT h.hospital_name, d.district_name, b.blood_name, b.quantity, b.status_indicator, b.last_modified
            FROM blood_group b, district d, hospital h 
            WHERE b.hospital_id = h.hospital_id AND h.district_id = d.district_id`,
            ViewHospitalBloodStock
        );

        ViewHospitalBloodStock[] stock = [];
        check bloodStream.forEach(function(ViewHospitalBloodStock bloodStock) {
            stock.push(bloodStock);
        });

        return stock;
    }

    // Total blood quantity - ADMIN ONLY
    resource function get totalBloodStock(http:Request req) returns bloodQuantity[]|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        stream<bloodQuantity, sql:Error?> bloodStream = database:dbClient->query(
            `SELECT blood_name, CAST(SUM(quantity) AS SIGNED) AS quantity
            FROM blood_group 
            GROUP BY blood_name`,
            bloodQuantity
        );

        bloodQuantity[] stock = [];
        check bloodStream.forEach(function(bloodQuantity bloodStock) {
            stock.push(bloodStock);
        });

        return stock; 
    }

    // Total number of requests by hospital - ADMIN ONLY
    resource function get requestCount/[int hospital_id](http:Request req) returns json|http:Response|error {
        // Validate admin token
        boolean|error isValidAdmin = self.validateAdminToken(req);
        if isValidAdmin is error || !isValidAdmin {
            http:Response response = new;
            response.setJsonPayload({ 
                status: "error", 
                message: "Access denied: Admin authentication required" 
            });
            response.statusCode = 403;
            return response;
        }

        sql:ParameterizedQuery countRequestQuery = `SELECT count(*) AS cnt FROM blood_request WHERE hospital_id = ${hospital_id}`;
        record {|int cnt;|} ? requestCount = check database:dbClient->queryRow(countRequestQuery);

        if requestCount is record {|int cnt;|}{
            return {totalRequests : requestCount.cnt};
        }else{
            return {message: "Unable to retrieve request count."};
        }
    }
}

public function startDashboardAdminService() returns error? {
    io:println("Secured Dashboard Admin service started on port 9092 - Admin access only");
    io:println("All endpoints now require valid admin authentication token");
}