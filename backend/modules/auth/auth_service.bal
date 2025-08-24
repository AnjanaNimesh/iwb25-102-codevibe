// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;
// import ballerina/jwt;
// import ballerina/time;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"]
//     }
// }

// service /auth on database:authListener {

//     resource function post checkHospitalUser(http:Request req) returns json|error {
//         // Parse login request
//         json payload = check req.getJsonPayload();
//         LoginRequest loginData = check payload.cloneWithType(LoginRequest);

//         // Query user by email
//         sql:ParameterizedQuery query =
//             `SELECT hospital_email, password_hash
//              FROM hospital_user
//              WHERE hospital_email = ${loginData.hospital_email}`;

//         record {|string hospital_email; string password_hash;|}? cred = check database:dbClient->queryRow(query);

//         // If email not found
//         if cred is () {
//             return { status: "error", message: "Invalid email or password" };
//         }

//         // Verify password
//         boolean|crypto:Error isValid = crypto:verifyBcrypt(loginData.password, cred.password_hash);

//         if isValid is crypto:Error {
//             io:println("Password verification error: ", isValid.message());
//             return { status: "error", message: "Password verification failed" };
//         }

//         if isValid {
//             // Generate JWT token
//             string|error token = generateJWTToken(cred.hospital_email);
            
//             if token is error {
//                 io:println("JWT token generation error: ", token.message());
//                 return { status: "error", message: "Token generation failed" };
//             }
            
//             return { 
//                 status: "success", 
//                 message: "Login successful",
//                 token: token,
//                 hospital_email: cred.hospital_email
//             };
//         } else {
//             return { status: "error", message: "Invalid email or password" };
//         }
//     }
// }

// // Function to generate JWT token using HMAC SHA256 (recommended approach)
// function generateJWTToken(string hospital_email) returns string|error {
//     // Get current time and convert to decimal for expiration
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d; // Token expires in 1 hour
    
//     // JWT configuration with HMAC SHA256
//     jwt:IssuerConfig issuerConfig = {
//         username: hospital_email,
//         issuer: "hospital-auth-service",
//         audience: ["hospital-client"],
//         expTime: expTime,
//         signatureConfig: {
//             algorithm: jwt:HS256,
//             config: "your-secret-key-here-make-it-long-and-secure" // Use a strong secret key (at least 32 characters)
//         }
//     };

//     return jwt:issue(issuerConfig);
// }

// // Alternative function using RSA (for production with keystore)
// function generateJWTTokenRSA(string hospital_email) returns string|error {
//     // Get current time and convert to decimal for expiration
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d; // Token expires in 1 hour
    
//     // JWT configuration with RSA
//     jwt:IssuerConfig issuerConfig = {
//         username: hospital_email,
//         issuer: "hospital-auth-service",
//         audience: ["hospital-client"],
//         expTime: expTime,
//         signatureConfig: {
//             algorithm: jwt:RS256,
//             config: {
//                 keyStore: {
//                     path: "path/to/keystore.p12", // Update with your keystore path
//                     password: "your-keystore-password" // Update with your keystore password
//                 },
//                 keyAlias: "ballerina",
//                 keyPassword: "your-key-password" // Update with your key password
//             }
//         }
//     };

//     return jwt:issue(issuerConfig);
// }

// public function startAuthService() returns error? {
//     io:println("Auth service started on port 9094");
// }

// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;
// import ballerina/jwt;
// import ballerina/time;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"],
//         allowCredentials: true  // Required for cookies with CORS
//     }
// }

// service /auth on database:authListener {

//     resource function post checkHospitalUser(http:Request req) returns http:Response|error {
//         // Parse login request
//         json payload = check req.getJsonPayload();
//         LoginRequest loginData = check payload.cloneWithType(LoginRequest);

//         // Query user by email
//         sql:ParameterizedQuery query =
//             `SELECT hospital_email, password_hash
//              FROM hospital_user
//              WHERE hospital_email = ${loginData.hospital_email}`;

//         record {|string hospital_email; string password_hash;|}? cred = check database:dbClient->queryRow(query);

//         // Create HTTP response
//         http:Response response = new;

//         // If email not found
//         if cred is () {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }

//         // Verify password
//         boolean|crypto:Error isValid = crypto:verifyBcrypt(loginData.password, cred.password_hash);

//         if isValid is crypto:Error {
//             io:println("Password verification error: ", isValid.message());
//             response.setJsonPayload({ status: "error", message: "Password verification failed" });
//             response.statusCode = 500;
//             return response;
//         }

//         if isValid {
//             // Generate JWT token
//             string|error token = generateJWTToken(cred.hospital_email);
            
//             if token is error {
//                 io:println("JWT token generation error: ", token.message());
//                 response.setJsonPayload({ status: "error", message: "Token generation failed" });
//                 response.statusCode = 500;
//                 return response;
//             }
            
//             // Set JWT token as an HTTP-only cookie
//             http:Cookie authCookie = new("hospital_auth_token", token, 
//                 path = "/", 
//                 maxAge = 3600, 
//                 httpOnly = true, 
//                 secure = false
//             );
            
//             response.addCookie(authCookie);
            
//             // Optional: Set a separate cookie for client-side access (non-sensitive data)
//             http:Cookie userCookie = new("hospital_user", cred.hospital_email, 
//                 path = "/", 
//                 maxAge = 3600, 
//                 httpOnly = false, 
//                 secure = false
//             );
            
//             response.addCookie(userCookie);
            
