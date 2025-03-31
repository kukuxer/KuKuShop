CREATE TABLE IF NOT EXISTS basket_product
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT     NOT NULL,
    product_id BINARY(16) NOT NULL,
    CONSTRAINT fk_basket_product_user_id_user_id FOREIGN KEY (user_id) REFERENCES profiles(id),
    CONSTRAINT fk_basket_product_product_id_product_id_ FOREIGN KEY (product_id) REFERENCES products(id)
    );
