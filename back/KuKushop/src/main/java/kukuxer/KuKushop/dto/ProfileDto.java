package kukuxer.KuKushop.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileDto {
     String role;
     String name;
     String email;
     String familyName;
     String givenName;
     String nickname;
     String imageUrl;
    @JsonIgnore
     String authId;
}