import backend.database;
import backend.admin;

import ballerinax/mysql.driver as _;
public function main() returns error? {
    check database:connectDatabase();
    check admin:startDashboardAdminService();
}
