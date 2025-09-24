package com.group3.be.movie.theater.payment;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

public class VNPayUtil {

    // Hàm tạo chữ ký HMAC SHA512
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    // Hàm mã hóa SHA-256
    public static String sha256(String message) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(message.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException ex) {
            return "";
        }
    }

    // Tạo chuỗi chữ ký từ các tham số của VNPay
    public static String hashAllFields(Map<String, String> fields, String secretKey) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                sb.append(fieldName).append("=").append(fieldValue).append("&");
            }
        }
        // Xóa ký tự '&' cuối cùng
        if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
        }
        return hmacSHA512(secretKey, sb.toString());
    }

    // Lấy địa chỉ IP của client
    public static String getIpAddress(jakarta.servlet.http.HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        } else {
            ipAddress = ipAddress.split(",")[0].trim(); // Lấy IP đầu tiên trong danh sách
        }
        return ipAddress;
    }

    // Tạo số ngẫu nhiên
    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // Phương thức tạo URL chứa các tham số và chữ ký bảo mật
    public static String createQueryUrl(Map<String, String> vnp_Params, String hashSecret) {
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames); // Sắp xếp các tham số theo thứ tự từ điển

        StringBuilder query = new StringBuilder();
        StringBuilder hashData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Mã hóa tham số URL
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8)).append("=")
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8)).append("&");

                // Xây dựng chuỗi dữ liệu để ký
                hashData.append(fieldName).append("=").append(fieldValue).append("&");
            }
        }

        // Xóa ký tự '&' cuối cùng
        if (query.length() > 0) {
            query.setLength(query.length() - 1);
            hashData.setLength(hashData.length() - 1);
        }

        // Tạo chữ ký bảo mật
        String secureHash = hmacSHA512(hashSecret, hashData.toString());

        // Thêm chữ ký vào URL
        if (query.length() > 0) {
            query.append("&");
        }
        query.append("vnp_SecureHash=").append(secureHash);


        return query.toString();
    }

    public static Map<String, String> getQueryParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements();) {
            String key = e.nextElement();
            String value = request.getParameter(key);
            params.put(key, value);
        }
        return params;
    }
}

