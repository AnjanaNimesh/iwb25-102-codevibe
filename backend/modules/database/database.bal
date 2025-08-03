import ballerinax/mysql;
import ballerina/io;

configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = ?;
configurable string DATABASE = ?;

public final mysql:Client dbClient = check new (
    host = HOST,
    user = USER,
    password = PASSWORD,
    port = PORT,
    database = DATABASE
);


public function connectDatabase() returns error? {
    io:println("Database connected successfully...");
}
