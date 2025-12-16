-- Drop tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS kids;
DROP TYPE IF EXISTS attendance_status;


-- Create kids table
CREATE TABLE kids (
    id SERIAL PRIMARY KEY, --Auto incrementing ID
    name TEXT NOT NULL, --name is required
    birthday DATE,
    school TEXT,
    phone TEXT,
    parent_phone TEXT,
    photo TEXT, --path/url of photo
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance status enum
CREATE TYPE attendance_status AS ENUM ('coming', 'maybe', 'not coming');

-- Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    kidId INT NOT NULL, --foreign key to kids table
    name TEXT,
    week INT NOT NULL,
    term INT DEFAULT 1, --default term starts at 1
    status attendance_status DEFAULT 'maybe',
    reason TEXT,
    photo TEXT,
    year INT DEFAULT EXTRACT(YEAR FROM NOW()),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (kidId) REFERENCES kids(id) ON DELETE CASCADE --if kid is deleted, attendance records are also deleted
);

-- Create events table
CREATE TABLE events (
    EventID SERIAL PRIMARY KEY,
    EventName TEXT NOT NULL,
    EventStartDate DATE,
    EventEndDate DATE,
    EventStartTime TIME,
    EventEndTime TIME,
    EventPhoto TEXT,
    EventAssignedPeople TEXT
);
