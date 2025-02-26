package kukuxer.KuKushop.dto;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.JoinColumn;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;
import java.util.UUID;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDto {
    UUID id;

    String name;

    String description;

    String price;

    Set<String> categories;

     String imageUrl;


    double rating;

    int quantity;

}
