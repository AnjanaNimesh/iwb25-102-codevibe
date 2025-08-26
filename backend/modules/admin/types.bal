//view donor record for dashboard
public type donorDetails record {|
    int donor_id;
    string donor_name;
    string blood_group;
    string district_name;
    string email;
    string phone_number;
    string status;
|};

public type addHospitalData record {|
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    string district_name;
|};

public type viewHospitalData record {|
    int hospital_id;
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    string district_name;
    string status;
|};

public type deleteHospital record {|
    int hospital_id;
|};

public type addHospitalUsers record{|
    string hospital_email;
    string hospital_name;
    string password;
|};

public type viewHospitalUsers record {|
    string hospital_email;
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    string status;
    string district_name;
|};

public type HospitalWithDistrictName record {|
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    string district_name;
|};

public type District record {|
    int district_id;
    string district_name;
|};

public type ViewHospitalBloodStock record {|
    string hospital_name;
    string district_name;
    string blood_name;
    int quantity;
    string status_indicator;
    string last_modified;  
|};

public type viewHospitalName record {|
    int hospital_id;
    string hospital_name;
|};

public type bloodQuantity record {|
    string blood_name;
    int quantity;
|};

public type updateHospitalUsers record {|
    int hospital_id;
    string hospital_email;
    string hospital_name;
|};

public type profileDetails record {|
    string admin_email;
    string password_hash;
|};

// Record type for update profile request
type UpdateProfileRequest record {
    string new_email?;
    string new_password?;
    string confirm_password?;
};

// Record type for response
type UpdateProfileResponse record {
    string status;
    string message;
    string? updated_field?;
};