
CREATE TABLE IF NOT EXISTS profiles (
                          id SERIAL PRIMARY KEY,
                          role VARCHAR(255),
                          family_name VARCHAR(255),
                          given_name VARCHAR(255),
                          name VARCHAR(255),
                          nickname VARCHAR(255),
                          email VARCHAR(255) UNIQUE,
                          auth_id VARCHAR(255) UNIQUE,
                          creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS shop (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      user_auth_id VARCHAR(255) NOT NULL,
                      owner_name VARCHAR(255),
                      description TEXT,
                      image LONGBLOB,
                      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_user_auth_id FOREIGN KEY (user_auth_id) REFERENCES profiles (auth_id)
);
CREATE TABLE IF NOT EXISTS images (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(255),
                                      data LONGBLOB,
                                      type VARCHAR(255)
);