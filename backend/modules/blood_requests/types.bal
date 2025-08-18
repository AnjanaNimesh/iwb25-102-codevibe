// types.bal - Blood Requests module types

// BloodRequest record representing a blood request from the database
// public type BloodRequest record {|
//     int request_id?;
//     int hospital_id;
//     string blood_group;
//     int units_required;
//     string request_date?;
//     string request_status;
//     string? notes;
// |};

public type BloodRequest record {|
    int request_id?;
    int hospital_id;
    string blood_group;
    int units_required;
    string request_date?;
    string request_status;
    string? notes;
    string? admission_number; // <-- add this (type depending on DB column)
    int is_deleted;
|};



// Input type for creating blood requests
public type BloodRequestInput record {|
    int hospital_id;
    string blood_group;
    int units_required;
    string? notes;
|};

// Input type for updating blood request status
public type BloodRequestStatusUpdate record {|
    string request_status; // e.g., 'Pending', 'Fulfilled', 'Rejected'
|};