DROP TABLE IF EXISTS scores;

CREATE TABLE scores(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255),
    score json, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);