//             // Return success response with token (optional, since it's now in cookie)
//             response.setJsonPayload({ 
//                 status: "success", 
//                 message: "Login successful",
//                 token: token,  // Optional: remove this if you only want cookie-based auth
//                 hospital_email: cred.hospital_email
//             });
//             response.statusCode = 200;
//             return response;
            
//         } else {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }
//     }

//     // Optional: Add a logout endpoint to clear cookies
//     resource function post logout() returns http:Response {
//         http:Response response = new;
        
//         // Clear the auth cookie by setting it to expire immediately
//         http:Cookie clearAuthCookie = new("hospital_auth_token", "", 
//             path = "/", 
//             maxAge = 0, 
//             httpOnly = true
//         );
        
//         http:Cookie clearUserCookie = new("hospital_user", "", 
//             path = "/", 
//             maxAge = 0, 
//             httpOnly = false
//         );
        
//         response.addCookie(clearAuthCookie);
//         response.addCookie(clearUserCookie);
        
//         response.setJsonPayload({ 
//             status: "success", 
//             message: "Logged out successfully" 
//         });
//         response.statusCode = 200;
        
//         return response;
//     }
// }

// // Function to generate JWT token using HMAC SHA256 (recommended approach)
// function generateJWTToken(string hospital_email) returns string|error {
//     // Get current time and convert to decimal for expiration
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d; // Token expires in 1 hour
    
//     // JWT configuration with HMAC SHA256
//     jwt:IssuerConfig issuerConfig = {
//         username: hospital_email,
//         issuer: "hospital-auth-service",
//         audience: ["hospital-client"],
//         expTime: expTime,
//         signatureConfig: {
//             algorithm: jwt:HS256,
//             config: "your-secret-key-here-make-it-long-and-secure" // Use a strong secret key (at least 32 characters)
//         }
//     };

//     return jwt:issue(issuerConfig);
// }

// // Alternative function using RSA (for production with keystore)
// function generateJWTTokenRSA(string hospital_email) returns string|error {
//     // Get current time and convert to decimal for expiration
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d; // Token expires in 1 hour
    
//     // JWT configuration with RSA
//     jwt:IssuerConfig issuerConfig = {
//         username: hospital_email,
//         issuer: "hospital-auth-service",
//         audience: ["hospital-client"],
//         expTime: expTime,
//         signatureConfig: {
//             algorithm: jwt:RS256,
//             config: {
//                 keyStore: {
//                     path: "path/to/keystore.p12", // Update with your keystore path
//                     password: "your-keystore-password" // Update with your keystore password
//                 },
//                 keyAlias: "ballerina",
//                 keyPassword: "your-key-password" // Update with your key password
//             }
//         }
//     };

//     return jwt:issue(issuerConfig);
// }

// public function startAuthService() returns error? {
//     io:println("Auth service started on port 9094");
// }

//new
// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;
// import ballerina/jwt;
// import ballerina/time;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"],
//         allowCredentials: true  // Required for cookies with CORS
//     }
// }

// service /auth on database:authListener {

//     resource function post checkHospitalUser(http:Request req) returns http:Response|error {
//         // Parse login request
//         json payload = check req.getJsonPayload();
//         LoginRequest loginData = check payload.cloneWithType(LoginRequest);

//         // Query user by email
//         sql:ParameterizedQuery query =
//             `SELECT hospital_email, password_hash
//              FROM hospital_user
//              WHERE hospital_email = ${loginData.hospital_email}`;

//         record {|string hospital_email; string password_hash;|}? cred = check database:dbClient->queryRow(query);

//         // Create HTTP response
//         http:Response response = new;

//         // If email not found
//         if cred is () {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }

//         // Verify password
//         boolean|crypto:Error isValid = crypto:verifyBcrypt(loginData.password, cred.password_hash);

//         if isValid is crypto:Error {
//             io:println("Password verification error: ", isValid.message());
//             response.setJsonPayload({ status: "error", message: "Password verification failed" });
//             response.statusCode = 500;
//             return response;
//         }

//         if isValid {
//             // Generate JWT token
//             string|error token = generateJWTToken(cred.hospital_email);
            
//             if token is error {
//                 io:println("JWT token generation error: ", token.message());
//                 response.setJsonPayload({ status: "error", message: "Token generation failed" });
//                 response.statusCode = 500;
//                 return response;
//             }
            
//             // Set JWT token as an HTTP-only cookie
//             http:Cookie authCookie = new("hospital_auth_token", token, 
//                 path = "/", 
//                 maxAge = 3600, 
//                 httpOnly = true, 
//                 secure = false
//             );
            
//             response.addCookie(authCookie);
            
//             // Return success response without token (only in cookie)
//             response.setJsonPayload({ 
//                 status: "success", 
//                 message: "Login successful",
//                 hospital_email: cred.hospital_email
//             });
//             response.statusCode = 200;
//             return response;
            
//         } else {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }
//     }

//     // Optional: Add a logout endpoint to clear cookies
//     resource function post logout() returns http:Response {
//         http:Response response = new;
        
//         // Clear the auth cookie by setting it to expire immediately
//         http:Cookie clearAuthCookie = new("hospital_auth_token", "", 
//             path = "/", 
//             maxAge = 0, 
//             httpOnly = true
//         );
        
//         response.addCookie(clearAuthCookie);
        
//         response.setJsonPayload({ 
//             status: "success", 
//             message: "Logged out successfully" 
//         });
//         response.statusCode = 200;
        
//         return response;
//     }
// }

// // Function to generate JWT token using HMAC SHA256 (recommended approach)
// function generateJWTToken(string hospital_email) returns string|error {
//     // Get current time and convert to decimal for expiration
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d; // Token expires in 1 hour
    
