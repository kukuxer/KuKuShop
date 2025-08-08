package kukuxer.KuKushop.controller;


import kukuxer.KuKushop.dto.BasketProductDto;
import kukuxer.KuKushop.dto.QuantityUpdateRequest;
import kukuxer.KuKushop.entity.BasketProduct;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import kukuxer.KuKushop.service.BasketService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/basket")
@RequiredArgsConstructor
public class BasketController {

    private final BasketService basketService;

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable UUID productId,
            @AuthenticationPrincipal Jwt jwt) {
        basketService.deleteProduct(productId, jwt);
        return ResponseEntity.ok().body("Object was successfully deleted");
    }

    @GetMapping("/add/{productId}")
    public ResponseEntity<String> addProduct(
            @PathVariable UUID productId,
            @AuthenticationPrincipal Jwt jwt) {
        basketService.addProduct(productId, jwt);
        return ResponseEntity.ok().body("Object was successfully added");
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(@AuthenticationPrincipal Jwt jwt) {
       List<BasketProductDto> basketProductDtos =  basketService.getAllBasketProducts(jwt);
        return ResponseEntity.ok(basketProductDtos);
    }

    @PutMapping("/update-quantity/{id}")
    public ResponseEntity<BasketProduct> updateQuantity(
            @PathVariable("id") UUID id,
            @RequestBody QuantityUpdateRequest quantity
    ){
        try{
            BasketProduct updatedProduct = basketService.updateQuantity(id, quantity.getQuantity());
            return ResponseEntity.ok(updatedProduct);
        }catch (Exception e){
            return ResponseEntity.status(400).body(null);
        }
    }

}
