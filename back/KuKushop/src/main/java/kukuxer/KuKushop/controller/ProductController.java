package kukuxer.KuKushop.controller;

import kukuxer.KuKushop.dto.Mappers.ProductMapper;
import kukuxer.KuKushop.dto.Mappers.ProfileMapper;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.service.FavoriteService;
import kukuxer.KuKushop.service.ProductService;
import kukuxer.KuKushop.service.ProfileService;
import kukuxer.KuKushop.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


@Controller
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ShopService shopService;
    private final ProductMapper productMapper;
    private final ProfileService profileService;
    private final FavoriteService favoriteService;

    @GetMapping("/getMyProducts")
    public ResponseEntity<?> getMyProducts(@AuthenticationPrincipal Jwt jwt) {
        String authId = jwt.getClaim("sub");
        Profile user = profileService.getByAuthId(authId)
                .orElseThrow(()->new RuntimeException("User not found"));
        Shop shop = shopService.getByUserAuthId(authId);
        List<Product> products = productService.getProductsByShopId(shop.getId());
        Set<UUID> favoriteProductIds = favoriteService.getFavoriteProductIdsByUserId(user.getId());

        List<ProductDto> productDtos = products.stream()
                .map(product ->{
                    ProductDto dto = productMapper.toDto(product);
                    dto.setFavorite(favoriteProductIds.contains(product.getId()));
                    return dto;
                })
                .collect(Collectors.toList());

        if (productDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(productDtos);
    }
    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@AuthenticationPrincipal Jwt jwt,
                                           @ModelAttribute ProductDto productDto,
                                           @RequestPart(value = "image",required = false) MultipartFile image) throws IOException {

        Shop shop = shopService.getByUserAuthId(jwt.getClaim("sub"));
        ProductDto productDtoResponse = productService.createProduct(productDto,image,shop.getId());
        return ResponseEntity.ok(productDtoResponse);
    }
}

