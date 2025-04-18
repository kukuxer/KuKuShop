CREATE TABLE IF NOT EXISTS profiles
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    role          VARCHAR(255),
    family_name   VARCHAR(255),
    given_name    VARCHAR(255),
    name          VARCHAR(255),
    nickname      VARCHAR(255),
    image_url     VARCHAR(2083),
    email         VARCHAR(255) UNIQUE,
    auth_id       VARCHAR(255) UNIQUE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shops
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    user_auth_id  VARCHAR(255) NOT NULL,
    owner_name    VARCHAR(255),
    description   TEXT,
    image_url     VARCHAR(2083),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_auth_id FOREIGN KEY (user_auth_id) REFERENCES profiles (auth_id)
);

CREATE TABLE IF NOT EXISTS products
(
    id            BINARY(16) PRIMARY KEY,
    shop_id       BIGINT       NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    price         VARCHAR(255),
    rating        DOUBLE,
    quantity      INT,
    image_url     VARCHAR(2083),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shop_id FOREIGN KEY (shop_id) REFERENCES shops (id)
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories
(
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS product_categories
(
    product_id  BINARY(16) NOT NULL,
    category_id BIGINT     NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS favorites
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT     NOT NULL,
    product_id BINARY(16) NOT NULL,
    CONSTRAINT fk_user_id_id FOREIGN KEY (user_id) REFERENCES profiles(id),
    CONSTRAINT fk_product_id_id FOREIGN KEY (product_id) REFERENCES products(id)
);

