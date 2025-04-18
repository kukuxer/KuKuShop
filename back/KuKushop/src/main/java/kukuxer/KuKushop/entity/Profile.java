package kukuxer.KuKushop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    String imageUrl;

    @Column(unique = true)
    String email;

    @Column(unique = true)
    String authId;
    @CreationTimestamp
    LocalDateTime creationDate;
}
