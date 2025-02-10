CREATE TABLE IF NOT EXISTS profiles (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL,
                                     user_auth_id VARCHAR(255) NOT NULL,
                                     owner_name VARCHAR(255),
                                     description TEXT,
                                     image_url VARCHAR(2083),
                                     creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     CONSTRAINT fk_user_auth_id FOREIGN KEY (user_auth_id) REFERENCES profiles (auth_id)
);

CREATE TABLE IF NOT EXISTS products (
                                        id CHAR(36) PRIMARY KEY,
                                        shop_id BIGINT NOT NULL,
                                        name VARCHAR(255) NOT NULL,
                                        description TEXT,
                                        price VARCHAR(255),
                                        rating DOUBLE,
                                        quantity INT,
                                        image_url VARCHAR(2083),
                                        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        CONSTRAINT fk_shop_id FOREIGN KEY (shop_id) REFERENCES shops (id)
);

CREATE TABLE IF NOT EXISTS product_categories (
                                                  product_id CHAR(36) NOT NULL,
                                                  category VARCHAR(255) NOT NULL,
                                                  PRIMARY KEY (product_id, category),
                                                  CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id)
);
