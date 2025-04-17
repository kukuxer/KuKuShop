CREATE TABLE IF NOT EXIST product_additional_pictures
(
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    picture_url VARCHAR(2083) NOT NULL,
    CONSTRAINT fk_product_additional_pictures_product_id FOREIGN KEY (product_id) REFERENCES products (id)
);

ALTER TABLE shops
ADD COLUMN is_trusted BOOLEAN DEFAULT FALSE,
ADD COLUMN rating DOUBLE DEFAULT 0.0;