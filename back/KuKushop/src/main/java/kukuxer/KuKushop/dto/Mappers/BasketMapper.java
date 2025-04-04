package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.BasketProductDto;
import kukuxer.KuKushop.entity.BasketProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BasketMapper extends Mappable<BasketProduct, BasketProductDto> {

    BasketProductDto toBasketProductDto(BasketProduct basketProduct);

    List<BasketProductDto> toBasketProductDto(List<BasketProduct> basketProducts);

}
