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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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


    /* ---------------------------------------------------
     * PRODUCT CRUD
     * --------------------------------------------------- */

    public Page<ProductDto> getProducts(Pageable pageable,
                                        int numberOfProducts,
                                        String name,
                                        List<String> categoryNames,
                                        Jwt jwt) {

        Page<Product> page;


        if (categoryNames != null && !categoryNames.isEmpty()) {
            categoryNames = categoryNames.stream()
                    .map(String::toLowerCase)
                    .toList();
        }

        boolean hasCategories = categoryNames != null && !categoryNames.isEmpty();

        if (hasCategories) {
            page = productRepository.findByNameAndCategories(name, categoryNames, pageable);
        } else {
            page = productRepository.findByName(name, pageable);
        }

        // Limit results
        List<ProductDto> content = page.getContent().stream()
                .limit(numberOfProducts)
                .map(productMapper::toDto)
                .toList();

        // Optional JWT info
        if (jwt != null) {
            content = applyUserFlagsToList(content, jwt);
        }

        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    public List<Product> getProductsByShopId(Long id) {
        return productRepository.getAllByShopId(id);
    }



    public ProductDto createProduct(ProductDto productDto, MultipartFile image,
                                    MultipartFile[] additionalImages, Long shopId) throws IOException {

        if (image != null && !image.isEmpty()) {
            productDto.setImageUrl(s3Service.uploadFile(image));
        }

        if (additionalImages != null) {
            List<String> files = new ArrayList<>();
            for (MultipartFile file : additionalImages) {
                if (!file.isEmpty()) {
                    files.add(s3Service.uploadFile(file));
                }
            }
            productDto.setAdditionalPictures(files);
        }

        Product product = ProductMapper.INSTANCE.toEntity(productDto);
        product.setCategories(resolveCategories(productDto.getCategories()));
        product.setShopId(shopId);

        return productMapper.toDto(productRepository.save(product));
    }

    public ProductDto getProductDtoById(UUID id, Jwt jwt) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No product with id " + id));

        ProductDto dto = productMapper.toDto(product);

        return applyUserFlagsToDto(dto, jwt);
    }

    public List<ProductDto> getShopProductsDtoByName(String shopName, Jwt jwt) {

        Shop shop = shopService.getByName(shopName);
        List<Product> products = getProductsByShopId(shop.getId());

        return applyUserFlagsToList(
                products.stream()
                        .map(productMapper::toDto)
                        .collect(Collectors.toList()),
                jwt
        );
    }


    /* ---------------------------------------------------
     * UPDATE
     * --------------------------------------------------- */

    @Transactional
    public void update(ProductDto productDto, UUID productId, MultipartFile image,
                       MultipartFile[] extraImages, Jwt jwt) throws IOException {

        Profile profile = profileService.requireProfile(jwt);
        Product product = requireProduct(productId);
        Shop shop = shopService.requireShop(product.getShopId());

        if (!isOwner(shop, profile)) {
            throw new RuntimeException("User does not own this product.");
        }

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());
        product.setAdditionalPictures(productDto.getAdditionalPictures());

        if (productDto.getImageUrl().isEmpty()) {
            product.setImageUrl(null);
        }

        if (image != null && !image.isEmpty()) {
            product.setImageUrl(s3Service.uploadFile(image));
        }

        if (extraImages != null && extraImages.length > 0) {
            List<String> files = new ArrayList<>();
            for (MultipartFile file : extraImages) {
                if (!file.isEmpty()) {
                    files.add(s3Service.uploadFile(file));
                }
            }
            product.setAdditionalPictures(files);
        }

        product.setCategories(resolveCategories(productDto.getCategories()));
        productRepository.save(product);
    }


    /* ---------------------------------------------------
     * DELETE
     * --------------------------------------------------- */

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


    /* ---------------------------------------------------
     * TOP PRODUCTS
     * --------------------------------------------------- */

    public List<ProductDto> findTopProducts(int number) {
        return productRepository.findTop3ByRating(PageRequest.of(0, number))
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }


    /* ---------------------------------------------------
     * HELPERS
     * --------------------------------------------------- */

    private Set<Category> resolveCategories(Set<String> names) {
        return names.stream()
                .map(name -> {
                    String clean = name.toLowerCase().trim();
                    return categoryRepository.findByName(clean)
                            .orElseGet(() -> categoryRepository.save(Category.builder()
                                    .name(clean)
                                    .build()));
                })
                .collect(Collectors.toSet());
    }



    public Product requireProduct(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }


    public boolean isOwner(Shop shop, Profile profile) {
        return shop.getUserAuthId().equals(profile.getAuthId());
    }

    private boolean isProductOwner(UUID productId, Jwt jwt) {
        try {
            Profile profile = profileService.requireProfile(jwt);
            Product product = requireProduct(productId);
            Shop shop = shopService.requireShop(product.getShopId());
            return isOwner(shop, profile);
        } catch (Exception e) {
            return false;
        }
    }

    /* ---------------------------------------------------
     * DTO ENRICHMENT
     * --------------------------------------------------- */

    private ProductDto applyUserFlagsToDto(ProductDto dto, Jwt jwt) {

        if (jwt == null) return dto;

        Long userId = profileService.extractUserId(jwt);
        if (userId == null) return dto;

        Shop shop = shopService.getById(dto.getShopId());

        dto.setInBasket(basketService.isInBasket(dto.getId(), userId));
        dto.setFavorite(favoriteService.isFavorite(dto.getId(), userId));
        dto.setOwner(jwt.getClaim("sub").equals(shop.getUserAuthId()));

        return dto;
    }

    private List<ProductDto> applyUserFlagsToList(List<ProductDto> list, Jwt jwt) {

        if (jwt == null) return list;

        Profile profile = profileService.requireProfile(jwt);
        long userId = profile.getId();
        String authId = profile.getAuthId();

        return list.stream()
                .map(dto -> {
                    Shop shop = shopService.getById(dto.getShopId());
                    dto.setFavorite(favoriteService.isFavorite(dto.getId(), userId));
                    dto.setInBasket(basketService.isInBasket(dto.getId(), userId));
                    dto.setOwner(authId.equals(shop.getUserAuthId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
