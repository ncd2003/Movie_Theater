package com.group3.be.movie.theater.domain.account.auth;

import com.group3.be.movie.theater.domain.account.Account;
//import com.group3.be.movie.theater.domain.account.AccountMapper;
import com.group3.be.movie.theater.domain.account.AccountService;
import com.group3.be.movie.theater.domain.account.dto.*;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.error.PasswordMisMatchException;
import com.group3.be.movie.theater.util.validation.account.AccountEmailNotExists;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final AccountService accountService;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil, AccountService accountService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.accountService = accountService;
    }

    // Lấy ra thời gian refresh token hết hạn
    @Value("${movietheater.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        // 1. Nap input gồm usernam và password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());
        // 2. Xác minh tài khoản
        // - Cần ghi đè lại method loadUserByUsername bởi vì mặc định là sẽ check trong memory
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 4. Lưu user vào Context -> Lấy ra user hiện đang thao tác
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get currAccount
        Account currAccountDB = accountService.handleGetAccountByEmail(loginDTO.getEmail());

        ResLoginDTO resLoginDTO = new ResLoginDTO();
        ResLoginDTO.AccountLogin accountLogin = new ResLoginDTO.AccountLogin(currAccountDB.getAccountId(), currAccountDB.getEmail(), currAccountDB.getFullName(), currAccountDB.getStatus(), currAccountDB.getRole());

        // set into resLoginDTO
        resLoginDTO.setUserLogin(accountLogin);

        // 5. Tạo token
        String accessToken = this.securityUtil.createAccessToken(authentication.getName(), resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);

        // create refresh token
        String refreshToken = this.securityUtil.refreshToken(loginDTO.getEmail(), resLoginDTO);

        // Update refresh token
        this.accountService.updateAccountToken(refreshToken, loginDTO.getEmail());

        // Set cookie
        ResponseCookie responseCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(resLoginDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<Account> register(@Valid @RequestBody RegisterDTO registerDTO) {

        // check exist phone
        if (accountService.isExistPhoneNumber(registerDTO.getPhoneNumber())) {
            throw new IdInvalidException("Phone number already exist");
        }

        // check password and confirm password
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new PasswordMisMatchException("Password and confirm password do not match.");
        }

        // create new account with role = member
        Account registerMember = accountService.registerMember(registerDTO);
        return ResponseEntity.ok().body(registerMember);
    }

    @GetMapping("/account")
    @APIMessage("Fetch account")
    public ResponseEntity<ResLoginDTO.AccountLogin> getAccount() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        Account currAccountDB = accountService.handleGetAccountByEmail(email);
        ResLoginDTO.AccountLogin accountLogin = new ResLoginDTO.AccountLogin(currAccountDB.getAccountId(), currAccountDB.getEmail(), currAccountDB.getFullName(), currAccountDB.getStatus(), currAccountDB.getRole());
        return ResponseEntity.ok().body(accountLogin);
    }

    // refresh token
    @GetMapping("/refresh")
    @APIMessage("Get user by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(@CookieValue(name = "refresh_token", defaultValue = "missing_refresh_token") String refresh_token) {
        if ("missing_refresh_token".equals(refresh_token)) {
            throw new IdInvalidException("Refresh token is missing");
        }
        // 1. check valid refresh_token by NimbusJWTDecoder
        Jwt decodedRefreshToken = this.securityUtil.checkValidRefreshToken(refresh_token);

        // get email by sub
        String email = decodedRefreshToken.getSubject();

        // 2. check user by refresh token + email
        Account accountDB = accountService.getUserByRefreshTokenAndEmail(refresh_token, email);
        if (accountDB == null) {
            throw new IdInvalidException("Invalid refresh token");
        }

        // issue new token/set refresh token as cookies
        ResLoginDTO resLoginDTO = new ResLoginDTO();
        ResLoginDTO.AccountLogin accountLogin = new ResLoginDTO.AccountLogin(accountDB.getAccountId(), email, accountDB.getFullName(), accountDB.getStatus(), accountDB.getRole());
        // set into resLoginDTO
        resLoginDTO.setUserLogin(accountLogin);

        // 3. Tạo token
        String accessToken = this.securityUtil.createAccessToken(email, resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);

        // create refresh token
        String new_refresh_Token = this.securityUtil.refreshToken(email, resLoginDTO);

        // Update refresh token
        this.accountService.updateAccountToken(new_refresh_Token, email);

        // Set cookie
        ResponseCookie responseCookie = ResponseCookie.from("refresh_token", new_refresh_Token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(resLoginDTO);
    }

    @PostMapping("/logout")
    @APIMessage("Logout user")
    public ResponseEntity<Void> logout() {
        // Find current user
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        // update refresh token = null
        this.accountService.updateAccountToken(null, email);
        // Set cookie with max age = 0
        ResponseCookie deleteSpringCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // This deletes the cookie
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString()).body(null);
    }


    // Gửi email đặt lại mật khẩu
    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        try {
            accountService.requestPasswordReset(email);
            return ResponseEntity.ok("Password reset request received");
        } catch (MailException e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }

    // Gửi email đặt lại mật khẩu
    @PostMapping("/forgot-password-reset")
    public ResponseEntity<String> forgotPasswordReset(@RequestBody String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        try {
            accountService.requestPasswordReset(email.replace("\"", "").trim());
            return ResponseEntity.ok("Password reset request received");
        } catch (MailException e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }

    // Kiểm tra OTP khi người dùng bấm vào link trong email
    @GetMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String token) {

        boolean isValid = accountService.verifyOtp(token);
        if (isValid) {
            return ResponseEntity.ok("OTP hợp lệ, vui lòng nhập mật khẩu mới.");
        } else {
            return ResponseEntity.badRequest().body("OTP không hợp lệ hoặc đã hết hạn.");
        }
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody SetPasswordDTO dto) {
        accountService.resetPassword(dto);
        return ResponseEntity.ok("Mật khẩu đã được cập nhật.");
    }

}
