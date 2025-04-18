package kukuxer.KuKushop.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CommentDto {

    Long id;

    UUID productId;
    Long userId;
    String comment;
    Double rating;
    LocalDateTime date;
    String profileImage;
    String username;

}
