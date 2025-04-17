package kukuxer.KuKushop.dto;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.JoinColumn;
import kukuxer.KuKushop.entity.Category;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDto {
    UUID id;

    Long shopId;

    String name;

    String description;

    String price;

    Set<String> categories = new HashSet<>();

    String imageUrl;

    int quantity;
    double rating;
    boolean favorite;
    boolean inBasket;
}
