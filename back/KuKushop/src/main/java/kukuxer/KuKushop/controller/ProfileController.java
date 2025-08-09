package kukuxer.KuKushop.controller;

import kukuxer.KuKushop.dto.Mappers.ProfileMapper;
import kukuxer.KuKushop.dto.ProductDto;
import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;
import kukuxer.KuKushop.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@AllArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileMapper profileMapper;

    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto) {
        ProfileDto createdProfileDto = profileMapper.INSTANCE.toDto(
                profileService.createProfile(profileDto)
        );
        return ResponseEntity.ok(createdProfileDto);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal Jwt jwt) {
        Profile profile = profileService.getByAuthId(jwt.getClaim("sub"))
                .orElseThrow(() -> new RuntimeException("no user with this authId"));

        return ResponseEntity.ok(profileMapper.toDto(profile));
    }

    @PostMapping("/getOrCreateProfile")
    public ResponseEntity<ProfileDto> getOrCreateProfile(@AuthenticationPrincipal Jwt jwt,
                                                         @RequestBody ProfileDto profileDto) {
        String authId = jwt.getClaim("sub");

        Optional<Profile> optionalProfile = profileService.getByAuthId(authId);
        profileDto.setAuthId(authId);
        if (optionalProfile.isPresent()) {
            ProfileDto profileDtoResponse = profileMapper.toDto(optionalProfile.get());
            return ResponseEntity.ok(profileDtoResponse);
        }
        profileDto.setRole("Guest");
        Profile newProfile = profileService.createProfile(profileDto);
        return ResponseEntity.ok(ProfileMapper.INSTANCE.toDto(newProfile));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestPart("profile") ProfileDto profileDto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
           Profile updatedProfile = profileService.update(profileDto, image, jwt);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }


}
