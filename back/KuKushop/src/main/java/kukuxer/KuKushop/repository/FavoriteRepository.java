package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long id);
    Optional<Favorite> findByUserIdAndProductId(Long id, UUID product_id);

}
