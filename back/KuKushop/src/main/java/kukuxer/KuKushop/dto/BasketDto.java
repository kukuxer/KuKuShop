package kukuxer.KuKushop.dto;

import kukuxer.KuKushop.entity.BasketProduct;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BasketDto {

    List<BasketProduct> basketProducts;
    Long fullPrice;

}
