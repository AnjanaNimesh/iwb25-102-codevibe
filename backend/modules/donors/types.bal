public type Donor record {|
    int donor_id;
    string donor_name;
    string email;
    string phone_number;
    int district_id;
    string district_name;
    string blood_group;
    string? last_donation_date;
    string? gender;
    string status;
|};

public type DonationHistory record {|
    int donation_id;
    int donor_id;
    string donation_date;
    string location;
    string donation_type;
|};

public type Hospital record {|
    int hospital_id;
    string hospital_name;
    string? hospital_type;
    string? hospital_address;
    string? contact_number;
    int district_id;
    string district_name;
    float latitude;
    float longitude;
    float? distance;
|};

public type AuthValidationResult record {|
    boolean isValid;
    string email;
    string role;
    string userId;
    string message;
|};