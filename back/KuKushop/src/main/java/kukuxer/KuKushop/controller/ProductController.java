package kukuxer.KuKushop.controller;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.service.*;
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

import java.util.UUID;



@Controller
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ShopService shopService;

    @GetMapping("/getMyProducts")
    public ResponseEntity<?> getMyProducts(@AuthenticationPrincipal Jwt jwt) {
        Shop shop = shopService.getByUserAuthId(jwt.getClaim("sub"));
        List<ProductDto> productDtos = productService.getShopProductsDtoByName(shop.getName(), jwt);

        if (productDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(productDtos);
    }
    @GetMapping("/getShopProducts/{shopName}")
    public ResponseEntity<?> getShopProducts(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String shopName) {

        List<ProductDto> productDtos = productService.getShopProductsDtoByName(shopName, jwt);

        if (productDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(productDtos);
    }


    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@AuthenticationPrincipal Jwt jwt,
                                           @ModelAttribute ProductDto productDto,
                                           @RequestPart(value = "image", required = false) MultipartFile image,
                                           @RequestPart(value = "additionalImages", required = false) MultipartFile[] additionalImages
                                           ) throws IOException {

        Shop shop = shopService.getByUserAuthId(jwt.getClaim("sub"));
        ProductDto productDtoResponse = productService.createProduct(productDto, image, additionalImages, shop.getId());
        return ResponseEntity.ok(productDtoResponse);
    }

    @GetMapping("/getProduct/{productId}")
    public ResponseEntity<?> getProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {

       ProductDto productDto = productService.getProductDtoById(productId,jwt);
        return ResponseEntity.ok(productDto);
    }



}

