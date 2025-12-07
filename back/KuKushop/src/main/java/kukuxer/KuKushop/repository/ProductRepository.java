package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Comment;
import kukuxer.KuKushop.entity.Product;
import org.springframework.data.domain.Page;
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


    @Query("SELECT p FROM Product p ORDER BY p.rating DESC")
    List<Product> findTop3ByRating(Pageable pageable);

//    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.rating DESC")
//    List<Product> findTop6ByNameContainingOrderByRatingDesc(@Param("name") String name, Pageable pageable);

    List<Product> findAllByShopId(Long shopId);

    @Query("""
        SELECT DISTINCT p FROM Product p
        WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
    """)
    Page<Product> findByName(@Param("name") String name, Pageable pageable);

    @Query("""
        SELECT DISTINCT p FROM Product p
        JOIN p.categories c
        WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (COALESCE(:categoryNames, NULL) IS NULL OR LOWER(c.name) IN :categoryNames)
    """)
    Page<Product> findByNameAndCategories(
            @Param("name") String name,
            @Param("categoryNames") List<String> categoryNames,
            Pageable pageable
    );
}
