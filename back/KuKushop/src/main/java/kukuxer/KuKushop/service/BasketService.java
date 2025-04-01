package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.BasketDto;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BasketService {

    private final BasketRepository basketRepository;
    private final ProfileRepository profileRepository;
    private final ProductRepository productRepository;

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
                .product(product)
                .userId(profile.getId())
                .build();

        basketRepository.save(basket);
    }

    public BasketDto getAllBasketProducts(Jwt jwt) {
        Profile profile = getProfile(jwt);
        List<BasketProduct> baskets = basketRepository.findBasketProductsByUserId(profile.getId());
        long fullPrice = 0l;
        for (BasketProduct basket : baskets) {
            fullPrice += Long.parseLong(basket.getProduct().getPrice());
        }
        return BasketDto.builder()
                .basketProducts(baskets)
                .fullPrice(fullPrice)
                .build();
    }


    private Profile getProfile(Jwt jwt) {
        String authId = jwt.getClaim("sub");
        return profileRepository.findByAuthId(authId).orElseThrow(
                () -> new RuntimeException("User with auth id " + authId + " was not found")
        );
    }

}
