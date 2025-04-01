package kukuxer.KuKushop.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BasketProductDto {

    Long id;
    UUID productId;
    Long userId;

}
