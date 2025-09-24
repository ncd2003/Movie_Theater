package com.group3.be.movie.theater.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/v1/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayConfig vnpayConfig;

    @GetMapping("/create-payment")
    public ResponseEntity<?> createPayment(@RequestParam("amount") long amount, HttpServletRequest request) {
        try {
            if (amount <= 0) {
                return ResponseEntity.badRequest().body("Số tiền thanh toán phải lớn hơn 0");
            }


            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());

            // Tạo mã giao dịch duy nhất (15 ký tự)
            String vnp_TxnRef = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 15);
            String vnp_IpAddr = VNPayUtil.getIpAddress(request);

            // Tạo params thanh toán
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", vnpayConfig.getTmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay yêu cầu số tiền x100
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toán đơn hàng " + vnp_TxnRef);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
            vnp_Params.put("vnp_OrderType", "other");

            // Tạo chữ ký bảo mật
            String queryUrl = VNPayUtil.createQueryUrl(vnp_Params, vnpayConfig.getHashSecret());
            String paymentUrl = vnpayConfig.getPayUrl() + "?" + queryUrl;

            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo URL thanh toán: " + e.getMessage());
        }
    }

    @GetMapping("/payment-callback")
    public ResponseEntity<?> paymentCallback(HttpServletRequest request) {
        Map<String, String> params = VNPayUtil.getQueryParams(request);
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "00".equals(vnp_ResponseCode) ? "success" : "fail");
        response.put("message", "00".equals(vnp_ResponseCode) ? "Thanh toán thành công!" : "Thanh toán thất bại!");
        response.put("data", params); // Trả lại toàn bộ dữ liệu VNPay gửi về

        return ResponseEntity.ok(response);
    }
}
