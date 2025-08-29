import backend.database;
import backend.admin;
import backend.hospital;
import backend.auth;
import backend.blood_requests;
import backend.donors;

import ballerinax/mysql.driver as _;

public function main() returns error? {
    check database:connectDatabase();
    check admin:setupDefaultAdmin();
    check admin:startDashboardAdminService();
    check hospital:startHospitalService();
    check auth:startAuthService();
    check blood_requests:startBloodRequestsService();
    check donors:startDonorsService();    
}
