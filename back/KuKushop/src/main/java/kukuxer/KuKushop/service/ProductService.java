package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ProductMapper;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.dto.BasketProductDto;
import kukuxer.KuKushop.entity.Category;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.repository.CategoryRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final S3Service s3Service;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;
    private final ShopService shopService;
    private final FavoriteService favoriteService;
    private final BasketService basketService;


    public List<Product> getProductsByShopId(Long id) {
        return productRepository.getAllByShopId(id);
    }

    public ProductDto createProduct(ProductDto productDto, MultipartFile image, Long shopId) throws IOException {
        if (image != null && !image.isEmpty()) {
            String fileKey = s3Service.uploadFile(image);
            productDto.setImageUrl(fileKey);
        }
        Product product = ProductMapper.INSTANCE.toEntity(productDto);
        Set<Category> categoryEntities = productDto.getCategories().stream()
                .map(name -> categoryRepository.findByName(name.toLowerCase().trim())
                        .orElseGet(() -> Category.builder()
                                .name(name.toLowerCase().trim())
                                .build()))
                .collect(Collectors.toSet());

        product.setCategories(categoryEntities);
        product.setShopId(shopId);
        System.out.println(product);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }
    public List<ProductDto> getShopProductsByName(String shopName, Jwt jwt) {
        Long userId = extractUserId(jwt);
        Shop shop = shopService.getByName(shopName);
        List<Product> products = getProductsByShopId(shop.getId());

        final Set<UUID> favoriteProductIds;
        final Set<UUID> basketProductIds;

        if (userId != null) {
            favoriteProductIds = new HashSet<>(favoriteService.getFavoriteProductIdsByUserId(userId));
            basketProductIds = basketService.getAllBasketProducts(jwt)
                    .stream()
                    .map(BasketProductDto::getId)
                    .collect(Collectors.toSet());
        } else {
            favoriteProductIds = Collections.emptySet();
            basketProductIds = Collections.emptySet();
        }

        return products.stream()
                .map(product -> {
                    ProductDto dto = productMapper.toDto(product);
                    dto.setFavorite(favoriteProductIds.contains(product.getId()));
                    dto.setInBasket(basketProductIds.contains(product.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private Long extractUserId(Jwt jwt) {
        if (jwt == null) return null;
        String authId = jwt.getClaim("sub");

        return profileService.getByAuthId(authId)
                .map(Profile::getId)
                .orElse(null);
    }
}
