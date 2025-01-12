package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
    Optional<Profile> findByAuthId(String authId);
}
