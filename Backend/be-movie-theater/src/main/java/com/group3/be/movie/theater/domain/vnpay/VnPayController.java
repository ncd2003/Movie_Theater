package com.group3.be.movie.theater.domain.vnpay;

import com.group3.be.movie.theater.domain.invoice.Invoice;
import com.group3.be.movie.theater.domain.invoice.InvoiceService;
import com.group3.be.movie.theater.domain.vnpay.vnpayDTO.PaymentDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class VnPayController {
    private final VnPayService vnPayService;
    private final InvoiceService invoiceService;

    @APIMessage("Call Api VnPay")
    @PostMapping("/vn-pay")
    public ResponseEntity<PaymentDTO.VNPayResponse> pay(@RequestBody PaymentDTO.VNPayRequest req, HttpServletRequest request) {
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        invoiceService.addInvoice(req, txnRef, Invoice.Status.PENDING);
        return ResponseEntity.ok(vnPayService.createVnPayPayment(req, txnRef, request));
    }

    @APIMessage("Call Api Return Url Result")
    @GetMapping("/payment-callback")
    public void paymentCallback(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        String vnpResponseCode = params.get("vnp_ResponseCode");
        String orderId = params.get("vnp_TxnRef"); //unique

        if ("00".equals(vnpResponseCode)) {
            invoiceService.updateInvoiceStatus(orderId, Invoice.Status.SUCCESS);
            response.sendRedirect("http://localhost:5173/payment-result?vnp_ResponseCode=00");
        } else {
            invoiceService.updateInvoiceStatus(orderId, Invoice.Status.FAILED);
            response.sendRedirect("http://localhost:5173/payment-result?vnp_ResponseCode=" + vnpResponseCode);
        }
    }



}
