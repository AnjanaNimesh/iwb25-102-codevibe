// blood_requests.bal - Blood Requests module

import backend.database;

import ballerina/http;
import ballerina/io;
import ballerina/sql;
// import ballerina/jwt; // Commented out as authentication is not implemented yet

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173", "*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    }
}

service /bloodrequests on new http:Listener(9094) {
    // Get all blood requests (for display to users)
    // Authentication is commented out as it is not implemented yet
    resource function get requests(http:Request req) returns BloodRequest[]|error {
        // jwt:Payload payload = check getValidatedPayload(req); // Commented
        // if (!hasAnyRole(payload, ["Admin", "User"])) { // Commented
        //     return error("Forbidden: You do not have permission to access this resource");
        // }
        // int hospital_id = check getHospitalId(payload); // Commented, assuming hospital_id from auth in future

        stream<BloodRequest, sql:Error?> resultStream = database:dbClient->query(
            `SELECT * FROM blood_request ORDER BY request_date DESC`
        );
        BloodRequest[] requests = [];
        check resultStream.forEach(function(BloodRequest request) {
            requests.push(request);
        });
        check resultStream.close();
        return requests;
    }

    // Add a new blood request
    // Authentication is commented out as it is not implemented yet
    resource function post addrequest(http:Request req, @http:Payload BloodRequestInput requestInput) returns json|error {
        // jwt:Payload payload = check getValidatedPayload(req); // Commented
        // if (!hasAnyRole(payload, ["Admin"])) { // Commented
        //     return error("Forbidden: You do not have permission to add blood requests");
        // }
        // int hospital_id = check getHospitalId(payload); // Commented, but use input hospital_id for now

        sql:ExecutionResult result = check database:dbClient->execute(`
            INSERT INTO blood_request (hospital_id, blood_group, units_required, notes)
            VALUES (${requestInput.hospital_id}, ${requestInput.blood_group}, ${requestInput.units_required}, ${requestInput.notes})
        `);
        if (result.affectedRowCount == 0) {
            return error("Failed to add blood request");
        }
        return {"message": "Blood request has been added successfully."};
    }

    // Update blood request status (e.g., mark as Fulfilled or Rejected)
    // Authentication is commented out as it is not implemented yet
    resource function put updatestatus/[int request_id](http:Request req, @http:Payload BloodRequestStatusUpdate statusUpdate) returns json|error {
        // jwt:Payload payload = check getValidatedPayload(req); // Commented
        // if (!hasAnyRole(payload, ["Admin"])) { // Commented
        //     return error("Forbidden: You do not have permission to update blood requests");
        // }
        // int hospital_id = check getHospitalId(payload); // Commented

        sql:ExecutionResult result = check database:dbClient->execute(`
            UPDATE blood_request 
            SET request_status = ${statusUpdate.request_status}
            WHERE request_id = ${request_id}`
            );
        if (result.affectedRowCount == 0) {
            return error("Blood request not found or update failed");
        }
        return {"message": "Blood request status updated."};
    }

    // Delete a blood request
    // Authentication is commented out as it is not implemented yet
    resource function delete deleterequest/[int request_id](http:Request req) returns json|error {
        // jwt:Payload payload = check getValidatedPayload(req); // Commented
        // if (!hasAnyRole(payload, ["Admin"])) { // Commented
        //     return error("Forbidden: You do not have permission to delete blood requests");
        // }
        // int hospital_id = check getHospitalId(payload); // Commented

        sql:ExecutionResult result = check database:dbClient->execute(`
            DELETE FROM blood_request WHERE request_id = ${request_id}

        `);
        if (result.affectedRowCount == 0) {
            return error("Blood request not found or delete failed");
        }
        return {"message": "Blood request deleted."};
    }
}

public function startBloodRequestsService() returns error? {
    io:println("Blood Requests service started on port: 9094");
}