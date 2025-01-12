package kukuxer.KuKushop.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import kukuxer.KuKushop.utils.JwtDecoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint(@RequestHeader(value = "Authorization")String token) {
        String admin = JwtDecoder.payloadJWTExtraction(token, "email");
        System.out.println(admin);
        return "This is a public endpoint";
    }

    @GetMapping("/protected")
    public String getProtectedData(@AuthenticationPrincipal Jwt jwt) {
        // Extract the user's email from the JWT token
        String email = jwt.getClaim("sub");
        System.out.println(jwt.getClaims());
        return "Your email is: " + email;
    }
}
