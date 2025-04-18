package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Category;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toEntity(ProductDto dto);

    @Mapping(source = "shopId", target = "shopId")
    ProductDto toDto(Product product);

    static ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    default Set<Category> mapStringsToCategories(Set<String> names) {
        if (names == null) return new HashSet<>();
        return names.stream()
                .map(name -> Category.builder().name(name.toLowerCase().trim()).build())
                .collect(Collectors.toSet());
    }

    default Set<String> mapCategoriesToStrings(Set<Category> categories) {
        if (categories == null) return new HashSet<>();
        return categories.stream()
                .map(Category::getName)
                .collect(Collectors.toSet());
    }
}
