package kukuxer.KuKushop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column
    String role;

    String familyName;
    String givenName;
    String name;
    String nickname;

    @Column(unique = true)
    String email;

    @Column(unique = true)
    String authId;
}
