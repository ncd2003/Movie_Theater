package com.group3.be.movie.theater.domain.invoice;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.account.AccountRepository;
import com.group3.be.movie.theater.domain.account.AccountService;
import com.group3.be.movie.theater.domain.invoice.dto.InvoiceDTO;
import com.group3.be.movie.theater.domain.member.Member;
import com.group3.be.movie.theater.domain.member.MemberService;
import com.group3.be.movie.theater.domain.vnpay.vnpayDTO.PaymentDTO;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class InvoiceService {

    private final MemberService memberService;
    private InvoiceRepository invoiceRepository;
    private AccountRepository accountRepository;
    private AccountService accountService;


    public List<InvoiceDTO> getInvoices() {
        return invoiceRepository.findByStatus(Invoice.Status.SUCCESS).stream().map(InvoiceMapper::toInvoiceDTO).collect(Collectors.toList());
    }


    public List<InvoiceDTO> getInvoicesBetweenDatesAndOption(Instant startDate, Instant endDate, String option, Long accId) {
        List<Invoice> invoices = new ArrayList<Invoice>();

        if (startDate == null && endDate == null) {
            invoices = invoiceRepository.findAll(); // Get all invoices if both dates are null
        } else if (startDate != null && endDate == null) {
            invoiceRepository.findInvoicesBetweenDates(startDate, Instant.now());
        } else if (startDate == null && endDate != null) {
            invoiceRepository.findInvoicesBeforeDate(endDate);
        } else {
            invoices = invoiceRepository.findInvoicesBetweenDates(startDate, endDate);
        }

        // Filter by accountId if provided
        if (accId != null) {
            invoices = invoices.stream().filter(invoice -> invoice.getAccount().getAccountId().equals(accId)).collect(Collectors.toList());
        }

        return invoices.stream().filter(invoice -> option == null || ("Using".equalsIgnoreCase(option) && invoice.getUseScore() > 0) || ("Adding".equalsIgnoreCase(option) && invoice.getAddScore() > 0)).map(InvoiceMapper::toInvoiceDTO).collect(Collectors.toList());
    }

    public List<InvoiceDTO> getInvoiceByAccountId(Long accountId) {
        return invoiceRepository.getInvoiceByAccount_AccountId(accountId).stream()
                .filter(invoice -> invoice.getStatus() == Invoice.Status.SUCCESS)
                .map(InvoiceMapper::toInvoiceDTO)
                .collect(Collectors.toList());
    }

    public List<InvoiceDTO> searchInvoices(Long accountId, Long invoiceId, String phoneNumber, String roomName) {
        List<Invoice> invoices = invoiceRepository.searchInvoices(accountId, invoiceId, phoneNumber, roomName);
        return InvoiceMapper.InvoiceDTOList(invoices);
    }

    public InvoiceDTO createInvoice(Long accountId, Invoice invoice) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isPresent()) {
            invoice.setAccount(accountOptional.get());
            invoice.setBookingDate(Instant.now());
            invoiceRepository.save(invoice);
            return InvoiceMapper.toInvoiceDTO(invoice);
        } else {
            throw new RuntimeException("Account not found");
        }
    }

    ;

    public Invoice updateInvoice(Long invoiceId, Invoice.Status status) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(invoiceId);
        if (optionalInvoice.isPresent()) {
            Invoice invoice = optionalInvoice.get();
            invoice.setStatus(status.SUCCESS); // update status
            return invoiceRepository.save(invoice);
        }
        return null;
    }

    @Transactional
    public void addInvoice(PaymentDTO.VNPayRequest req, String txnRef, Invoice.Status status) {
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        Account userAccount = accountService.handleGetAccountByEmail(email);

        Invoice invoice = new Invoice();
        invoice.setBookingDate(Instant.now());
        invoice.setMovieName(req.getMovieName());
        invoice.setRoomName(req.getRoomName());
        try {
            LocalDate localDate = LocalDate.parse(req.getScheduleShow());
            Instant scheduleShow = localDate.atStartOfDay(ZoneId.of("UTC")).toInstant();
            invoice.setScheduleShow(scheduleShow);
        } catch (Exception e) {
            throw new IdInvalidException("scheduleShow is not in yyyy-MM-dd format");
        }
        invoice.setScheduleShowTime(req.getScheduleShowTime());
        invoice.setTotalMoney(req.getTotalMoney());

        String seatString = req.getSeats().stream().map(PaymentDTO.SeatDTO::getSeatName).collect(Collectors.joining(", "));
        invoice.setSeat(seatString);
        invoice.setOrderId(txnRef);
        invoice.setStatus(status);
        invoice.setAccount(userAccount);
        String promotionString = req.getPromotions().stream().map(p -> {
                    String promotionType = p.getPromotionType().toString();
                    String reward = String.valueOf(p.getReward()); // Đảm bảo trả về String
                    if ("DISCOUNT".equals(promotionType)) {
                        return promotionType + " -" + reward;
                    } else if ("SCORE".equals(promotionType)) {
                        return promotionType + " +" + reward;
                    } else if ("GIFT".equals(promotionType)) {
                        return promotionType;
                    } else if ("POINT".equals(promotionType)) {
                        return "POINT" + " -" + reward;
                    }
                    return ""; // Trả về String rỗng thay vì null
                }).filter(s -> !s.isEmpty()) // Tránh thêm chuỗi rỗng vào kết quả
                .collect(Collectors.joining(", ")); // Ghép chuỗi
        invoice.setEmailMember(req.getEmailMember());
        invoice.setPromotion(promotionString);
        invoiceRepository.save(invoice);

    }

    //Find Invoice by OrderId (vnp_TxnRef: unique)
    @Transactional
    public void updateInvoiceStatus(String orderId, Invoice.Status status) {
        Optional<Invoice> invoiceOpt = invoiceRepository.findByOrderId(orderId);
        if (invoiceOpt.isPresent()) {
            // Update invoice
            Invoice invoice = invoiceOpt.get();
            invoice.setStatus(status);
            Double score = extractScore(invoice.getPromotion());
            Double point = extractPoint(invoice.getPromotion());
            invoice.setAddScore(score);
            invoice.setUseScore(point);
            invoiceRepository.save(invoice);

            // account db
            Account accountDB = accountService.handleGetAccountByEmail(invoice.getEmailMember());
            if (accountDB != null && accountDB.getRole().getRoleId() == 3L) {
                // Update score member
                Member memberDB = memberService.getMemberByAccountId(accountDB.getAccountId());
                memberDB.setScore(memberDB.getScore() + point + score);
                memberService.updateMember(memberDB);
            }
        }
//        else {
//            throw new IdInvalidException("Invoice not found with orderId = " + orderId);
//        }
    }

    // Hàm lấy số sau SCORE
    public static Double extractScore(String promotionText) {
        return extractValue(promotionText, "SCORE");
    }

    // Hàm lấy số sau POINT
    public static Double extractPoint(String promotionText) {
        return extractValue(promotionText, "POINT");
    }

    // Hàm chung để trích xuất giá trị theo từ khóa
    private static Double extractValue(String text, String key) {
        // Biểu thức chính quy tìm số sau từ khóa (SCORE hoặc POINT)
        Pattern pattern = Pattern.compile(key + " ([+-]?\\d+(\\.\\d+)?)");
        Matcher matcher = pattern.matcher(text);

        // Nếu tìm thấy, chuyển thành Double và trả về
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }

        // Trả về 0 nếu không tìm thấy
        return 0.0;
    }

}
