# 🩸 Life Drop – Blood Donation Platform  

## 🚀 Project Overview  
**Life Drop** is a platform that connects hospitals, donors, and admins to ensure timely blood donation and availability.  

- **Admins**: Register hospitals  
- **Hospitals**: Post urgent blood requests & organize blood donation campaigns  
- **Donors**: Receive requests based on their blood group, complete an eligibility check, and find nearby hospitals to donate  

This system ensures a **faster, smarter, and community-driven approach to saving lives.**  

---

## 🗄️ Database Setup  

### Database Configuration (MySQL)  
```sql
CREATE DATABASE LifeDrop;
USE LifeDrop;


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
    gender VARCHAR(10),
    status ENUM('active', 'deactive') NOT NULL DEFAULT 'active',
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
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);

-- hospital_user table
CREATE TABLE hospital_user (
    hospital_email VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    hospital_id INT NOT NULL UNIQUE,
    status ENUM('active', 'deactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

--blood campaign table
CREATE TABLE blood_campaign (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image LONGBLOB, 
    date DATE NOT NULL, 
    status ENUM('active', 'deactive') DEFAULT 'active',
    admission_number VARCHAR(50),
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
    is_deleted TINYINT(1) DEFAULT 0,
    admission_number VARCHAR(50),
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
    certificate_sent TINYINT DEFAULT 0,
    certificate_sent_date DATETIME NULL,
    FOREIGN KEY (donor_id) REFERENCES donor(donor_id),
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id),
    FOREIGN KEY (blood_request_id) REFERENCES blood_request(request_id)
);

-- admin table
CREATE TABLE admin (
    admin_email VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active'
);
```

### 📊 Sample Dataset

