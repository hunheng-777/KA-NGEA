USE ka_ngea;

-- Sample users (password is "password" for all)
INSERT INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@kangea.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Employer', 'employer@kangea.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employer'),
('Jane Student', 'student@kangea.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- Sample listings
INSERT INTO listings (employer_id, title, company, type, location, description, requirements, deadline) VALUES
(2, 'Cybersecurity Analyst', 'SecureTech', 'job', 'Phnom Penh', 'We are looking for a cybersecurity analyst.', 'CCNA certification, 1 year experience', '2026-06-30'),
(2, 'Network Engineer Intern', 'NetCorp', 'internship', 'Phnom Penh', 'Internship for networking students.', 'CCNA student, basic networking knowledge', '2026-05-30'),
(2, 'IT Scholarship 2026', 'TechFoundation', 'scholarship', 'Online', 'Full scholarship for cybersecurity students.', 'GPA 3.5+, second year student', '2026-04-30');