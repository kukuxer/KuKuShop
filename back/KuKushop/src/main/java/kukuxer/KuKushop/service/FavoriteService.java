package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.BasketProductDto;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.BasketProduct;
import kukuxer.KuKushop.entity.Favorite;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.repository.BasketRepository;
import kukuxer.KuKushop.repository.FavoriteRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final BasketRepository basketRepository;

    public Set<UUID> getFavoriteProductIdsByUserId(Long userId) {
        List<Favorite> favoritesByUserId = favoriteRepository.findFavoritesByUserId(userId);
        Set<UUID> favoriteProductIds = new HashSet<>();
        favoritesByUserId.forEach(
                f -> favoriteProductIds.add(f.getProduct().getId())
        );
        return favoriteProductIds;
    }

    public void toggleFavorite(UUID productId, Long id) {
        Optional<Favorite> favorite = favoriteRepository.findByUserIdAndProductId(id, productId);
        if (favorite.isPresent()) {
            favoriteRepository.delete(favorite.get());
        } else {
            Favorite newFavorite = new Favorite();
            newFavorite.setUserId(id);
            Product product = productRepository.findById(productId).orElseThrow();
            newFavorite.setProduct(product);
            favoriteRepository.save(newFavorite);
        }
    }

    public List<ProductDto> getFavoriteProducts(Long id) {
        List<BasketProduct> baskets = basketRepository.findBasketProductsByUserId(id);
        List<Favorite> favorites = favoriteRepository.findByUserId(id);

        List<UUID> basketProductsId = baskets.stream()
                .map(BasketProduct::getId)
                .toList();


        return favorites.stream()
                .map(fav -> {
                    Product product = fav.getProduct();
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getId());
                    productDto.setName(product.getName());
                    productDto.setPrice(product.getPrice());
                    productDto.setImageUrl(product.getImageUrl());
                    productDto.setFavorite(true);
                    productDto.setInBasket(basketProductsId.contains(product.getId()));
                    return productDto;
                })
                .toList();
    }
}
