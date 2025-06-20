package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.BasketProductDto;
import kukuxer.KuKushop.dto.Mappers.ProductMapper;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.Category;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.repository.CategoryRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import kukuxer.KuKushop.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final ShopRepository shopRepository;


    public List<Product> getProductsByShopId(Long id) {
        return productRepository.getAllByShopId(id);
    }

    public ProductDto createProduct(ProductDto productDto, MultipartFile image, MultipartFile[] additionalImages, Long shopId) throws IOException {
        List<String> fileKeys = new ArrayList<>();
        if (image != null && !image.isEmpty()) {
            String fileKey = s3Service.uploadFile(image);
            productDto.setImageUrl(fileKey);
        }
        if (additionalImages != null) {
            for (MultipartFile additionalImage : additionalImages) {
                fileKeys.add(s3Service.uploadFile(additionalImage));
            }
            productDto.setAdditionalPictures(fileKeys);
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

    public ProductDto getProductDtoById(UUID uuid, Jwt jwt) {
        Long userId = profileService.extractUserId(jwt);
        Product product = productRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("no product with this id" + uuid));


        ProductDto productDto = productMapper.toDto(product);

        if (userId == null) {
            return productDto;
        }

        productDto.setInBasket(basketService.isInBasket(product.getId(), userId));
        productDto.setFavorite(favoriteService.isFavorite(product.getId(), userId));
        Shop shop = shopService.getById(product.getShopId());
        if (jwt.getClaim("sub").equals(shop.getUserAuthId())) {
            productDto.setOwner(true);
        }
        return productDto;
    }

    public List<ProductDto> getShopProductsDtoByName(String shopName, Jwt jwt) {
        Long userId = profileService.extractUserId(jwt);
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

    @Transactional
    public void update(ProductDto productDto, UUID productId, MultipartFile image,
                       MultipartFile[] additionalImages, Jwt jwt) throws IOException {

        Profile profile = profileService.getByAuthId(jwt.getClaim("sub"))
                .orElseThrow(() -> new RuntimeException("User not found: " + jwt.getClaim("sub")));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        Shop shop = shopRepository.findById(product.getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found: " + product.getShopId()));

        if (!shop.getUserAuthId().equals(profile.getAuthId())) {
            throw new RuntimeException("User doesn't own this product to change");
        }

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());
        product.setAdditionalPictures(productDto.getAdditionalPictures());

        if (productDto.getImageUrl().isEmpty()) product.setImageUrl(null);

        if (image != null && !image.isEmpty()) {
            product.setImageUrl(s3Service.uploadFile(image));
        } else {
            product.setImageUrl(productDto.getImageUrl());
        }

        if (additionalImages != null && additionalImages.length > 0) {
            List<String> uploadedFiles = new ArrayList<>();
            for (MultipartFile additionalImage : additionalImages) {
                if (additionalImage != null && !additionalImage.isEmpty()) {
                    uploadedFiles.add(s3Service.uploadFile(additionalImage));
                }
            }
            product.setAdditionalPictures(uploadedFiles);
        }

        Set<Category> categoryEntities = productDto.getCategories().stream()
                .map(name -> {
                    String cleanName = name.toLowerCase().trim();
                    return categoryRepository.findByName(cleanName)
                            .orElseGet(() -> categoryRepository.save(Category.builder()
                                    .name(cleanName)
                                    .build()));
                })
                .collect(Collectors.toSet());
        product.setCategories(categoryEntities);

        productRepository.save(product);
    }

    public List<ProductDto> findTopProducts(int number) {
        List<Product> top3ByRating = productRepository.findTop3ByRating(PageRequest.of(0, number));
        List<ProductDto> top3ByRatingDto = new ArrayList<>();
        top3ByRating.forEach(p -> top3ByRatingDto.add(
                productMapper.toDto(p))
        );
        return top3ByRatingDto;
    }

    public ResponseEntity<?> delete(UUID id, Jwt jwt) {
        if (!isProductOwner(id, jwt)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to delete this product.");
        }

        if (!productRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found.");
        }

        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully.");
    }


    private boolean isProductOwner(UUID productId, Jwt jwt) {
        try {
            Profile profile = profileService.getByAuthId(jwt.getClaim("sub"))
                    .orElseThrow(() -> new RuntimeException("User not found: " + jwt.getClaim("sub")));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            Shop shop = shopRepository.findById(product.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found: " + product.getShopId()));

            if (!shop.getUserAuthId().equals(profile.getAuthId())) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
