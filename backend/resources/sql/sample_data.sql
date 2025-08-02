INSERT INTO district (district_name) VALUES 
('Colombo'), ('Gampaha'), ('Kalutara'), ('Kandy'), ('Matale'), ('Nuwara Eliya'),
('Galle'), ('Matara'), ('Hambantota'), ('Jaffna'), ('Kilinochchi'), ('Mannar'),
('Vavuniya'), ('Mullaitivu'), ('Batticaloa'), ('Ampara'), ('Trincomalee'),
('Kurunegala'), ('Puttalam'), ('Anuradhapura'), ('Polonnaruwa'), ('Badulla'),
('Monaragala'), ('Ratnapura'), ('Kegalle');

INSERT INTO donor (donor_name, email, phone_number, password_hash, district_id, blood_group, last_donation_date) VALUES 
('Nimal Perera', 'nimal@gmail.com', '0711234567', 'hashed_pw_1', 1, 'A+', '2025-06-15'),
('Sunil Silva', 'sunil@gmail.com', '0772345678', 'hashed_pw_2', 2, 'O-', '2025-05-10'),
('Kamal Rajapaksa', 'kamal@gmail.com', '0703456789', 'hashed_pw_3', 5, 'B+', '2025-04-20');

INSERT INTO hospital (hospital_name, hospital_type, hospital_address, contact_number, district_id) VALUES 
('National Hospital Colombo', 'General', 'Colombo 10', '0112691111', 1),
('Kandy General Hospital', 'General', 'Kandy', '0812222222', 4),
('Matara Base Hospital', 'Base', 'Matara', '0412223333', 8);

INSERT INTO hospital_user (hospital_email, password_hash, hospital_id) VALUES 
('nhc_admin@gmail.com', 'admin_hashed_pw_1', 1),
('kgh_admin@gmail.com', 'admin_hashed_pw_2', 2),
('matara_admin@gmail.com', 'admin_hashed_pw_3', 3);

INSERT INTO blood_group (hospital_id, blood_name, quantity) VALUES 
(1, 'A+', 10),
(1, 'O-', 5),
(2, 'B+', 8),
(3, 'AB+', 3),
(3, 'A-', 4);

INSERT INTO blood_request (hospital_id, blood_group, units_required, request_date, request_status, notes) VALUES 
(1, 'O-', 2, '2025-08-01 10:00:00', 'Pending', 'Urgent surgery case'),
(2, 'B+', 3, '2025-07-30 12:30:00', 'Approved', 'Accident emergency'),
(3, 'A-', 1, '2025-07-28 09:15:00', 'Completed', 'Delivery case');

INSERT INTO donation (donor_id, hospital_id, blood_request_id, donate_date, donate_status) VALUES 
(1, 1, 1, '2025-08-01 14:00:00', 'Completed'),
(2, 2, 2, '2025-07-31 10:00:00', 'Pending'),
(3, 3, NULL, '2025-07-29 11:00:00', 'Completed');

INSERT INTO notification (note_message, created_at) VALUES 
('New blood donation request posted by National Hospital Colombo.', '2025-08-01 10:05:00'),
('Donation completed by Nimal Perera.', '2025-08-01 14:15:00'),
('New donor registered from Gampaha district.', '2025-07-15 08:30:00');

INSERT INTO admin (admin_email, password_hash) VALUES 
('main_admin@gmail.com', 'super_secure_admin_pw');