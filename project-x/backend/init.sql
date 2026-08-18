DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    division VARCHAR(100) NOT NULL,
    team JSONB DEFAULT '[]',
    avatar TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(50) REFERENCES users(username),
    assigned_by VARCHAR(50) REFERENCES users(username),
    division VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'working',
    priority VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at DATE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    username VARCHAR(50) REFERENCES users(username),
    user_name VARCHAR(100),
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    username VARCHAR(50) REFERENCES users(username),
    user_name VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

-- Password: semua password = "password123" (sudah di-hash dengan bcrypt)
-- Untuk generate hash baru: node -e "console.log(require('bcrypt').hashSync('password123', 10))"
INSERT INTO users (username, password, role, name, division, team) VALUES
('lead', '$2b$10$DYKvRDNI6pZ9V6x5bARnPuy8R7P9yHkLpQa1b2c3d4e5f6g7h8i9j0', 'lead', 'Budi Santoso', 'Engineering', '["john","jane","bob"]'),
('john', '$2b$10$DYKvRDNI6pZ9V6x5bARnPuy8R7P9yHkLpQa1b2c3d4e5f6g7h8i9j0', 'staff', 'John Doe', 'Engineering', '[]'),
('jane', '$2b$10$DYKvRDNI6pZ9V6x5bARnPuy8R7P9yHkLpQa1b2c3d4e5f6g7h8i9j0', 'staff', 'Jane Smith', 'Engineering', '[]'),
('bob', '$2b$10$DYKvRDNI6pZ9V6x5bARnPuy8R7P9yHkLpQa1b2c3d4e5f6g7h8i9j0', 'staff', 'Bob Johnson', 'Engineering', '[]');

INSERT INTO tasks (title, description, assigned_to, assigned_by, division, due_date, status, priority) VALUES
('Create Monthly Report', 'Create financial report for August', 'john', 'lead', 'Engineering', '2026-08-20', 'working', 'high'),
('Review UI Design', 'Review dashboard design', 'jane', 'lead', 'Engineering', '2026-08-25', 'working', 'medium'),
('Fix Server Bug', 'Fix 500 error on production', 'bob', 'lead', 'Engineering', '2026-08-15', 'completed', 'high');

INSERT INTO comments (task_id, username, user_name, text, timestamp) VALUES
(1, 'lead', 'Budi Santoso', 'Please complete before the 20th', '2026-08-10 09:00:00'),
(1, 'john', 'John Doe', 'Okay, I will complete it', '2026-08-11 14:30:00'),
(3, 'lead', 'Budi Santoso', 'This is urgent!', '2026-08-13 10:00:00'),
(3, 'bob', 'Bob Johnson', 'Fixed already', '2026-08-14 16:00:00'),
(3, 'lead', 'Budi Santoso', 'Thank you', '2026-08-14 17:00:00');