CREATE TABLE IF NOT EXISTS images (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(255),
                                      data LONGBLOB,
                                      type VARCHAR(255)
);

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
CREATE TABLE IF NOT EXISTS shops (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      user_auth_id VARCHAR(255) NOT NULL,
                      owner_name VARCHAR(255),
                      description TEXT,
                      image_id BIGINT,
                      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_user_auth_id FOREIGN KEY (user_auth_id) REFERENCES profiles (auth_id),
    CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES images (id)
);
