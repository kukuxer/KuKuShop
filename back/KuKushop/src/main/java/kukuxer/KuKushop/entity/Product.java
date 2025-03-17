package kukuxer.KuKushop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "products")
public class Product {


    @Id
    @GeneratedValue
    @UuidGenerator
    UUID id = UUID.randomUUID();

    @Column(nullable = false)
    Long shopId;

    @Column(nullable = false)
    String name;

    @Column(length = 1000)
    String description;

    String price;

    String imageUrl;

    @ElementCollection
    @CollectionTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "id", columnDefinition = "BINARY(16)"))
    @Column(name = "category")
    Set<String> categories;


    double rating;

    int quantity;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime creationDate;
}
