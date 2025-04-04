package kukuxer.KuKushop.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BasketProductDto {

    UUID id;

    String name;

    String description;

    String price;

    Set<String> categories = new HashSet<>();

    String imageUrl;

    int quantity;
    double rating;
    boolean favorite;
}
