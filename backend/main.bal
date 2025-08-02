import ballerinax/mysql;
import ballerinax/mysql.driver as _; // Bundles the driver
import ballerina/log;


type District record {|
    int district_id;
    string district_name;
|};

configurable string HOST = ?;
configurable int PORT = ?;
configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string DATABASE = ?;

public final mysql:Client dbClient = check new mysql:Client(
    host = HOST,
    port = PORT,
    user = USER,
    password = PASSWORD,
    database = DATABASE
);


public function main() returns error? {
    log:printInfo("Connecting to MySQL and fetching districts...");
    District[] districts = check getAllDistricts();

    // Print the retrieved districts
    foreach var district in districts {
        log:printInfo("District: " + district.district_id.toString() + " - " + district.district_name);
    }
}

// Function to retrieve all districts
function getAllDistricts() returns District[]|error {
    District[] districts = [];
    stream<District, error?> resultStream = dbClient->query(`SELECT * FROM district`);

    check from District d in resultStream
        do {
            districts.push(d);
        };

    check resultStream.close();
    return districts;
}
