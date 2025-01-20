package kukuxer.KuKushop.service;

import kukuxer.KuKushop.dto.Mappers.ProfileMapper;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.repository.ProfileRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileService {

    private ProfileRepository profileRepository;

    public Optional<Profile> findByAuthId(String authId) {
        return profileRepository.findByAuthId(authId);
    }
    public Profile createProfile(ProfileDto profileDto) {
        boolean exists = profileRepository.findByAuthId(profileDto.getAuthId()).isPresent();

        if (exists) {
            throw new RuntimeException("Profile with authId " + profileDto.getAuthId() + " already exists");
        }

        Profile profile = ProfileMapper.INSTANCE.toEntity(profileDto);
        return profileRepository.save(profile);
    }
}
