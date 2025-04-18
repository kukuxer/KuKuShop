package kukuxer.KuKushop.repository;

import kukuxer.KuKushop.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
