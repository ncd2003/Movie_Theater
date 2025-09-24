package com.group3.be.movie.theater.domain.account.otp;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.account.AccountRepository;
import com.group3.be.movie.theater.domain.account.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final JwtOtpUtil jwtOtpUtil;
    private final EmailService emailService;

    // Tạo mã OTP ngẫu nhiên
    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    // Gửi email OTP
    public String sendOtpEmail(String email) {
        String otp = generateOtp();
        String token = jwtOtpUtil.generateOtpToken(email,"Mã OTP của bạn là: "+ otp);

        // Gửi email với token OTP
        emailService.sendEmail(email, token);
        return token; // Trả về token cho mục đích debug
    }
}

