package kukuxer.KuKushop.controller;

import kukuxer.KuKushop.dto.Mappers.ProfileMapper;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@AllArgsConstructor
public class ProfileController {

    private ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto) {
        ProfileDto createdProfileDto = ProfileMapper.toDto(
                profileService.createProfile(profileDto)
        );
        return ResponseEntity.ok(createdProfileDto);
    }

    @PostMapping("/get")
    public ResponseEntity<ProfileDto> getOrCreateProfile(@AuthenticationPrincipal Jwt jwt,@RequestBody ProfileDto profileDto) {
        String authId = jwt.getClaim("sub");

        Optional<Profile> optionalProfile = profileService.findByAuthId(authId);
        profileDto.setAuthId(authId);
        System.out.println(profileDto.toString());
        if (optionalProfile.isPresent()) {
            ProfileDto profileDtoResponse = ProfileMapper.toDto(optionalProfile.get());
            return ResponseEntity.ok(profileDtoResponse);
        }
        // if profile doesn't exist, -> create one
        profileDto.setRole("Guest");
        Profile newProfile = profileService.createProfile(profileDto);
        return ResponseEntity.ok(ProfileMapper.toDto(newProfile));
    }
}