//     // JWT configuration with HMAC SHA256
//     jwt:IssuerConfig issuerConfig = {
//         username: hospital_email,
//         issuer: "hospital-auth-service",
//         audience: ["hospital-client"],
//         expTime: expTime,
//         customClaims: {
//             "role": "hospital_user",
//             "email": hospital_email
//         },
//         signatureConfig: {
//             algorithm: jwt:HS256,
//             config: "your-secret-key-here-make-it-long-and-secure" // Use a strong secret key (at least 32 characters)
//         }
//     };

//     return jwt:issue(issuerConfig);
// }

// // Alternative function using RSA (for production with keystore)
// function generateJWTTokenRSA(string hospital_email) returns string|error {
//     // Get current time and convert to decimal for expiration
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d; // Token expires in 1 hour
    
//     // JWT configuration with RSA
//     jwt:IssuerConfig issuerConfig = {
//         username: hospital_email,
//         issuer: "hospital-auth-service",
//         audience: ["hospital-client"],
//         expTime: expTime,
//         customClaims: {
//             "role": "hospital_user",
//             "email": hospital_email
//         },
//         signatureConfig: {
//             algorithm: jwt:RS256,
//             config: {
//                 keyStore: {
//                     path: "path/to/keystore.p12", // Update with your keystore path
//                     password: "your-keystore-password" // Update with your keystore password
//                 },
//                 keyAlias: "ballerina",
//                 keyPassword: "your-key-password" // Update with your key password
//             }
//         }
//     };

//     return jwt:issue(issuerConfig);
// }

// public function startAuthService() returns error? {
//     io:println("Auth service started on port 9094");
// }


// import backend.database;
// import ballerina/http;
// import ballerina/io;
// import ballerina/sql;
// import ballerina/crypto;
// import ballerina/time;
// import ballerina/regex as re;
// import ballerina/lang.array as arrays;

// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173", "*"],
//         allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"],
//         allowCredentials: true
//     }
// }

// service /auth on database:authListener {

//     // Universal login endpoint for all user types
//     resource function post login(http:Request req) returns http:Response|error {
//         json payload = check req.getJsonPayload();
//         UniversalLoginRequest loginData = check payload.cloneWithType(UniversalLoginRequest);

//         AuthResult|error authResult = authenticateUser(loginData.email, loginData.password);
//         http:Response response = new;

//         if authResult is error {
//             io:println("Authentication error: ", authResult.message());
//             response.setJsonPayload({ status: "error", message: "Authentication failed" });
//             response.statusCode = 500;
//             return response;
//         }

//         if authResult.isAuthenticated {
//             string|error token = generateJWTToken(authResult.email, authResult.role, authResult.userId);

//             if token is error {
//                 io:println("JWT token generation error: ", token.message());
//                 response.setJsonPayload({ status: "error", message: "Token generation failed" });
//                 response.statusCode = 500;
//                 return response;
//             }

//             http:Cookie authCookie = new("auth_token", token,
//                 path = "/", maxAge = 3600, httpOnly = true, secure = false);
//             response.addCookie(authCookie);

//             response.setJsonPayload({
//                 status: "success",
//                 message: "Login successful",
//                 user: {
//                     email: authResult.email,
//                     role: authResult.role,
//                     userId: authResult.userId,
//                     name: authResult.name
//                 }
//             });
//             response.statusCode = 200;
//             return response;

//         } else {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }
//     }

//     // Legacy endpoint for hospital users only
//     resource function post checkHospitalUser(http:Request req) returns http:Response|error {
//         json payload = check req.getJsonPayload();
//         LoginRequest loginData = check payload.cloneWithType(LoginRequest);

//         sql:ParameterizedQuery query =
//             `SELECT hospital_email, password_hash
//              FROM hospital_user
//              WHERE hospital_email = ${loginData.hospital_email}`;

//         record {|string hospital_email; string password_hash;|}? cred =
//             check database:dbClient->queryRow(query);

//         http:Response response = new;

//         if cred is () {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }

//         boolean|crypto:Error isValid = crypto:verifyBcrypt(loginData.password, cred.password_hash);

//         if isValid is crypto:Error {
//             io:println("Password verification error: ", isValid.message());
//             response.setJsonPayload({ status: "error", message: "Password verification failed" });
//             response.statusCode = 500;
//             return response;
//         }

//         if isValid {
//             string|error token = generateJWTToken(cred.hospital_email, "hospital_user", cred.hospital_email);

//             if token is error {
//                 io:println("JWT token generation error: ", token.message());
//                 response.setJsonPayload({ status: "error", message: "Token generation failed" });
//                 response.statusCode = 500;
//                 return response;
//             }

//             http:Cookie authCookie = new("hospital_auth_token", token,
//                 path = "/", maxAge = 3600, httpOnly = true, secure = false);
//             response.addCookie(authCookie);

//             response.setJsonPayload({
//                 status: "success",
//                 message: "Login successful",
//                 hospital_email: cred.hospital_email
//             });
//             response.statusCode = 200;
//             return response;

//         } else {
//             response.setJsonPayload({ status: "error", message: "Invalid email or password" });
//             response.statusCode = 401;
//             return response;
//         }
//     }

//     // Token verification endpoint
//     resource function get verify(http:Request req) returns http:Response {
//         http:Response response = new;

//         http:Cookie[]? cookies = req.getCookies();
//         string? token = ();

//         if cookies is http:Cookie[] {
//             foreach http:Cookie cookie in cookies {
//                 if cookie.name == "auth_token" {
//                     token = cookie.value;
//                     break;
//                 }
//             }
//         }

