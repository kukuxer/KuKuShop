CREATE TABLE IF NOT EXISTs product_additional_pictures
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BINARY(16) NOT NULL,
    picture_url VARCHAR(2083) NOT NULL,
    CONSTRAINT fk_product_additional_pictures_product_id FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BINARY(16) NOT NULL,
    user_id BIGINT NOT NULL,
    comment TEXT,
    rating DOUBLE,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_comment (
    product_id BINARY(16) NOT NULL,
    comment_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, comment_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (comment_id) REFERENCES comment(id)
);



ALTER TABLE shops
ADD COLUMN is_trusted BOOLEAN DEFAULT FALSE,
ADD COLUMN rating DOUBLE DEFAULT 0.0;
