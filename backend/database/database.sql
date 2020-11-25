CREATE DATABASE socialmediadb;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(40),
    name VARCHAR(40),
    password VARCHAR(255),
    email TEXT,
    isAdmin BOOLEAN DEFAULT false,
    friends TEXT [],
    posts TEXT [] 
);

CREATE TABLE posts(
	id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(127) UNIQUE,
    content VARCHAR(255),
	author json NOT NULL,
    likes INTEGER DEFAULT 0,
    comments TEXT [] 
);