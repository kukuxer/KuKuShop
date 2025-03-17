package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ProductMapper;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final S3Service s3Service;
    private final ProductMapper productMapper;


    public List<Product> getProductsByShopId(Long id) {
        return productRepository.getAllByShopId(id);
    }

    public ProductDto createProduct(ProductDto productDto, MultipartFile image,Long shopId) throws IOException {
        if ( image != null && !image.isEmpty()) {
            String fileKey = s3Service.uploadFile(image);
            productDto.setImageUrl(fileKey);
        }
        Product product = ProductMapper.INSTANCE.toEntity(productDto);
        Set<String> categories = new HashSet<>();
        for (String category : productDto.getCategories()) {
            categories.add(category.trim().toLowerCase());
        }
        UUID generatedId = UUID.randomUUID();
        System.out.println("Generated UUID: " + generatedId);

        product.setCategories(categories);
        product.setShopId(shopId);
        System.out.println(product);
        productRepository.save(product);
        return productDto;
    }
}
