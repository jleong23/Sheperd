-- Drop tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS kids;

-- Create kids table
CREATE TABLE kids (
    id SERIAL PRIMARY KEY, --Auto incrementing ID
    name TEXT NOT NULL, --name is required
    photo TEXT, --path/url of photo
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    kidId INT NOT NULL, --foreign key to kids table
    name TEXT,
    week INT NOT NULL,
    term INT DEFAULT 1, --default term starts at 1
    present BOOLEAN DEFAULT FALSE,
    reason TEXT,
    photo TEXT,
    year INT DEFAULT EXTRACT(YEAR FROM NOW()), 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (kidId) REFERENCES kids(id) ON DELETE CASCADE --if kid is deleted, attendance records are also deleted
);
