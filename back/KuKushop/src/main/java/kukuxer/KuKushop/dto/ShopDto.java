package kukuxer.KuKushop.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShopDto {
     String name;
     String ownerName;
     String description;
     String imageUrl;

}
