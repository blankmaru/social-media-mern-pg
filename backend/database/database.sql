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
    comments TEXT [],
    image VARCHAR(127) UNIQUE
);

CREATE TABLE chats(
	id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(127) UNIQUE,
    url VARCHAR(127) UNIQUE
);

CREATE TABLE testArray(
    Id SERIAL NOT NULL PRIMARY KEY,
    users varchar(20)[] 
);

INSERT INTO testArray (testArray) VALUES ('{"Geddoku"}') WHERE Id = 1;
UPDATE testArray SET users = array_cat(users, '{"Trixy"}') WHERE Id = 1;
UPDATE users SET friends = array_cat(friends, ('{"{\"name\":\"alex\", \"age\":20}", "{\"name\":\"peter\", \"age\":24}"}')) WHERE id = 1;
UPDATE users SET friends = array_remove(friends, 'Trixy') WHERE id = 3;