//         if token is () {
//             response.setJsonPayload({ status: "error", message: "No token found" });
//             response.statusCode = 401;
//             return response;
//         }

//         string[] tokenParts = re:split(token, "\\.");

//         if tokenParts.length() != 3 {
//             response.setJsonPayload({ status: "error", message: "Invalid token format" });
//             response.statusCode = 401;
//             return response;
//         }

//         string encodedPayload = tokenParts[1];
//         byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

//         if payloadBytes is error {
//             response.setJsonPayload({ status: "error", message: "Invalid token encoding" });
//             response.statusCode = 401;
//             return response;
//         }

//         string|error payloadStr = string:fromBytes(payloadBytes);

//         if payloadStr is error {
//             response.setJsonPayload({ status: "error", message: "Invalid token payload encoding" });
//             response.statusCode = 401;
//             return response;
//         }

//         json|error payloadJson = payloadStr.fromJsonString();

//         if (payloadJson is error) {
//             response.setJsonPayload({ status: "error", message: "Invalid token payload JSON" });
//             response.statusCode = 401;
//             return response;
//         }

//         if (payloadJson is map<json>) {
//             json? issuerJson = payloadJson?.iss;
//             json? expJson    = payloadJson?.exp;
//             json? subJson    = payloadJson?.sub;

//             if issuerJson is () || expJson is () || subJson is () {
//                 response.setJsonPayload({ status: "error", message: "Invalid token payload structure" });
//                 response.statusCode = 401;
//                 return response;
//             }

//             if !(issuerJson is string) || !(expJson is decimal) || !(subJson is string) {
//                 response.setJsonPayload({ status: "error", message: "Invalid token payload structure" });
//                 response.statusCode = 401;
//                 return response;
//             }

//             string issuer = <string>issuerJson;
//             decimal exp   = <decimal>expJson;
//             string sub    = <string>subJson;

//             if issuer != "bloodlink-auth-service" {
//                 response.setJsonPayload({ status: "error", message: "Invalid issuer" });
//                 response.statusCode = 401;
//                 return response;
//             }

//             decimal currentTime = <decimal>time:utcNow()[0];
//             if exp < currentTime {
//                 response.setJsonPayload({ status: "error", message: "Token expired" });
//                 response.statusCode = 401;
//                 return response;
//             }

//             json? customClaimsJson = payloadJson?.customClaims;

//             if customClaimsJson is () || !(customClaimsJson is map<json>) {
//                 response.setJsonPayload({ status: "error", message: "Invalid custom claims structure" });
//                 response.statusCode = 401;
//                 return response;
//             }

//             map<json> customClaims = <map<json>>customClaimsJson;
//             json roleJson = customClaims["role"];
//             json userIdJson = customClaims["userId"];

//             string role = roleJson is string ? <string>roleJson : "";
//             string userId = userIdJson is string ? <string>userIdJson : "";

//             response.setJsonPayload({
//                 status: "success",
//                 message: "Token valid",
//                 user: {
//                     email: sub,
//                     role: role,
//                     userId: userId,
//                     exp: exp
//                 }
//             });
//             response.statusCode = 200;
//             return response;
//         }

//         response.setJsonPayload({ status: "error", message: "Invalid payload format" });
//         response.statusCode = 401;
//         return response;
//     }

//     // Universal logout endpoint
//     resource function post logout() returns http:Response {
//         http:Response response = new;

//         http:Cookie clearAuthCookie = new("auth_token", "",
//             path = "/", maxAge = 0, httpOnly = true);
//         http:Cookie clearHospitalAuthCookie = new("hospital_auth_token", "",
//             path = "/", maxAge = 0, httpOnly = true);

//         response.addCookie(clearAuthCookie);
//         response.addCookie(clearHospitalAuthCookie);

//         response.setJsonPayload({
//             status: "success",
//             message: "Logged out successfully"
//         });
//         response.statusCode = 200;

//         return response;
//     }
// }

// // Universal authentication function
// function authenticateUser(string email, string password) returns AuthResult|error {
//     AuthResult|error donorAuth = authenticateDonor(email, password);
//     if donorAuth is AuthResult && donorAuth.isAuthenticated {
//         return donorAuth;
//     }

//     AuthResult|error adminAuth = authenticateAdmin(email, password);
//     if adminAuth is AuthResult && adminAuth.isAuthenticated {
//         return adminAuth;
//     }

//     AuthResult|error hospitalAuth = authenticateHospitalUser(email, password);
//     if hospitalAuth is AuthResult && hospitalAuth.isAuthenticated {
//         return hospitalAuth;
//     }

//     return {
//         isAuthenticated: false,
//         email: "",
//         role: "",
//         userId: "",
//         name: ""
//     };
// }

// // Donor authentication
// function authenticateDonor(string email, string password) returns AuthResult|error {
//     sql:ParameterizedQuery query =
//         `SELECT donor_id, donor_name, email, password_hash, status
//          FROM donor
//          WHERE email = ${email} AND status = 'active'`;

//     record {|int donor_id; string donor_name; string email; string password_hash; string status;|}? donor =
//         check database:dbClient->queryRow(query);

//     if donor is () {
//         return {
//             isAuthenticated: false,
//             email: "",
//             role: "",
//             userId: "",
//             name: ""
//         };
//     }

//     boolean|crypto:Error isValid = crypto:verifyBcrypt(password, donor.password_hash);

//     if isValid is crypto:Error {
//         return error("Password verification failed for donor");
//     }

//     if isValid {
//         return {
//             isAuthenticated: true,
//             email: donor.email,
//             role: "donor",
//             userId: donor.donor_id.toString(),
//             name: donor.donor_name
//         };
//     }

