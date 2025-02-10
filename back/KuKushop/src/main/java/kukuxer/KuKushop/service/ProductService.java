package kukuxer.KuKushop.service;

import kukuxer.KuKushop.entity.Product;
import kukuxer.KuKushop.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public List<Product> getProductsByShopId(Long id) {
       return productRepository.getAllByShopId(id);
    }
}
