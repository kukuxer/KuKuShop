package kukuxer.KuKushop.controller;

import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.service.FavoriteService;
import kukuxer.KuKushop.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final ProfileService profileService;


    @GetMapping("/{productId}")
    public void toggleFavorite(@PathVariable UUID productId, @AuthenticationPrincipal Jwt jwt) {
        String authId = jwt.getClaim("sub");
        Profile user = profileService.getByAuthId(authId).orElseThrow();
        Long id = user.getId();
        favoriteService.toggleFavorite(productId, id);
    }

    @GetMapping("/products")
    public List<ProductDto> getFavoriteProducts(@AuthenticationPrincipal Jwt jwt) {
        String authId = jwt.getClaim("sub");
        Profile user = profileService.getByAuthId(authId).orElseThrow();
        return favoriteService.getFavoriteProducts(user.getId());
    }
}