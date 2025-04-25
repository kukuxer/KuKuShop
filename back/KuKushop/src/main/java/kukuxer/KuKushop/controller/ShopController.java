package kukuxer.KuKushop.controller;


import kukuxer.KuKushop.dto.Mappers.ShopMapper;
import kukuxer.KuKushop.dto.ProfileDto;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/shop")
@AllArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final ShopMapper shopMapper;
    private final ProfileService profileService;

    @PostMapping("/create")
    public ResponseEntity<ShopDto> createShop(@AuthenticationPrincipal Jwt jwt,
                                              @ModelAttribute ShopDto shopDto,
                                              @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ShopDto createdShopDto = shopService.createShop(shopDto, jwt.getClaim("sub"), image);
        return ResponseEntity.ok(createdShopDto);
    }

    @GetMapping("/myShopImage")
    public ResponseEntity<String> getShopImage(@AuthenticationPrincipal Jwt jwt) {
        Shop shop = shopService.getByUserAuthId(jwt.getClaim("sub"));

        if (shop.getImageUrl() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                    .body(shop.getImageUrl());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/myShop")
    public ResponseEntity<ShopDto> getMyShopDto(@AuthenticationPrincipal Jwt jwt) {
        Shop shop = shopService.getByUserAuthId(jwt.getClaim("sub"));
        if (shop == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ShopMapper.INSTANCE.toDto(shop));
    }

    @GetMapping("/getByName/{shopName}")
    public ResponseEntity<ShopDto> getByName(@PathVariable String shopName) {
        Shop shop = shopService.getByName(shopName);
        if (shop == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ShopMapper.INSTANCE.toDto(shop));
    }
    @GetMapping("/getById/{id}")
    public ResponseEntity<ShopDto> getById(@PathVariable Long id) {
        Shop shop = shopService.getById(id);
        if (shop == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ShopMapper.INSTANCE.toDto(shop));
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

    @PutMapping("/private/update")
    public ResponseEntity<Boolean> updateShop(
            @AuthenticationPrincipal Jwt jwt,
            @RequestPart("shopPayload") ShopDto shopDto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ){
        try {
            shopService.update(shopDto, image, jwt);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
