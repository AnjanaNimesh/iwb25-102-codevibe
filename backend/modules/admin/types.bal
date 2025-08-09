//view donor record for dashboard
public type donorDetails record {|
    int donor_id;
    string donor_name;
    string blood_group;
    string district_name;
    string email;
    string phone_number;
|};

public type addHospitalData record {|
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    int district_id;
|};

public type viewHospitalData record {|
    int hospital_id;
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    int district_id;
|};

public type deleteHospital record {|
    int hospital_id;
|};

public type addHospitalUsers record{|
    string hospital_email;
    int hospital_id;
    string password_hash;
|};

public type viewHospitalUsers record {|
    string hospital_email;
    string hospital_name;
    string hospital_type;
    string hospital_address;
    string contact_number;
    string district_name;
|};