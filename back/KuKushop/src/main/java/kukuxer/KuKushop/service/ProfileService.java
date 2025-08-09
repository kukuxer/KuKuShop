package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ProductMapper;
import kukuxer.KuKushop.dto.Mappers.ProfileMapper;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.entity.Shop;
import kukuxer.KuKushop.repository.ProfileRepository;
import kukuxer.KuKushop.repository.ShopRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ShopRepository shopRepository;
    private final ProfileMapper profileMapper;
    private final S3Service s3Service;

    public Optional<Profile> getByAuthId(String authId) {
        return profileRepository.findByAuthId(authId);
    }

    public Profile createProfile(ProfileDto profileDto) {
        boolean exists = profileRepository.findByAuthId(profileDto.getAuthId()).isPresent();

        if (exists) {
            throw new RuntimeException("Profile with authId " + profileDto.getAuthId() + " already exists");
        }

        Profile profile = profileMapper.toEntity(profileDto);
        return profileRepository.save(profile);
    }

    public boolean checkIfUserOwnAShop(String userAuth) {
        return shopRepository.findByUserAuthId(userAuth).isPresent();
    }

    public Profile update(ProfileDto profileDto, MultipartFile image, Jwt jwt) throws IOException {
        Profile profile = profileRepository.findByAuthId(jwt.getClaim("sub"))
                .orElseThrow(() -> new RuntimeException("No such profile with authId:" + jwt.getClaim("sub")));

        if (image != null && !image.isEmpty()) {
            String fileKey = s3Service.uploadFile(image);
            profile.setImageUrl(fileKey);
        }
        if (profileDto.getName().equals("admin")) profile.setRole("admin");
        profile.setName(profileDto.getName());
        profile.setFamilyName(profileDto.getFamilyName());
        profile.setNickname(profileDto.getNickname());
        return profileRepository.save(profile);
    }

    public Long extractUserId(Jwt jwt) {
        if (jwt == null) return null;
        String authId = jwt.getClaim("sub");

        return getByAuthId(authId)
                .map(Profile::getId)
                .orElse(null);
    }
}
