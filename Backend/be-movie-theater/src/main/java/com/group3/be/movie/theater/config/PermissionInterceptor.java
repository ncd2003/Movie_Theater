package com.group3.be.movie.theater.config;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.account.AccountService;
import com.group3.be.movie.theater.domain.permession.Permission;
import com.group3.be.movie.theater.domain.role.Role;
import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.nio.file.AccessDeniedException;
import java.util.List;

public class PermissionInterceptor implements HandlerInterceptor {
    @Autowired
    private AccountService accountService;

    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();
        System.out.println("Run pre handler");
        System.out.println("Path: " + path);
        System.out.println("RequestURI: " + requestURI);
        System.out.println("HttpMethod: " + httpMethod);

        // check permission
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        if (email != null) {
            Account account = accountService.handleGetAccountByEmail(email);
            if (account != null) {
                Role role = account.getRole();
                if (role != null) {
                    List<Permission> permissions = role.getPermissions();
                    if (permissions != null) {
                        boolean isAllow = permissions.stream()
                                .anyMatch(permission -> (permission.getApiPath().equals(path) && permission.getMethod().equals(httpMethod)));
                    if(isAllow) {
                        return true;
                    }else{
                        throw new AccessDeniedException("Access denied");
                    }
                    }
                }
            }
        }
        return false;
    }
}