//     return {
//         isAuthenticated: false,
//         email: "",
//         role: "",
//         userId: "",
//         name: ""
//     };
// }

// // Admin authentication
// function authenticateAdmin(string email, string password) returns AuthResult|error {
//     sql:ParameterizedQuery query =
//         `SELECT admin_email, password_hash
//          FROM admin
//          WHERE admin_email = ${email}`;

//     record {|string admin_email; string password_hash;|}? admin =
//         check database:dbClient->queryRow(query);

//     if admin is () {
//         return {
//             isAuthenticated: false,
//             email: "",
//             role: "",
//             userId: "",
//             name: ""
//         };
//     }

//     boolean|crypto:Error isValid = crypto:verifyBcrypt(password, admin.password_hash);

//     if isValid is crypto:Error {
//         return error("Password verification failed for admin");
//     }

//     if isValid {
//         return {
//             isAuthenticated: true,
//             email: admin.admin_email,
//             role: "admin",
//             userId: admin.admin_email,
//             name: "Administrator"
//         };
//     }

//     return {
//         isAuthenticated: false,
//         email: "",
//         role: "",
//         userId: "",
//         name: ""
//     };
// }

// // Hospital user authentication
// function authenticateHospitalUser(string email, string password) returns AuthResult|error {
//     sql:ParameterizedQuery query =
//         `SELECT hu.hospital_email, hu.password_hash, hu.hospital_id, h.hospital_name, hu.status
//          FROM hospital_user hu
//          JOIN hospital h ON hu.hospital_id = h.hospital_id
//          WHERE hu.hospital_email = ${email} AND hu.status = 'active'`;

//     record {|string hospital_email; string password_hash; int hospital_id; string hospital_name; string status;|}? hospitalUser =
//         check database:dbClient->queryRow(query);

//     if hospitalUser is () {
//         return {
//             isAuthenticated: false,
//             email: "",
//             role: "",
//             userId: "",
//             name: ""
//         };
//     }

//     boolean|crypto:Error isValid = crypto:verifyBcrypt(password, hospitalUser.password_hash);

//     if isValid is crypto:Error {
//         return error("Password verification failed for hospital user");
//     }

//     if isValid {
//         return {
//             isAuthenticated: true,
//             email: hospitalUser.hospital_email,
//             role: "hospital_user",
//             userId: hospitalUser.hospital_id.toString(),
//             name: hospitalUser.hospital_name
//         };
//     }

//     return {
//         isAuthenticated: false,
//         email: "",
//         role: "",
//         userId: "",
//         name: ""
//     };
// }

// // JWT token generation (simplified for dev only)
// function generateJWTToken(string email, string role, string userId) returns string|error {
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d;

//     json header = {
//         "alg": "none",
//         "typ": "JWT"
//     };

//     json payload = {
//         "iss": "bloodlink-auth-service",
//         "aud": ["bloodlink-client"],
//         "sub": email,
//         "exp": expTime,
//         "iat": currentTime,
//         "customClaims": {
//             "role": role,
//             "email": email,
//             "userId": userId
//         }
//     };

//     string headerStr = header.toJsonString();
//     string payloadStr = payload.toJsonString();

//     byte[] headerBytes = headerStr.toBytes();
//     byte[] payloadBytes = payloadStr.toBytes();

//     string encodedHeader = headerBytes.toBase64();
//     string encodedPayload = payloadBytes.toBase64();

//     return encodedHeader + "." + encodedPayload + ".";
// }

// // Legacy JWT generation
// function generateJWTTokenLegacy(string hospital_email) returns string|error {
//     return generateJWTToken(hospital_email, "hospital_user", hospital_email);
// }

// public function startAuthService() returns error? {
//     io:println("Multi-role auth service started on port 9094");
// }





import backend.database;
import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/crypto;
import ballerina/time;
import ballerina/regex as re;
import ballerina/lang.array as arrays;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173", "*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowCredentials: true
    }
}

