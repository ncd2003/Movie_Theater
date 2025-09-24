package com.group3.be.movie.theater.domain.account.otp;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtOtpUtil {

    private static final String SECRET_KEY = "uQjCzNfS8vX4rT2mL9pYwKdB3aG6oH5x"; // Thay bằng key bảo mật thực tế
    private static final long EXPIRATION_TIME = 10 * 60 * 1000; //

    // Tạo token chứa email và OTP
    public String generateOtpToken(String email, String otp) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("otp", otp);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email) // Lưu email trong subject
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }

    // Giải mã token
    public Claims parseOtpToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}


