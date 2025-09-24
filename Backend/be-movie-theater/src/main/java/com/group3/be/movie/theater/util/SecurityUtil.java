package com.group3.be.movie.theater.util;

import com.group3.be.movie.theater.domain.account.dto.ResLoginDTO;
import com.nimbusds.jose.util.Base64;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class SecurityUtil {
    private final JwtEncoder jwtEncoder;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    // Thuật toán dùng để mã hóa
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    // Lấy ra private key
    @Value("${movietheater.jwt.base64-secret}")
    private String privateJwtKey;

    // Lấy ra thời gian access token hết hạn
    @Value("${movietheater.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    // Lấy ra thời gian refresh token hết hạn
    @Value("${movietheater.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    // create a new access token
    public String createAccessToken(String email, ResLoginDTO resLoginDTO) {
        // Thông tin của account
        ResLoginDTO.AccountInsideToken accountToken = new ResLoginDTO.AccountInsideToken();
        accountToken.setAccountId(resLoginDTO.getUserLogin().getAccountId());
        accountToken.setEmail(resLoginDTO.getUserLogin().getEmail());
        accountToken.setFullName(resLoginDTO.getUserLogin().getFullName());
        // Lấy thời gian hiện tại
        Instant now = Instant.now();
        // Tạo 1 biến lưu thời gian hết hạn của token bằng cách : tgian hiện tại  + thời gian hết hạn của token (accessTokenExpiration)
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);
        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                // Token được generation ra tại khi nào
                .issuedAt(now)
                // Set thời gian hết hạn cho token
                .expiresAt(validity)
                .subject(email)
                .claim("account", accountToken)
//                .claims("permission")
                .build();
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,
                claims)).getTokenValue();
    }

    // create a new refresh token
    public String refreshToken(String email, ResLoginDTO resLoginDTO) {
        // Thông tin của account
        ResLoginDTO.AccountInsideToken accountToken = new ResLoginDTO.AccountInsideToken();
        accountToken.setAccountId(resLoginDTO.getUserLogin().getAccountId());
        accountToken.setEmail(resLoginDTO.getUserLogin().getEmail());
        accountToken.setFullName(resLoginDTO.getUserLogin().getFullName());
        // Lấy thời gian hiện tại
        Instant now = Instant.now();
        // Tạo 1 biến lưu thời gian hết hạn của token bằng cách : tgian hiện tại  + thời gian hết hạn của token (accessTokenExpiration)
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);
        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                // Token được generation ra tại khi nào
                .issuedAt(now)
                // Set thời gian hết hạn cho token
                .expiresAt(validity)
                .subject(email)
                .claim("account", accountToken)
                .build();
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,
                claims)).getTokenValue();
    }
    // Ghi đè lại phương thức getSecretKey để NimbusJwtEncoder biết mình đang sử dụng thuật toán HS512
    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(privateJwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length,
                SecurityUtil.JWT_ALGORITHM.getName());
    }

    // check valid refresh token
    public Jwt checkValidRefreshToken(String refreshToken) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.
                withSecretKey(getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
    try{
       return jwtDecoder.decode(refreshToken);
    }catch (Exception e) {
        System.out.println(">>> Refresh token error : "+e.getMessage());
        throw e;
        }
    }


    /**
     * Get the login of the current user.
     *
     * @return the login of the current user.
     */
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }
}
