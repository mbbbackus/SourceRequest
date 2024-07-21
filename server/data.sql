CREATE DATABASE sourcetrackerapp;

CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    title VARCHAR(255),
    scraped DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE citation (
    id SERIAL PRIMARY KEY,
    sentence VARCHAR(2048),
    article SERIAL,
    citation SERIAL
);
