import backend.database;

import ballerinax/mysql.driver as _;
public function main() returns error? {
    check database:connectDatabase();

}
