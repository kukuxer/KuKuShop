package kukuxer.KuKushop.controller;


import kukuxer.KuKushop.dto.Mappers.ShopMapper;
import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.service.ProfileService;
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
    private final ProfileService profileService;

    @PostMapping("/create")
    public ResponseEntity<ShopDto> createShop(@AuthenticationPrincipal Jwt jwt,
                                              @ModelAttribute ShopDto shopDto,
                                              @RequestPart(value = "image",required = false) MultipartFile image) throws IOException {

        ShopDto createdShopDto = shopService.createShop(shopDto, jwt.getClaim("sub"), image);


        return ResponseEntity.ok(createdShopDto);
    }
    @GetMapping("/myShopImage")
    public ResponseEntity<byte[]> getShopImage(@AuthenticationPrincipal Jwt jwt) throws SQLException, IOException {
        Shop shop = shopService.getByUserAuthId(jwt.getClaim("sub"));
        byte[] imageBytes = shopService.getShopImageData(shop);

        if (imageBytes != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                    .body(imageBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/doUserOwnAShop")
    public ResponseEntity<Boolean> checkIfUserOwnAShop(@AuthenticationPrincipal Jwt jwt) {
    boolean ownAShop = profileService.checkIfUserOwnAShop(jwt.getClaim("sub"));
        if (ownAShop) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }
}
