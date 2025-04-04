package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.BasketProduct;
import kukuxer.KuKushop.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface BasketRepository extends JpaRepository<BasketProduct, Long> {

    Optional<BasketProduct> findBasketProductByProductIdAndUserId(UUID productId, Long userId);
    List<BasketProduct> findBasketProductsByUserId(Long userId);
    Optional<BasketProduct> findBasketProductById(UUID id);

}
