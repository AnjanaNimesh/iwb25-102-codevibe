
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

service /donors on new http:Listener(9095) {
    // Get donor details by donor_id
    resource function get [int donorId](http:Request req) returns Donor|error {
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

    // Get donation history by donor_id
    resource function get [int donorId]/history(http:Request req) returns DonationHistory[]|error {
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

    // Update donor details
    resource function put [int donorId](http:Request req) returns json|error {
        json payload = check req.getJsonPayload();
        string donor_name = (check payload.donor_name).toString();
        string email = (check payload.email).toString();
        string phone_number = (check payload.phone_number).toString();
        string blood_group = (check payload.blood_group).toString();
        string district_name = (check payload.district_name).toString();

        // Validate blood_group
        if ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].indexOf(blood_group) == -1 {
            return error("Invalid blood group");
        }

        // Get district_id from district_name
        sql:ParameterizedQuery districtQuery = `SELECT district_id FROM district WHERE district_name = ${district_name}`;
        record { int district_id; }? district = check database:dbClient->queryRow(districtQuery);
        if district is () {
            return error("District not found");
        }

        // Check email uniqueness (excluding current donor)
        sql:ParameterizedQuery emailCheck = `SELECT donor_id FROM donor WHERE email = ${email} AND donor_id != ${donorId}`;
        record { int donor_id; }? existingDonor = check database:dbClient->queryRow(emailCheck);
        if existingDonor is record { int donor_id; } {
            return error("Email already in use");
        }

        // Update donor
        sql:ParameterizedQuery updateQuery = `UPDATE donor 
                                             SET donor_name = ${donor_name}, email = ${email}, 
                                                 phone_number = ${phone_number}, blood_group = ${blood_group}, 
                                                 district_id = ${district.district_id}
                                             WHERE donor_id = ${donorId}`;
        sql:ExecutionResult result = check database:dbClient->execute(updateQuery);
        if result.affectedRowCount == 0 {
            return error("Donor not found or update failed");
        }
        return {"message": "Donor details updated successfully"};
    }
}

public function startDonorsService() returns error? {
    io:println("Donors service started on port: 9095");
}