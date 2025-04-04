package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.BasketDto;
import kukuxer.KuKushop.dto.BasketProductDto;
import kukuxer.KuKushop.dto.Mappers.BasketMapper;
import kukuxer.KuKushop.entity.BasketProduct;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.repository.BasketRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import kukuxer.KuKushop.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BasketService {

    private final BasketRepository basketRepository;
    private final ProfileRepository profileRepository;
    private final ProductRepository productRepository;
    private final BasketMapper basketMapper;

    public void deleteProduct(UUID productId, Jwt jwt) {
        Profile profile = getProfile(jwt);

        BasketProduct basketProductByProductIdAndUserId = basketRepository
                .findBasketProductByProductIdAndUserId(
                        productId, profile.getId()
                ).orElseThrow(
                        () -> new RuntimeException(
                                "basket wasn't found with product Id " + productId
                                        + " and user id " + profile.getId()
                        )
                );
        basketRepository.delete(basketProductByProductIdAndUserId);
    }

    public void addProduct(UUID productId, Jwt jwt) {
        Profile profile = getProfile(jwt);
        Product product = productRepository.findById(productId).orElseThrow(RuntimeException::new);

        BasketProduct basket = BasketProduct.builder()
                .id(productId)
                .product(product)
                .quantity(1)
                .userId(profile.getId())
                .build();

        basketRepository.save(basket);
    }

    public List<BasketProductDto> getAllBasketProducts(Jwt jwt) {
        Profile profile = getProfile(jwt);
        List<BasketProduct> baskets = basketRepository.findBasketProductsByUserId(profile.getId());

        return baskets.stream()
                .map(basketProduct -> {
                    Product product = basketProduct.getProduct();
                    BasketProductDto dto = new BasketProductDto();

                    dto.setId(product.getId());
                    dto.setName(product.getName());
                    dto.setDescription(product.getDescription());
                    dto.setPrice(product.getPrice());
                    dto.setImageUrl(product.getImageUrl());
                    dto.setRating(product.getRating());
                    dto.setQuantity(basketProduct.getQuantity());

                    return dto;
                })
                .collect(Collectors.toList());
    }


    private Profile getProfile(Jwt jwt) {
        String authId = jwt.getClaim("sub");
        return profileRepository.findByAuthId(authId).orElseThrow(
                () -> new RuntimeException("User with auth id " + authId + " was not found")
        );
    }

    public BasketProduct updateQuantity(UUID id, int quantity) {
        BasketProduct basketProduct = basketRepository.findBasketProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));;
        if (quantity < 1) {
            throw new RuntimeException("Quantity cannot be less than 1");
        }
        basketProduct.setQuantity(quantity);
        product.setQuantity(quantity);
        return basketRepository.save(basketProduct);
    }
}
