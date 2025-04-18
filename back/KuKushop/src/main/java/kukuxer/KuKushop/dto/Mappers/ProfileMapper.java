package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);


    @Mapping(source = "imageUrl", target = "imageUrl")
    ProfileDto toDto(Profile profile);

    @Mapping(source = "imageUrl", target = "imageUrl")
    Profile toEntity(ProfileDto profileDto);
}
