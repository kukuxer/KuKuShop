package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.Favorite;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.repository.FavoriteRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public Set<UUID> getFavoriteProductIdsByUserId(Long userId){
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
        List<Favorite> favorites = favoriteRepository.findByUserId(id);
        return favorites.stream()
                .map(fav -> {
                    Product product = fav.getProduct();
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getId());
                    productDto.setName(product.getName());
                    productDto.setPrice(product.getPrice());
                    productDto.setImageUrl(product.getImageUrl());
                    productDto.setFavorite(true);
                    return productDto;
                })
                .toList();
    }
}
