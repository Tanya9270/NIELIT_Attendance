-- PostgreSQL schema for QR Attendance System

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    last_login_at TIMESTAMP
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    teacher_name VARCHAR(100)
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE SET NULL
);

CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    scan_time TIMESTAMP,
    scanner_id INTEGER REFERENCES users(id),
    finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_audit (
    id VARCHAR(50) PRIMARY KEY,
    student_id INTEGER,
    roll_number VARCHAR(20),
    date DATE,
    qr_generation_ts TIMESTAMP,
    server_scan_time TIMESTAMP,
    scanner_id INTEGER,
    result VARCHAR(50),
    reason TEXT,
    delta_seconds REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
