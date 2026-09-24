--creando base de datos y usuario 
CREATE DATABASE miniblog_db;

CREATE USER miniblog_user WITH PASSWORD 'admin';
--dando permiso al usuario para que pueda crear tablas y secuencia en la base de datos
GRANT ALL PRIVILEGES ON DATABASE miniblog_db TO miniblog_user;

GRANT ALL PRIVILEGES ON SCHEMA public TO miniblog_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO miniblog_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO miniblog_user;

--creando tablas

CREATE TABLE authors (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
bio TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
id SERIAL PRIMARY KEY,
title VARCHAR(200) NOT NULL,
content TEXT NOT NULL,
author_id INTEGER NOT NULL,
published BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW(),
FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);