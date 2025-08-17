import backend.database;
import backend.admin;
import backend.hospital;
import backend.blood_requests;
import backend.donors;

import ballerinax/mysql.driver as _;

public function main() returns error? {
    check database:connectDatabase();
    check admin:startDashboardAdminService();
    check hospital:startHospitalService();
    check blood_requests:startBloodRequestsService();
    check donors:startDonorsService();
}
