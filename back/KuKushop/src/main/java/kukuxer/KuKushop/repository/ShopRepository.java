package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Shop;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByUserAuthId(String userAuthId);

    Optional<Shop> findByOwnerName(String ownerName);

    Optional<Shop> findByName(String name);

    @Query("SELECT s FROM Shop s ORDER BY s.rating DESC")
    List<Shop> findTop3ByRating(Pageable pageable);

    @Query("SELECT s FROM Shop s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY s.rating DESC")
    List<Shop> searchTop6ShopsByName(@Param("name") String name, Pageable pageable);
}
