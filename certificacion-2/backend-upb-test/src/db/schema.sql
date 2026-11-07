CREATE TABLE IF NOT EXISTS productos (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    precio     NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock      INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
