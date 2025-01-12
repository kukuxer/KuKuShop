DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
                          id SERIAL PRIMARY KEY,
                          role VARCHAR(255),
                          family_name VARCHAR(255),
                          given_name VARCHAR(255),
                          name VARCHAR(255),
                          nickname VARCHAR(255),
                          email VARCHAR(255) UNIQUE,
                          auth_id VARCHAR(255) UNIQUE
);