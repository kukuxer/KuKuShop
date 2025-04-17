package kukuxer.KuKushop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.context.annotation.Lazy;

import java.time.LocalDateTime;
import java.util.*;

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
    UUID id;

    @Column(nullable = false)
    Long shopId;

    @Column(nullable = false)
    String name;

    @Column(length = 1000)
    String description;

    String price;

    String imageUrl;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "product_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    Set<Category> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "product_comment",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "comment_id")
    )
    List<Comment> comments = new ArrayList<>();


    double rating;

    int quantity;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime creationDate;

    @ElementCollection
    @CollectionTable(name = "product_additional_pictures", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "picture_url")
    List<String> additionalPictures;
}
