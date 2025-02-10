package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.ProfileDto;
import kukuxer.KuKushop.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);


    ProfileDto toDto(Profile profile);

    Profile toEntity(ProfileDto profileDto);
}
