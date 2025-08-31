public type AuthValidationResult record {|
    boolean isValid;
    string email;
    string role;
    string userId;
    string message;
|};

public type BloodRequest record {|
    int request_id;
    int hospital_id;
    string hospital_name?;
    string blood_group;
    int units_required;
    string request_date;
    string request_status;
    string notes?;
|};

public type BloodRequestInput record {|
    int hospital_id;
    string blood_group;
    int units_required;
    string notes?;
|};

public type BloodRequestStatusUpdate record {|
    string request_status;
|};
