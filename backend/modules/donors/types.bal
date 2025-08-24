
// Donor record representing a donor from the database
public type Donor record {|
    int donor_id;
    string donor_name;
    string email;
    string phone_number;
    int district_id;
    string district_name;
    string blood_group;
    string? last_donation_date;
|};

// DonationHistory record representing a donation record from the database
public type DonationHistory record {|
    int donation_id;
    int donor_id;
    string donation_date;
    string location;
    string donation_type;
|};

// Hospital record representing a hospital from the database
public type Hospital record {|
    int hospital_id;
    string hospital_name;
    string? hospital_type;
    string? hospital_address;
    string? contact_number;
    int district_id;
    string district_name;
    decimal latitude;
    decimal longitude;
    float distance?;
|};