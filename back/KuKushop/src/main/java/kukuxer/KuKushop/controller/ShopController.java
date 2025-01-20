package kukuxer.KuKushop.controller;


import kukuxer.KuKushop.dto.Mappers.ShopMapper;
import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.service.ShopService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/shop")
@AllArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping("/create")
    public ResponseEntity<ShopDto> createShop(@AuthenticationPrincipal Jwt jwt,
                                              @ModelAttribute ShopDto shopDto,
                                              @RequestPart(value = "image",required = false) MultipartFile image) {

        System.out.println("Image file name: " + (image != null ? image.getOriginalFilename() : "No image provided"));
        System.out.println("Image size: " + (image != null ? image.getSize() : "0"));
        ShopDto createdShopDto = shopService.createShop(shopDto, jwt.getClaim("sub"), image);


        return ResponseEntity.ok(createdShopDto);
    }
    @GetMapping("/myShopImage")
    public ResponseEntity<byte[]> getShopImage(@AuthenticationPrincipal Jwt jwt) throws SQLException, IOException {
        byte[] imageBytes = shopService.getImageFromShop(jwt.getClaim("sub"));

        if (imageBytes != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                    .body(imageBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
