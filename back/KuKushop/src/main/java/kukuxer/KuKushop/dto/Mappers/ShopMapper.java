package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Shop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import org.springframework.web.multipart.MultipartFile;

@Mapper(componentModel = "spring")
public interface ShopMapper {

    ShopMapper INSTANCE = Mappers.getMapper(ShopMapper.class);

    Shop toEntity(ShopDto shopDto);

    @Mapping(source = "rating", target = "rating")
    ShopDto toDto(Shop shop);


}
