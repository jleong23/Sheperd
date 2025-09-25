DROP TABLE IF EXISTS attendance;

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    kidId INT NOT NULL,
    name TEXT,
    week INT NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    reason TEXT,
    photo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
