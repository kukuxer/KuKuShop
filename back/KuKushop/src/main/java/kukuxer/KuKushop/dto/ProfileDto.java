package kukuxer.KuKushop.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

@Data
public class ProfileDto {
    private String role;
    private String name;
    private String email;
    private String familyName;
    private String givenName;
    private String nickname;
    @JsonIgnore
    private String authId;
}