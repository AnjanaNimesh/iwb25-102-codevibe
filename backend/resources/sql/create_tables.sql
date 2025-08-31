use lifedrop
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
    gender VARCHAR(10) NOT NULL DEFAULT 'Male',
    status VARCHAR DEFAULT 'active',
    FOREIGN KEY (district_id) REFERENCES district(district_id),
    ADD CONSTRAINT chk_gender CHECK (gender IN ('Male', 'Female', 'Other'));
);

-- hospital table
CREATE TABLE hospital (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(100) NOT NULL,
    hospital_type VARCHAR(30),
    hospital_address VARCHAR(100),
    contact_number VARCHAR(15),
    district_id INT NOT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    status VARCHAR DEFAULT 'active',
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);

-- hospital_user table
CREATE TABLE hospital_user (
    hospital_email VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    hospital_id INT NOT NULL UNIQUE,
    status ENUM DEFAULT 'active',
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

-- blood_group table (per hospital stock)
CREATE TABLE blood_group (
    blood_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_name VARCHAR(5) NOT NULL CHECK (blood_name IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    quantity INT DEFAULT 0 CHECK (quantity >= 0),
    status_indicator VARCHAR DEFAULT 'Good',
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (hospital_id, blood_name),
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

DELIMITER $$

-- Trigger to set status_indicator before insert
CREATE TRIGGER blood_group_status_before_insert
BEFORE INSERT ON blood_group
FOR EACH ROW
BEGIN
    IF NEW.quantity >= 50 THEN
        SET NEW.status_indicator = 'Good';
    ELSEIF NEW.quantity >= 20 THEN
        SET NEW.status_indicator = 'Adequate';
    ELSEIF NEW.quantity >= 10 THEN
        SET NEW.status_indicator = 'Low';
    ELSE
        SET NEW.status_indicator = 'Critical';
    END IF;

    -- Also set last_modified to current timestamp on insert
    SET NEW.last_modified = CURRENT_TIMESTAMP;
END$$

-- Trigger to set status_indicator before update
CREATE TRIGGER blood_group_status_before_update
BEFORE UPDATE ON blood_group
FOR EACH ROW
BEGIN
    DECLARE old_status VARCHAR(10);

    SET old_status = OLD.status_indicator;

    -- Update status_indicator based on quantity
    IF NEW.quantity >= 50 THEN
        SET NEW.status_indicator = 'Good';
    ELSEIF NEW.quantity >= 20 THEN
        SET NEW.status_indicator = 'Adequate';
    ELSEIF NEW.quantity >= 10 THEN
        SET NEW.status_indicator = 'Low';
    ELSE
        SET NEW.status_indicator = 'Critical';
    END IF;

    -- Update last_modified only if status_indicator changed
    IF NEW.status_indicator != old_status THEN
        SET NEW.last_modified = CURRENT_TIMESTAMP;
    END IF;
END$$

DELIMITER ;


-- blood_request table
CREATE TABLE blood_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_required INT NOT NULL CHECK (units_required > 0),
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    request_status VARCHAR(20) DEFAULT 'Pending',
    notes VARCHAR(255),
    admission_number VARCHAR(50),
    is_deleted TINYINT(1) DEFAULT 0,
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

--donation history table
CREATE TABLE donation_history (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    donation_date DATE NOT NULL,
    location VARCHAR(100) NOT NULL,
    donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('Whole Blood', 'Plasma', 'Platelets', 'Double Red Cells')),
    FOREIGN KEY (donor_id) REFERENCES donor(donor_id)
);

-- notification table
CREATE TABLE notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    note_message VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- admin table
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_email VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    status ENUM DEFAULT 'active',
);

CREATE TABLE blood_campaign (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image LONGBLOB, 
    date DATE NOT NULL, 
    status ENUM('active', 'deactive') DEFAULT 'active',
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