service /auth on database:authListener {

    // Universal login endpoint for all user types
    resource function post login(http:Request req) returns http:Response|error {
        json payload = check req.getJsonPayload();
        UniversalLoginRequest loginData = check payload.cloneWithType(UniversalLoginRequest);

        io:println("=== LOGIN REQUEST ===");
        io:println("Email: ", loginData.email);
        io:println("Password length: ", loginData.password.length());

        AuthResult|error authResult = authenticateUser(loginData.email, loginData.password);
        http:Response response = new;

        if authResult is error {
            io:println("Authentication error: ", authResult.message());
            response.setJsonPayload({ status: "error", message: "Authentication failed" });
            response.statusCode = 500;
            return response;
        }

        if authResult.isAuthenticated {
            io:println("Authentication successful for: ", authResult.email, " as ", authResult.role);
            
            string|error token = generateJWTToken(authResult.email, authResult.role, authResult.userId);

            if token is error {
                io:println("JWT token generation error: ", token.message());
                response.setJsonPayload({ status: "error", message: "Token generation failed" });
                response.statusCode = 500;
                return response;
            }

            http:Cookie authCookie = new("auth_token", token,
                path = "/", maxAge = 3600, httpOnly = true, secure = false);
            response.addCookie(authCookie);

            response.setJsonPayload({
                status: "success",
                message: "Login successful",
                user: {
                    email: authResult.email,
                    role: authResult.role,
                    userId: authResult.userId,
                    name: authResult.name
                }
            });
            response.statusCode = 200;
            return response;

        } else {
            io:println("Authentication failed - Invalid credentials");
            response.setJsonPayload({ status: "error", message: "Invalid email or password" });
            response.statusCode = 401;
            return response;
        }
    }
   
    // Legacy endpoint for hospital users only
    resource function post checkHospitalUser(http:Request req) returns http:Response|error {
        json payload = check req.getJsonPayload();
        LoginRequest loginData = check payload.cloneWithType(LoginRequest);

        io:println("=== LEGACY HOSPITAL LOGIN ===");
        io:println("Hospital Email: ", loginData.hospital_email);

        sql:ParameterizedQuery query =
            `SELECT hospital_email, password_hash
             FROM hospital_user
             WHERE hospital_email = ${loginData.hospital_email}`;

        record {|string hospital_email; string password_hash;|}? cred =
            check database:dbClient->queryRow(query);

        http:Response response = new;

        if cred is () {
            io:println("No hospital user found with email: ", loginData.hospital_email);
            response.setJsonPayload({ status: "error", message: "Invalid email or password" });
            response.statusCode = 401;
            return response;
        }

        boolean|crypto:Error isValid = crypto:verifyBcrypt(loginData.password, cred.password_hash);

        if isValid is crypto:Error {
            io:println("Password verification error: ", isValid.message());
            response.setJsonPayload({ status: "error", message: "Password verification failed" });
            response.statusCode = 500;
            return response;
        }

        if isValid {
            io:println("Legacy hospital authentication successful");
            string|error token = generateJWTToken(cred.hospital_email, "hospital_user", cred.hospital_email);

            if token is error {
                io:println("JWT token generation error: ", token.message());
                response.setJsonPayload({ status: "error", message: "Token generation failed" });
                response.statusCode = 500;
                return response;
            }

            http:Cookie authCookie = new("hospital_auth_token", token,
                path = "/", maxAge = 3600, httpOnly = true, secure = false);
            response.addCookie(authCookie);

            response.setJsonPayload({
                status: "success",
                message: "Login successful",
                hospital_email: cred.hospital_email
            });
            response.statusCode = 200;
            return response;

        } else {
            io:println("Invalid password for hospital user");
            response.setJsonPayload({ status: "error", message: "Invalid email or password" });
            response.statusCode = 401;
            return response;
        }
    }

    // Token verification endpoint
    resource function get verify(http:Request req) returns http:Response {
        http:Response response = new;

        http:Cookie[]? cookies = req.getCookies();
        string? token = ();

        if cookies is http:Cookie[] {
            foreach http:Cookie cookie in cookies {
                if cookie.name == "auth_token" {
                    token = cookie.value;
                    break;
                }
            }
        }

        if token is () {
            response.setJsonPayload({ status: "error", message: "No token found" });
            response.statusCode = 401;
            return response;
        }

        string[] tokenParts = re:split(token, "\\.");

        if tokenParts.length() != 3 {
            response.setJsonPayload({ status: "error", message: "Invalid token format" });
            response.statusCode = 401;
            return response;
        }

        string encodedPayload = tokenParts[1];
        byte[]|error payloadBytes = arrays:fromBase64(encodedPayload);

        if payloadBytes is error {
            response.setJsonPayload({ status: "error", message: "Invalid token encoding" });
            response.statusCode = 401;
            return response;
        }

        string|error payloadStr = string:fromBytes(payloadBytes);

        if payloadStr is error {
            response.setJsonPayload({ status: "error", message: "Invalid token payload encoding" });
            response.statusCode = 401;
            return response;
        }

        json|error payloadJson = payloadStr.fromJsonString();

        if (payloadJson is error) {
            response.setJsonPayload({ status: "error", message: "Invalid token payload JSON" });
            response.statusCode = 401;
            return response;
        }

        if (payloadJson is map<json>) {
            json? issuerJson = payloadJson?.iss;
            json? expJson    = payloadJson?.exp;
            json? subJson    = payloadJson?.sub;

            if issuerJson is () || expJson is () || subJson is () {
                response.setJsonPayload({ status: "error", message: "Invalid token payload structure" });
                response.statusCode = 401;
                return response;
            }

            if !(issuerJson is string) || !(expJson is decimal) || !(subJson is string) {
                response.setJsonPayload({ status: "error", message: "Invalid token payload structure" });
                response.statusCode = 401;
                return response;
            }

            string issuer = <string>issuerJson;
            decimal exp   = <decimal>expJson;
            string sub    = <string>subJson;

            if issuer != "bloodlink-auth-service" {
                response.setJsonPayload({ status: "error", message: "Invalid issuer" });
                response.statusCode = 401;
                return response;
            }

            decimal currentTime = <decimal>time:utcNow()[0];
            if exp < currentTime {
                response.setJsonPayload({ status: "error", message: "Token expired" });
                response.statusCode = 401;
                return response;
            }

            json? customClaimsJson = payloadJson?.customClaims;

            if customClaimsJson is () || !(customClaimsJson is map<json>) {
                response.setJsonPayload({ status: "error", message: "Invalid custom claims structure" });
                response.statusCode = 401;
                return response;
            }

            map<json> customClaims = <map<json>>customClaimsJson;
            json roleJson = customClaims["role"];
            json userIdJson = customClaims["userId"];

            string role = roleJson is string ? <string>roleJson : "";
            string userId = userIdJson is string ? <string>userIdJson : "";

            response.setJsonPayload({
                status: "success",
                message: "Token valid",
                user: {
                    email: sub,
                    role: role,
                    userId: userId,
                    exp: exp
                }
            });
            response.statusCode = 200;
            return response;
        }

        response.setJsonPayload({ status: "error", message: "Invalid payload format" });
        response.statusCode = 401;
        return response;
    }

    // Universal logout endpoint
    // resource function post logout() returns http:Response {
    //     http:Response response = new;

    //     http:Cookie clearAuthCookie = new("auth_token", "",
    //         path = "/", maxAge = 0, httpOnly = true);
    //     http:Cookie clearHospitalAuthCookie = new("hospital_auth_token", "",
    //         path = "/", maxAge = 0, httpOnly = true);

    //     response.addCookie(clearAuthCookie);
    //     response.addCookie(clearHospitalAuthCookie);

    //     response.setJsonPayload({
    //         status: "success",
    //         message: "Logged out successfully"
    //     });
    //     response.statusCode = 200;

    //     return response;
    // }

//     resource function post logout() returns http:Response {
//     http:Response response = new;

//     // Clear auth_token cookie - match all original attributes
//     http:Cookie clearAuthCookie = new("auth_token", "",
//         path = "/", 
//         httpOnly = true,
//         expires = "Thu, 01 Jan 1970 00:00:00 GMT"  // Use expires instead of maxAge
//     );
    
//     // Clear hospital_auth_token cookie  
//     http:Cookie clearHospitalAuthCookie = new("hospital_auth_token", "",
//         path = "/", 
//         httpOnly = true,
//         expires = "Thu, 01 Jan 1970 00:00:00 GMT"
//     );

//     response.addCookie(clearAuthCookie);
//     response.addCookie(clearHospitalAuthCookie);

//     response.setJsonPayload({
//         status: "success",
//         message: "Logged out successfully"
//     });
//     response.statusCode = 200;

//     return response;
// }

resource function post logout() returns http:Response {
    http:Response response = new;
    // Clear the JWT cookie with maxAge = 0
    http:Cookie expiredCookie = new("auth_token", "expired",
        path = "/",
        maxAge = 0,
        httpOnly = true,
        secure = false
    );
    response.addCookie(expiredCookie);
    response.setJsonPayload({
        status: "success",
        message: "Logged out successfully"
    });
    response.statusCode = 200;
    return response;
}
}

