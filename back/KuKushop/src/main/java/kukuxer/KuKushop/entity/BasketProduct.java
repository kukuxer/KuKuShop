package kukuxer.KuKushop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;


@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "basket_product")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BasketProduct {

    @Id
    UUID id;

    Long userId;

    int quantity;

    @ManyToOne
    Product product;
}
