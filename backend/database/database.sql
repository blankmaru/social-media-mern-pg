CREATE DATABASE socialmediadb;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(40),
    name VARCHAR(40),
    password VARCHAR(255),
    email TEXT,
    isAdmin BOOLEAN DEFAULT false
);