// Enhanced universal authentication with detailed logging
function authenticateUser(string email, string password) returns AuthResult|error {
    io:println("=== Universal Authentication Started for: ", email, " ===");
    
    io:println("Step 1: Trying donor authentication...");
    AuthResult|error donorAuth = authenticateDonor(email, password);
    if donorAuth is AuthResult && donorAuth.isAuthenticated {
        io:println("✓ Donor authentication successful");
        return donorAuth;
    } else if donorAuth is error {
        io:println("✗ Donor authentication error: ", donorAuth.message());
    } else {
        io:println("✗ Donor authentication failed");
    }

    io:println("Step 2: Trying admin authentication...");
    AuthResult|error adminAuth = authenticateAdmin(email, password);
    if adminAuth is AuthResult && adminAuth.isAuthenticated {
        io:println("✓ Admin authentication successful");
        return adminAuth;
    } else if adminAuth is error {
        io:println("✗ Admin authentication error: ", adminAuth.message());
    } else {
        io:println("✗ Admin authentication failed");
    }

    io:println("Step 3: Trying hospital user authentication...");
    AuthResult|error hospitalAuth = authenticateHospitalUser(email, password);
    if hospitalAuth is AuthResult && hospitalAuth.isAuthenticated {
        io:println("✓ Hospital user authentication successful");
        return hospitalAuth;
    } else if hospitalAuth is error {
        io:println("✗ Hospital user authentication error: ", hospitalAuth.message());
    } else {
        io:println("✗ Hospital user authentication failed");
    }

    io:println("=== All authentication methods failed ===");
    return {
        isAuthenticated: false,
        email: "",
        role: "",
        userId: "",
        name: ""
    };
}

// Enhanced donor authentication with debugging
function authenticateDonor(string email, string password) returns AuthResult|error {
    io:println("Attempting donor authentication for: ", email);
    
    sql:ParameterizedQuery query =
        `SELECT donor_id, donor_name, email, password_hash, status
         FROM donor
         WHERE email = ${email}`;  // Remove status filter temporarily for debugging

    record {|int donor_id; string donor_name; string email; string password_hash; string status;|}? donor =
        check database:dbClient->queryRow(query);

    if donor is () {
        io:println("No donor found with email: ", email);
        return {
            isAuthenticated: false,
            email: "",
            role: "",
            userId: "",
            name: ""
        };
    }

    io:println("Donor found: ", donor.email, " with status: ", donor.status);
    
    // Check status after finding the donor
    if donor.status != "active" {
        io:println("Donor status is not active: ", donor.status);
        return {
            isAuthenticated: false,
            email: "",
            role: "",
            userId: "",
            name: ""
        };
    }

    io:println("Verifying password for donor...");
    
    boolean|crypto:Error isValid = crypto:verifyBcrypt(password, donor.password_hash);

    if isValid is crypto:Error {
        io:println("Password verification error for donor: ", isValid.message());
        return error("Password verification failed for donor");
    }

    if isValid {
        io:println("Donor authentication successful");
        return {
            isAuthenticated: true,
            email: donor.email,
            role: "donor",
            userId: donor.donor_id.toString(),
            name: donor.donor_name
        };
    } else {
        io:println("Invalid password for donor: ", email);
    }

    return {
        isAuthenticated: false,
        email: "",
        role: "",
        userId: "",
        name: ""
    };
}

