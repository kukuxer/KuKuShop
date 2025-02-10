package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> getAllByShopId(Long shopId);
}
