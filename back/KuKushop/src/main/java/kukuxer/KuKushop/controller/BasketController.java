package kukuxer.KuKushop.controller;


import kukuxer.KuKushop.dto.BasketProductDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import kukuxer.KuKushop.service.BasketService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/basket")
@RequiredArgsConstructor
public class BasketController {

    private final BasketService basketService;

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable UUID productId,
            @AuthenticationPrincipal Jwt jwt)
    {
        basketService.deleteProduct(productId, jwt);
        return ResponseEntity.ok().body("Object was successfully deleted");
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addProduct(
            @PathVariable UUID productId,
            @AuthenticationPrincipal Jwt jwt)
    {
        basketService.addProduct(productId, jwt);
        return ResponseEntity.ok().body("Object was successfully added");
    }

    @GetMapping("/products")
    public List<BasketProductDto> getAllProducts(@AuthenticationPrincipal Jwt jwt){
        return basketService.getAllBasketProducts(jwt);
    }

}
