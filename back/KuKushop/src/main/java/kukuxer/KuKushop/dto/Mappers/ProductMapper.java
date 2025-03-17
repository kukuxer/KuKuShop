package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);


    ProductDto toDto(Product product);

    Product toEntity(ProductDto profileDto);
}
