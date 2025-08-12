import backend.database;
import ballerina/http;
import ballerina/io;
import ballerina/sql;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173", "*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    }
}

service /dashboard/admin on database:dashboardListener{
    //view all donors
     resource function get donors(http:Request req) returns donorDetails[]|error {
        // Query all donors (no filter)
        stream<donorDetails, sql:Error?> donorStream = database:dbClient->query(
            `SELECT d.donor_id, d.donor_name, d.blood_group, dis.district_name,  d.email, d.phone_number 
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

    //delete a donor
    resource function delete donors/[int donor_id](http:Request req) returns json|error {

        sql:ParameterizedQuery deleteQuery = `DELETE FROM donor WHERE donor_id = ${donor_id}`;

        sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

        if result.affectedRowCount > 0 {
            return { message: "Donor deleted successfully." };
        } else {
            return { message: "Donor not found or already deleted." };
        }
    }

    //add hospitals to the system
    resource function post hospitals(http:Request req) returns json|error {
    json payload = check req.getJsonPayload(); // Extract JSON

    addHospitalData newHospital = check payload.cloneWithType(addHospitalData); //Map JSON to record

    sql:ParameterizedQuery insertQuery = `INSERT INTO hospital 
        (hospital_name, hospital_type, hospital_address, contact_number, district_id)
        VALUES (${newHospital.hospital_name}, ${newHospital.hospital_type}, 
                ${newHospital.hospital_address}, ${newHospital.contact_number}, 
                ${newHospital.district_id})`;

            _ = check database:dbClient->execute(insertQuery);

        return { message: "Hospital added successfully." };
    }

    //update hospital data 
    resource function put hospitals/[int hospital_id](http:Request req) returns json|error {
    json payload = check req.getJsonPayload();

    addHospitalData updatedHospital = check payload.cloneWithType(addHospitalData);

    sql:ParameterizedQuery updateQuery = `UPDATE hospital
        SET hospital_name = ${updatedHospital.hospital_name},
            hospital_type = ${updatedHospital.hospital_type},
            hospital_address = ${updatedHospital.hospital_address},
            contact_number = ${updatedHospital.contact_number},
            district_id = ${updatedHospital.district_id}
        WHERE hospital_id = ${hospital_id}`;

    _ = check database:dbClient->execute(updateQuery);

    return { message: "Hospital updated successfully." };
    }


    //view all hospitals
    resource function get hospitalData(http:Request req) returns viewHospitalData[]|error {
         stream<viewHospitalData, sql:Error?> hospitalStream = database:dbClient->query(
            `SELECT hospital_id, hospital_name, hospital_type, hospital_address, contact_number, district_id
            FROM hospital`,
            viewHospitalData
        );

        viewHospitalData[] hospitals = [];
        check hospitalStream.forEach(function(viewHospitalData hospital) {
            hospitals.push(hospital);
        });

        return hospitals;
    }

    //delete hospital
    resource function delete hospitals/[int hospital_id](http:Request req) returns json|error {

        sql:ParameterizedQuery deleteQuery = `DELETE FROM hospital WHERE hospital_id = ${hospital_id}`;

        sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

        if result.affectedRowCount > 0 {
            return { message: "Hospital deleted successfully." };
        } else {
            return { message: "Hospital not found or already deleted." };
        }
    }

    //view hospital users
    resource function get hospitalUserData(http:Request req) returns viewHospitalUsers[]|error {
        stream<viewHospitalUsers, sql:Error?> hospitalUserStream = database:dbClient->query(
            `SELECT hu.hospital_email, h.hospital_name, h.hospital_type, h.hospital_address, h.contact_number, d.district_name
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

    //add hospital users to the system
    resource function post hospitalUsers(http:Request req) returns json|error {
        json payload = check req.getJsonPayload(); // Extract JSON

        addHospitalUsers newhospitalUsers = check payload.cloneWithType(addHospitalUsers); // Map JSON to record

        //Check if hospital_id exists in hospital table
        sql:ParameterizedQuery checkHospitalQuery = 
        `SELECT COUNT(*) AS cnt FROM hospital WHERE hospital_id = ${newhospitalUsers.hospital_id}`;

        record {| int cnt; |}? hospitalResult = check database:dbClient->queryRow(checkHospitalQuery);

        if hospitalResult is record {| int cnt; |} && hospitalResult.cnt == 0 {
            return { message: "Hospital ID does not exist. Please provide a valid hospital ID." };
        }

        //Try inserting into hospital_user
        sql:ParameterizedQuery insertQuery = `INSERT INTO hospital_user 
        (hospital_email, hospital_id, password_hash)
        VALUES (${newhospitalUsers.hospital_email}, ${newhospitalUsers.hospital_id}, 
                ${newhospitalUsers.password_hash})`;

        var result = database:dbClient->execute(insertQuery);
            if result is error {
                string errMsg = result.message();

                if string:indexOf(errMsg, "Duplicate entry") != -1 {
                    return { message: "A hospital user with this hospital ID already exists." };
                } else {
                    return { message: "An unexpected error occurred: " + errMsg };
                }
            }

        return { message: "Hospital User added successfully." };
    }

    //delete hospital user
    resource function delete hospitalUser/[int hospital_id](http:Request req) returns json|error {

        sql:ParameterizedQuery deleteQuery = `DELETE FROM hospital_user WHERE hospital_id = ${hospital_id}`;

        sql:ExecutionResult result = check database:dbClient->execute(deleteQuery);

        if result.affectedRowCount > 0 {
            return { message: "Hospital User deleted successfully." };
        } else {
            return { message: "Hospital User not found or already deleted." };
        }
    }
    
}

public function startDashboardAdminService() returns error? {
    // Function to integrate with the service start pattern
    io:println("Dashboard Admin service started on port 9092");
}