package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ShopMapper;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Image;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.repository.ImageRepository;
import kukuxer.KuKushop.repository.ProfileRepository;
import kukuxer.KuKushop.repository.ShopRepository;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Base64;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final ProfileRepository profileRepository;
    private final ImageRepository imageRepository;


    public ShopDto createShop(ShopDto shopDto, String authId, MultipartFile image) throws IOException {
        boolean exists = shopRepository.findByUserAuthId(authId).isPresent();
        boolean theSameName = shopRepository.findByOwnerName(shopDto.getOwnerName()).isPresent();
        Profile profile = profileRepository.findByAuthId(authId).orElseThrow();

        if (exists) {
            throw new RuntimeException("User already have a shop");
        } else if (theSameName) {
            throw new RuntimeException("Shop with this name already exists");
        }

        System.out.println(shopDto);

        Shop shop = ShopMapper.INSTANCE.toEntity(shopDto);

        if (!image.isEmpty()) {
            Image image1 = Image.builder()
                    .name(image.getOriginalFilename())
                    .type(image.getContentType())
                    .data(image.getBytes())
                    .build();

            Image savedImage = imageRepository.save(image1);
            shop.setImageId(savedImage.getId());
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
    public byte[] getShopImageData(Shop shop){
     return imageRepository.findById(shop.getImageId()).orElseThrow(() -> new RuntimeException("Image not found for shop: " + shop.getName())).getData();
    }
}