// Enhanced admin authentication with debugging
function authenticateAdmin(string email, string password) returns AuthResult|error {
    io:println("Attempting admin authentication for: ", email);
    
    sql:ParameterizedQuery query =
        `SELECT admin_email, password_hash, status
         FROM admin
         WHERE admin_email = ${email}`;

    record {|string admin_email; string password_hash; string status;|}? admin =
        check database:dbClient->queryRow(query);

    if admin is () {
        io:println("No admin found with email: ", email);
        return {
            isAuthenticated: false,
            email: "",
            role: "",
            userId: "",
            name: ""
        };
    }

    io:println("Admin found: ", admin.admin_email);

    // Check status after finding the admin
    if admin.status != "active" {
        io:println("Admin status is not active: ", admin.status);
        return {
            isAuthenticated: false,
            email: "",
            role: "",
            userId: "",
            name: ""
        };
    }

    io:println("Verifying password...");
    
    boolean|crypto:Error isValid = crypto:verifyBcrypt(password, admin.password_hash);

    if isValid is crypto:Error {
        io:println("Password verification error for admin: ", isValid.message());
        return error("Password verification failed for admin");
    }

    if isValid {
        io:println("Admin authentication successful");
        return {
            isAuthenticated: true,
            email: admin.admin_email,
            role: "admin",
            userId: admin.admin_email,
            name: "Administrator"
        };
    } else {
        io:println("Invalid password for admin: ", email);
    }

    return {
        isAuthenticated: false,
        email: "",
        role: "",
        userId: "",
        name: ""
    };
}
// Enhanced hospital user authentication with debugging
function authenticateHospitalUser(string email, string password) returns AuthResult|error {
    io:println("Attempting hospital user authentication for: ", email);
    
    sql:ParameterizedQuery query =
        `SELECT hu.hospital_email, hu.password_hash, hu.hospital_id, h.hospital_name, hu.status
         FROM hospital_user hu
         JOIN hospital h ON hu.hospital_id = h.hospital_id
         WHERE hu.hospital_email = ${email}`;  // Remove status filter temporarily for debugging

    record {|string hospital_email; string password_hash; int hospital_id; string hospital_name; string status;|}? hospitalUser =
        check database:dbClient->queryRow(query);

    if hospitalUser is () {
        io:println("No hospital user found with email: ", email);
        return {
            isAuthenticated: false,
            email: "",
            role: "",
            userId: "",
            name: ""
        };
    }

    io:println("Hospital user found: ", hospitalUser.hospital_email, " with status: ", hospitalUser.status);
    
    // Check status after finding the hospital user
    if hospitalUser.status != "active" {
        io:println("Hospital user status is not active: ", hospitalUser.status);
        return {
            isAuthenticated: false,
            email: "",
            role: "",
            userId: "",
            name: ""
        };
    }

    io:println("Verifying password for hospital user...");
    
    boolean|crypto:Error isValid = crypto:verifyBcrypt(password, hospitalUser.password_hash);

    if isValid is crypto:Error {
        io:println("Password verification error for hospital user: ", isValid.message());
        return error("Password verification failed for hospital user");
    }

    if isValid {
        io:println("Hospital user authentication successful");
        return {
            isAuthenticated: true,
            email: hospitalUser.hospital_email,
            role: "hospital_user",
            userId: hospitalUser.hospital_id.toString(),
            name: hospitalUser.hospital_name
        };
    } else {
        io:println("Invalid password for hospital user: ", email);
    }

    return {
        isAuthenticated: false,
        email: "",
        role: "",
        userId: "",
        name: ""
    };
}

// JWT token generation (simplified for dev only)
// function generateJWTToken(string email, string role, string userId) returns string|error {
//     decimal currentTime = <decimal>time:utcNow()[0];
//     decimal expTime = currentTime + 3600.0d;

//     json header = {
//         "alg": "none",
//         "typ": "JWT"
//     };

//     json payload = {
//         "iss": "bloodlink-auth-service",
//         "aud": ["bloodlink-client"],
//         "sub": email,
//         "exp": expTime,
//         "iat": currentTime,
//         "customClaims": {
//             "role": role,
//             "email": email,
//             "userId": userId
//         }
//     };

//     string headerStr = header.toJsonString();
//     string payloadStr = payload.toJsonString();

//     byte[] headerBytes = headerStr.toBytes();
//     byte[] payloadBytes = payloadStr.toBytes();

//     string encodedHeader = headerBytes.toBase64();
//     string encodedPayload = payloadBytes.toBase64();

//     return encodedHeader + "." + encodedPayload + ".";
// }

// Fixed JWT token generation function
function generateJWTToken(string email, string role, string userId) returns string|error {
    decimal currentTime = <decimal>time:utcNow()[0];
    decimal expTime = currentTime + 3600.0d;

    json header = {
        "alg": "none",
        "typ": "JWT"
    };

    json payload = {
        "iss": "bloodlink-auth-service",
        "aud": ["bloodlink-client"],
        "sub": email,
        "exp": expTime,
        "iat": currentTime,
        "customClaims": {
            "role": role,
            "email": email,
            "userId": userId
        }
    };

    string headerStr = header.toJsonString();
    string payloadStr = payload.toJsonString();

    byte[] headerBytes = headerStr.toBytes();
    byte[] payloadBytes = payloadStr.toBytes();

    // Fix: Ensure proper base64 encoding without padding issues
    string encodedHeader = arrays:toBase64(headerBytes);
    string encodedPayload = arrays:toBase64(payloadBytes);
    
    // Fix: Add proper signature part (empty for 'none' algorithm)
    return encodedHeader + "." + encodedPayload + ".signature";
}

// Legacy JWT generation
function generateJWTTokenLegacy(string hospital_email) returns string|error {
    return generateJWTToken(hospital_email, "hospital_user", hospital_email);
}

public function startAuthService() returns error? {
    io:println("Multi-role auth service started on port 9093");
}