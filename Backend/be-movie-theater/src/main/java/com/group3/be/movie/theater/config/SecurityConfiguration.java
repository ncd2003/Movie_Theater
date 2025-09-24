package com.group3.be.movie.theater.config;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http
            , CustomAuthenticationEntryPoint customAuthenticationEntryPoint) throws Exception {
        String[] whiteList = {"/", "api/v1/auth/login", "api/v1/auth/refresh", "api/v1/auth/register", "/storage/**", "/favicon.ico", "api/v1/movies/client/**", "api/v1/promotions/client/**", "/api/v1/payment-callback", "api/v1/type/client/**", "api/v1/role/client/**","api/v1/auth/forgot-password-reset"};
        http
                // Tắt CSRF để tránh lỗi khi gọi API
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                                auth.requestMatchers(whiteList).permitAll()
                                        .anyRequest().authenticated()
                )
                // Xác thực jwt token. Nếu k hợp lệ ném vào customAuthenticationEntryPoint xử lý
                // Tạo 1 filter cần gửi kèm Bearer Token để xác minh account
                .oauth2ResourceServer((oath2) -> oath2.jwt(Customizer.withDefaults()).authenticationEntryPoint(customAuthenticationEntryPoint))
                // disable form login
                .formLogin(f -> f.disable());
        return http.build();
    }
}
