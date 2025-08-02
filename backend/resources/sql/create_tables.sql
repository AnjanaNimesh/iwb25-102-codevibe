use bloodlink
-- district table
CREATE TABLE district (
    district_id INT AUTO_INCREMENT PRIMARY KEY,
    district_name VARCHAR(50) NOT NULL UNIQUE
);

-- donor table
CREATE TABLE donor (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    district_id INT NOT NULL,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    last_donation_date DATE,
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);

-- hospital table
CREATE TABLE hospital (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(100) NOT NULL,
    hospital_type VARCHAR(30),
    hospital_address VARCHAR(100),
    contact_number VARCHAR(15),
    district_id INT NOT NULL,
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);

-- hospital_user table
CREATE TABLE hospital_user (
    hospital_email VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    hospital_id INT NOT NULL UNIQUE,
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

-- blood_group table (per hospital stock)
CREATE TABLE blood_group (
    blood_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_name VARCHAR(5) NOT NULL CHECK (blood_name IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    quantity INT DEFAULT 0 CHECK (quantity >= 0),
    UNIQUE (hospital_id, blood_name),
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

-- blood_request table
CREATE TABLE blood_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_required INT NOT NULL CHECK (units_required > 0),
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    request_status VARCHAR(20) DEFAULT 'Pending',
    notes VARCHAR(255),
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

-- donation table
CREATE TABLE donation (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    hospital_id INT NOT NULL,
    blood_request_id INT DEFAULT NULL,
    donate_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    donate_status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (donor_id) REFERENCES donor(donor_id),
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id),
    FOREIGN KEY (blood_request_id) REFERENCES blood_request(request_id)
);

-- notification table
CREATE TABLE notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    note_message VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- admin table
CREATE TABLE admin (
    admin_email VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL
);


