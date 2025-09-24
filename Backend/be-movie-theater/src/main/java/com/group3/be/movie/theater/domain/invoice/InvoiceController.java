package com.group3.be.movie.theater.domain.invoice;

import com.group3.be.movie.theater.domain.invoice.dto.InvoiceDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.domain.account.AccountService;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/invoice")
@AllArgsConstructor

public class InvoiceController {

    private InvoiceService invoiceService;
    private AccountService accountService;

    @APIMessage("Get all invoices")
    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getInvoices() {
        return new ResponseEntity<>(invoiceService.getInvoices(), HttpStatus.OK);
    }

    @APIMessage("Get all invoices by date")
    @GetMapping("/by-date")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesBetweenDatesAndOption(
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(required = false) String option,
            @RequestParam(required = false) Long accId) {
        if(!accountService.isExistId(accId)){
            throw new IdInvalidException("Can not found account id :" + accId);
        }
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }
        List<InvoiceDTO> invoices = invoiceService.getInvoicesBetweenDatesAndOption(startDate, endDate, option, accId);
//        if (invoices.isEmpty()) {
//            throw new IdInvalidException("No invoices found for the given criteria.");
//        }
        return new ResponseEntity<>(invoices, HttpStatus.OK);
    }

    @APIMessage("Get all invoices by account id")
    @GetMapping("/{accId}")
    public ResponseEntity<List<InvoiceDTO>> getInvoiceByAccId(@PathVariable Long accId) {
        if(!accountService.isExistId(accId)){
            throw new IdInvalidException("Can not found account id :" + accId);
        }
        List<InvoiceDTO> invoices = invoiceService.getInvoiceByAccountId(accId);
        return new ResponseEntity<>(invoices, HttpStatus.OK);
    }

    @APIMessage("search invoices")
    @GetMapping("/search")
    public ResponseEntity<List<InvoiceDTO>> searchInvoices(
            @RequestParam(required = false) Long accountId,
            @RequestParam(required = false) Long invoiceId,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String identityCard) {

        List<InvoiceDTO> invoiceDTOList = invoiceService.searchInvoices(accountId, invoiceId, phoneNumber, identityCard);
        return ResponseEntity.ok(invoiceDTOList);
    }
    @APIMessage("create movies")
    @PostMapping("/createInvoice/{accountId}")
    public ResponseEntity <InvoiceDTO>  createInvoice(@PathVariable Long accountId, @RequestBody Invoice invoice) {
        InvoiceDTO invoiceDTO = invoiceService.createInvoice(accountId, invoice);
        return  ResponseEntity.status(HttpStatus.CREATED).body(invoiceDTO);
    }
    @APIMessage("updated invoice")
    @PutMapping("{invoiceId}/update-status")
    public ResponseEntity <InvoiceDTO>  updateStatusInvoice(@PathVariable Long invoiceId) {
        Invoice updatedInvoice = invoiceService.updateInvoice(invoiceId, Invoice.Status.SUCCESS);
        if (updatedInvoice != null) {
            return ResponseEntity.ok(InvoiceMapper.toInvoiceDTO(updatedInvoice));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


}


