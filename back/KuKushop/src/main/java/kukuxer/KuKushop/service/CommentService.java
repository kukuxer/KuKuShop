package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.CommentDto;
import kukuxer.KuKushop.dto.Mappers.CommentMapper;
import kukuxer.KuKushop.entity.Comment;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.repository.CommentRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import kukuxer.KuKushop.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final ProductRepository productRepository;
    private final ProfileRepository profileRepository;
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    public void createComment(CommentDto commentDto, Jwt jwt){
        String userAuthId = jwt.getClaim("sub");
        Profile profile = profileRepository.findByAuthId(userAuthId).orElseThrow(
                () -> new RuntimeException("user with auth id"+ userAuthId+" not found.")
        );
        Product product = productRepository.findById(commentDto.getProductId()).orElseThrow(
                () -> new RuntimeException("product with  id" + commentDto.getProductId() + " not found.")
        );

        Comment comment = commentMapper.toEntity(commentDto);

        comment.setUserId(profile.getId());
        comment.setProductId(commentDto.getProductId());
        Comment savedComment = commentRepository.save(comment);

        product.getComments().add(savedComment);
        updateProductRating(product);
        productRepository.save(product);
    }
    @Transactional(readOnly = true)
    public List<CommentDto> getProductCommentsDtoByProductId(UUID uuid) {
        Product product = productRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("No product with this id " + uuid));

        List<CommentDto> commentDtos = product.getComments().stream()
                .map(this::toCommentDto)
                .collect(Collectors.toList());

        return commentDtos;
    }


    private CommentDto toCommentDto(Comment comment) {
        Profile profile = profileRepository.findById(comment.getUserId())
                .orElseThrow(() -> new RuntimeException("User with id " + comment.getUserId() + " not found."));


        CommentDto commentDto = commentMapper.toDto(comment);

        commentDto.setProfileImage(profile.getImageUrl());
        commentDto.setUsername(profile.getName());

        return commentDto;
    }

    private void updateProductRating(Product product){
        float sumRating = 0;
        int productComments = product.getComments().size();
        for(int i=0;i<productComments;i++){
            sumRating+= product.getComments().get(i).getRating();
        }
        product.setRating(Math.round((sumRating / productComments) * 100.0) / 100.0);
    }

}
