public type NewBloodRequest record {|
    string blood_group;
    int units_required;
    string notes?;        // Optional
    string admission_number?;  // Optional
     string request_status; 
|};


public type BloodRequest record {| 
    int request_id;
    int hospital_id;
    string admission_number;  // Required (not optional)
    string blood_group;
    int units_required;
    string request_date;
    string request_status;
    string? notes;  // Optional (with ?)
|};
public type StatusUpdate record {| 
    string status;
|};

type BloodGroupStock record {|
    string blood_name; // Must be one of: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    int quantity;
|};


type BloodRequestUpdate record {
    string admission_number;
    string blood_group;
    int units_required;
    string notes;
    string request_status; // add this for status
};

type DonationDonor record {
    int donation_id;
    int donor_id;
    string donor_name;
    string email;
    string phone_number;
    string blood_group;
    string? last_donation_date;
    string donate_status;
    string donate_date;
    string status;
};


// Add these type definitions at the top of your file or in a separate types file
public type DonationStatusUpdate record {
    int donation_id;
    string new_status;
};


public type CertificateRequest record {|
    int donation_id;
    string? hospital_name;
|};

// Add these types at the top of the file, along with other types

public type BloodCampaign record {|
    int campaign_id;
    int hospital_id;
    string title;
    string location;
    string date; // DATE field from database
    string status;
|};

public type NewBloodCampaign record {|
    string title;
    string location;
    string date;
    // Image is handled as form data, not as a field in this record
|};

public type BloodCampaignUpdate record {|
    string title;
    string location;
    string date;
    // Image is handled as form data, not as a field in this record
|};

type UserPayload record {
    string user_id;
    string email;
    string role;
    int hospital_id?; // Optional hospital_id from JWT
};

public type HospitalUser record {
    string user_id;
    string email;
    string full_name;
    int? hospital_id;
    string role;
    string status;
};

