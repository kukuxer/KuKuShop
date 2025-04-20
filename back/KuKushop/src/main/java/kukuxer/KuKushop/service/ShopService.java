package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ShopMapper;
import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.repository.ProfileRepository;
import kukuxer.KuKushop.repository.ShopRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final ProfileRepository profileRepository;
    private final S3Service s3Service;


    public ShopDto createShop(ShopDto shopDto, String authId, MultipartFile image) throws IOException {
        boolean exists = shopRepository.findByUserAuthId(authId).isPresent();
        boolean theSameName = shopRepository.findByName(shopDto.getName()).isPresent();
        Profile profile = profileRepository.findByAuthId(authId).orElseThrow();

        if (exists) {
            throw new RuntimeException("User already have a shop");
        } else if (theSameName) {
            throw new RuntimeException("Shop with this name already exists");
        }

        System.out.println(shopDto);

        Shop shop = ShopMapper.INSTANCE.toEntity(shopDto);

        if (image != null && !image.isEmpty()) {
            String fileKey = s3Service.uploadFile(image);
            shop.setImageUrl(fileKey);
        }

        shop.setOwnerName(profile.getName());
        shop.setUserAuthId(authId);
        shopRepository.save(shop);

        return ShopMapper.INSTANCE.toDto(shop);
    }

    public Shop getByUserAuthId(String userAuth) {
        return shopRepository.findByUserAuthId(userAuth)
                .orElseThrow(() -> new RuntimeException("Shop not found for userAuth: " + userAuth));
    }
    public Shop getByName(String shopName) {
        return shopRepository.findByName(shopName)
                .orElseThrow(() -> new RuntimeException("Shop not found for name: " + shopName));
    }

    public Shop getById(Long id) {
       return shopRepository.findById(id).orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
    }
}
