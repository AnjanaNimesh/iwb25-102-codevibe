import backend.database;
import backend.admin;
import backend.hospital;
import backend.auth;

import ballerinax/mysql.driver as _;

public function main() returns error? {
    check database:connectDatabase();
    check admin:startDashboardAdminService();
    check hospital:startHospitalService();
    check auth:startAuthService();
}
