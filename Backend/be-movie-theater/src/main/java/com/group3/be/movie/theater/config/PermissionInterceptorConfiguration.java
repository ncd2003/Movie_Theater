package com.group3.be.movie.theater.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {
    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = {"/","/api/v1/auth/login","/api/v1/auth/refresh","/api/v1/auth/logout","/api/v1/auth/register","/storage/**","/api/v1/movies/client/**","/api/v1/promotions/client/**", "/api/v1/payment-callback","/api/v1/type/client/**","/api/v1/role/client/**","/api/v1/auth/forgot-password-reset"};
        registry.addInterceptor(getPermissionInterceptor()).excludePathPatterns(whiteList);
    }
}