```sql
-- =========================
-- Insert Districts (25)
-- =========================
INSERT INTO district (district_name) VALUES
('Colombo'),
('Gampaha'),
('Kalutara'),
('Kandy'),
('Matale'),
('Nuwara Eliya'),
('Galle'),
('Matara'),
('Hambantota'),
('Jaffna'),
('Kilinochchi'),
('Mannar'),
('Vavuniya'),
('Mullaitivu'),
('Batticaloa'),
('Ampara'),
('Trincomalee'),
('Kurunegala'),
('Puttalam'),
('Anuradhapura'),
('Polonnaruwa'),
('Badulla'),
('Monaragala'),
('Ratnapura'),
('Kegalle');

-- =========================
-- Insert Hospitals
-- =========================
INSERT INTO hospital (hospital_name, hospital_type, hospital_address, contact_number, district_id, latitude, longitude) VALUES
('National Hospital of Sri Lanka', 'Teaching', 'Colombo 10', '0112691111', 1, 6.927079, 79.861244),
('Castle Street Hospital for Women', 'Specialized', 'Colombo 8', '0112692211', 1, 6.918056, 79.864167),
('Karapitiya Teaching Hospital', 'Teaching', 'Karapitiya, Galle', '0912233333', 7, 6.053519, 80.221050),
('Kandy Teaching Hospital', 'Teaching', 'Kandy', '0812222261', 4, 7.290572, 80.633728),
('Jaffna Teaching Hospital', 'Teaching', 'Jaffna Town', '0212222222', 10, 9.661498, 80.025513),
('Kurunegala Teaching Hospital', 'Teaching', 'Kurunegala', '0372222261', 18, 7.486302, 80.364727),
('Badulla Provincial Hospital', 'Provincial', 'Badulla Town', '0552222261', 22, 6.989720, 81.055000),
('Anuradhapura Teaching Hospital', 'Teaching', 'Anuradhapura', '0252222261', 20, 8.311353, 80.403651);

-- =========================
-- Insert Hospital Users 
-- =========================
INSERT INTO hospital_user (hospital_email, password_hash, hospital_id, status) VALUES
('nhsl@lifedrop.lk', 'hashedpass1', 1, 'active'),
('castle@lifedrop.lk', 'hashedpass2', 2, 'active'),
('karapitiya@lifedrop.lk', 'hashedpass3', 3, 'active'),
('kandy@lifedrop.lk', 'hashedpass4', 4, 'active'),
('jaffna@lifedrop.lk', 'hashedpass5', 5, 'active');

-- =========================
-- Insert Donors 
-- =========================
INSERT INTO donor (donor_name, email, phone_number, password_hash, district_id, blood_group, last_donation_date, gender, status) VALUES
('Kasun Perera', 'kasunp@gmail.com', '0712345678', 'hashedpw1', 1, 'A+', '2025-05-12', 'Male', 'active'),
('Nirosha Fernando', 'nirosha@gmail.com', '0771234567', 'hashedpw2', 7, 'O-', NULL, 'Female', 'active'),
('Sajith Kumara', 'sajith@gmail.com', '0758765432', 'hashedpw3', 4, 'B+', '2025-03-22', 'Male', 'active'),
('Tharindu Silva', 'tharindu@gmail.com', '0763456789', 'hashedpw4', 18, 'AB+', '2024-12-01', 'Male', 'active'),
('Dilani Weerasinghe', 'dilani@gmail.com', '0709876543', 'hashedpw5', 10, 'O+', '2025-04-15', 'Female', 'active');

-- =========================
-- Insert Donation History
-- =========================
INSERT INTO donation_history (donor_id, donation_date, location, donation_type) VALUES
(1, '2025-05-12', 'National Hospital of Sri Lanka', 'Whole Blood'),
(3, '2025-03-22', 'Kandy Teaching Hospital', 'Plasma'),
(5, '2025-04-15', 'Jaffna Teaching Hospital', 'Whole Blood');

-- =========================
-- Insert Campaigns
-- =========================
INSERT INTO blood_campaign (hospital_id, title, location, date, admission_number) VALUES
(1, 'Colombo Mega Blood Drive', 'Colombo Town Hall', '2025-09-10', 'ADM001'),
(3, 'Southern Province Blood Camp', 'Karapitiya Grounds', '2025-09-20', 'ADM002'),
(5, 'Jaffna University Blood Drive', 'Jaffna Uni Main Hall', '2025-09-25', 'ADM003');

-- =========================
-- Insert Blood Stock
-- =========================
INSERT INTO blood_group (hospital_id, blood_name, quantity) VALUES
(1, 'A+', 25),
(1, 'O-', 10),
(3, 'B+', 15),
(4, 'AB+', 8),
(5, 'O+', 20);

-- =========================
-- Insert Blood Requests
-- =========================
INSERT INTO blood_request (hospital_id, blood_group, units_required, notes, admission_number) VALUES
(1, 'O-', 5, 'Accident emergency case', 'PAT001'),
(4, 'B+', 3, 'Surgery scheduled', 'PAT002'),
(5, 'O+', 2, 'Child patient urgent need', 'PAT003');

-- =========================
-- Insert Donations 
-- =========================
INSERT INTO donation (donor_id, hospital_id, blood_request_id, donate_status) VALUES
(2, 1, 1, 'Completed'),
(3, 4, 2, 'Pending'),
(5, 5, 3, 'Completed');

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
```

### 🔑 Default admin Credentials
Email: admin@lifedrop.com

Password: admin@2024

### ⚙️ Running the Project
**1. Backend Setup**
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables (Config.toml)
[backend.database]
USER = "your_username"
PASSWORD = "your_password"
HOST = "localhost"
PORT = 3306
DATABASE = "LifeDrop"

# Run backend
bal run  

**2. Frontend Setup**
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev

### 🌟 Features Recap

✅ Admins register hospitals

✅ Hospitals create blood requests & campaigns

✅ Donors get matched by blood group & location

✅ Donors complete eligibility checks before donating

✅ Nearby hospitals are suggested automatically
