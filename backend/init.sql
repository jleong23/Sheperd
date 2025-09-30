-- Drop tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS kids;

-- Create kids table
CREATE TABLE kids (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    photo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    kidId INT NOT NULL,
    name TEXT,
    week INT NOT NULL,
    term INT DEFAULT 1,
    present BOOLEAN DEFAULT FALSE,
    reason TEXT,
    photo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (kidId) REFERENCES kids(id) ON DELETE CASCADE
);
