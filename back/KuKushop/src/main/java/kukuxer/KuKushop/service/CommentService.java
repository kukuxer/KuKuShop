package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.CommentDto;
import kukuxer.KuKushop.entity.Comment;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.repository.CommentRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import kukuxer.KuKushop.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final ProductRepository productRepository;
    private final ProfileRepository profileRepository;
    private final CommentRepository commentRepository;

    public void createComment(CommentDto commentDto, Jwt jwt){
        String userAuthId = jwt.getClaim("sub");
        Profile profile = profileRepository.findByAuthId(userAuthId).orElseThrow(
                () -> new RuntimeException("user with auth id"+ userAuthId+" not found.")
        );
        Product product = productRepository.findById(commentDto.getProductId()).orElseThrow(
                () -> new RuntimeException("product with  id" + commentDto.getProductId() + " not found.")
        );
        //TODO Refactor system so it will utilize cascade types and relations!(will be way less boilerplate code)
        List<Comment> comments = product.getComments();
        Comment comment = new Comment();
        comment.setComment(commentDto.getComment());
        comment.setRating(commentDto.getRating());
        comment.setUserId(profile.getId());
        comment.setDate(LocalDateTime.now());
        comment.setProductId(commentDto.getProductId());
        Comment savedComment = commentRepository.save(comment);
        comments.add(savedComment);
        product.setComments(comments);
        productRepository.save(product);
    }

}
