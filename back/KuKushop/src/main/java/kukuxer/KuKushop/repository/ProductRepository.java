package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Comment;
import kukuxer.KuKushop.entity.Product;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> getAllByShopId(Long shopId);
    List<Comment> findCommentsById(UUID id);

    @Query("SELECT p FROM Product p ORDER BY p.rating DESC")
    List<Product> findTop3ByRating(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.rating DESC")
    List<Product> findTop6ByNameContainingOrderByRatingDesc(@Param("name") String name, Pageable pageable);

    List<Product> findAllByShopId(Long shopId);
}
