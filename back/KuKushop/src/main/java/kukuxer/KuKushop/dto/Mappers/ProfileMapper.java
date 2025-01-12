package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;

public class ProfileMapper {

    public static Profile toEntity(ProfileDto dto) {
        if (dto == null) {
            return null;
        }

        return Profile.builder()
                .name(dto.getName())
                .role(dto.getRole())
                .email(dto.getEmail())
                .familyName(dto.getFamilyName())
                .givenName(dto.getGivenName())
                .nickname(dto.getNickname())
                .authId(dto.getAuthId())
                .build();
    }

    public static ProfileDto toDto(Profile entity) {
        if (entity == null) {
            return null;
        }

        ProfileDto dto = new ProfileDto();
        dto.setName(entity.getName());
        dto.setRole(entity.getRole());
        dto.setFamilyName(entity.getFamilyName());
        dto.setGivenName(entity.getGivenName());
        dto.setNickname(entity.getNickname());
        dto.setEmail(entity.getEmail());


        return dto;
    }
}
