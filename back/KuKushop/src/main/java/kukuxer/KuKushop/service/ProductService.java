package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ProductMapper;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.entity.Category;
import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.repository.CategoryRepository;
import kukuxer.KuKushop.repository.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final S3Service s3Service;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;


    public List<Product> getProductsByShopId(Long id) {
        return productRepository.getAllByShopId(id);
    }

    public ProductDto createProduct(ProductDto productDto, MultipartFile image,Long shopId) throws IOException {
        if ( image != null && !image.isEmpty()) {
            String fileKey = s3Service.uploadFile(image);
            productDto.setImageUrl(fileKey);
        }
        Product product = ProductMapper.INSTANCE.toEntity(productDto);
        Set<Category> categoryEntities = productDto.getCategories().stream()
                .map(name -> categoryRepository.findByName(name.toLowerCase().trim())
                        .orElseGet(() -> Category.builder()
                                .name(name.toLowerCase().trim())
                                .build()))
                .collect(Collectors.toSet());

        product.setCategories(categoryEntities);
        product.setShopId(shopId);
        System.out.println(product);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }
}
