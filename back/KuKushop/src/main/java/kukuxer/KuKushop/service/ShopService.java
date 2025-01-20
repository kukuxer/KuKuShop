package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ShopMapper;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.dto.ShopDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.entity.Shop;
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
    private final JdbcTemplate jdbcTemplate;


    public ShopDto createShop(ShopDto shopDto, String authId, MultipartFile image) {
        boolean exists = shopRepository.findByUserAuthId(authId).isPresent();
        boolean theSameName = shopRepository.findByOwnerName(shopDto.getOwnerName()).isPresent();
        Profile profile = profileRepository.findByAuthId(authId).orElseThrow();

        if (exists) {
            throw new RuntimeException("User already have a shop");
        }
        if (theSameName) {
            throw new RuntimeException("Shop with this name already exists");
        }

        System.out.println(shopDto);
        System.out.println(image);

        Shop shop = ShopMapper.INSTANCE.toEntity(shopDto);
        if (image != null && !image.isEmpty()) {
            try {
                shop.setImage(image.getBytes());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        shop.setOwnerName(profile.getName());
        shop.setUserAuthId(authId);

        System.out.println("Shop entity before save: " + shop);
        try {
            shopRepository.save(shop);
        } catch (Exception e) {
            System.out.println("Error while saving shop: " + e.getMessage());
            throw new RuntimeException("Error saving shop", e);
        }


        return ShopMapper.INSTANCE.toDto(shop);
    }

    @Transactional
    public byte[] getImageFromShop(String authId) throws SQLException, IOException {
        Optional<Long> imageOid = shopRepository.findImageOidByUserAuthId(authId);

        if (imageOid.isPresent()) {
            Long oid = imageOid.get();

            String sql = "SELECT lo_get(?)";
            return jdbcTemplate.queryForObject(sql, byte[].class, oid);
        }
        return null;
    }
}
