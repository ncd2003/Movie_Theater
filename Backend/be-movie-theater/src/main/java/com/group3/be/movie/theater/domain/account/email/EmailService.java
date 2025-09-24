package com.group3.be.movie.theater.domain.account.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    // Gửi email xác thực OTP
    public void sendEmail(String email, String token) {
        String verifyLink = "http://localhost:5173/customer/verify-otp?token=" + token;
        String content = "<p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>"
                + "<p>Vui lòng nhấn vào liên kết bên dưới để xác thực OTP:</p>"
                + "<p><a href=\"" + verifyLink + "\">Xác thực OTP</a></p>"
                + "<br>"
                + "<p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>";

        sendHtmlEmail(email, "Xác thực OTP đặt lại mật khẩu", content);
    }

    private void sendHtmlEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            System.out.println("Email content: " + content); // Debug log
            mailSender.send(message);
            System.out.println("Email sent successfully!"); // Debug log
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email.");
        }
    }

}
