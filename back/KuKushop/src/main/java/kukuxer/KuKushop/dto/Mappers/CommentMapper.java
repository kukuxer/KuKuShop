package kukuxer.KuKushop.dto.Mappers;

import kukuxer.KuKushop.dto.CommentDto;
import kukuxer.KuKushop.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    Comment toEntity(CommentDto dto);

    CommentDto toDto(Comment comment);
}

