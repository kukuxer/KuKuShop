package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop,Long> {
    Optional<Shop> findByUserAuthId(String userAuthId);
    Optional<Shop> findByOwnerName(String ownerName);

}
