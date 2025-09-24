package com.group3.be.movie.theater.config;

import com.group3.be.movie.theater.util.SecurityUtil;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
public class JwtConfiguration {
    /*
    * JWT : Header + Payload + Signature : Mỗi phần sẽ được mã hóa bằng Base64 và ngăn cách nhau bằng dấu .
    *
    * Header : Thuật toán mã hóa
    *
    * Payload : Chứa các claims của người dùng (dùng để định danh người dùng)
    *
    * Signature : Secret Key + Thuật toán + (Header + Payload)
    *
    * */


    // Lấy ra private key
    @Value("${movietheater.jwt.base64-secret}")
    private String privateJwtKey;

    // Ghi đè lại method jwtEncoder
    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }


    // Ghi đè lại phương thức getSecretKey để NimbusJwtEncoder biết mình đang sử dụng thuật toán HS512
    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(privateJwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
    }


    // Ghi đè lại jwtDecoder để giải mã token được gửi kèm trong bearer token
    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                System.out.println(">>> JWT error: " + e.getMessage());
                throw e;
            }
        };
    }
    // Khi decode thành công => Lấy permission từ accessToken và set vào JwtGrantedAuthoritiesConverter
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permission");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
