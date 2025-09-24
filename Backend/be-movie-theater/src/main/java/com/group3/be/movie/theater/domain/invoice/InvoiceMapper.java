package com.group3.be.movie.theater.domain.invoice;

import com.group3.be.movie.theater.domain.invoice.dto.InvoiceDTO;

import java.util.List;
import java.util.stream.Collectors;

public class InvoiceMapper {

    public static InvoiceDTO toInvoiceDTO(Invoice invoice) {
        if (invoice == null) {
            return null;
        }
        InvoiceDTO dto = new InvoiceDTO();
        dto.setBookingId(invoice.getInvoiceId());
        dto.setMemberId(invoice.getAccount().getAccountId());
        dto.setFullName(invoice.getAccount().getFullName());
        dto.setPhoneNumber(invoice.getAccount().getPhoneNumber());
        dto.setIdentityCard(invoice.getAccount().getIdentityCard());
        dto.setAddScore(invoice.getAddScore());
        dto.setBookingDate(invoice.getBookingDate());
        dto.setMovieName(invoice.getMovieName());
        dto.setRoomName(invoice.getRoomName());
        dto.setScheduleShow(invoice.getScheduleShow());
        dto.setScheduleShowTime(invoice.getScheduleShowTime());
        dto.setStatus(String.valueOf(invoice.getStatus()));
        dto.setTotalMoney(invoice.getTotalMoney());
        dto.setUseScore(invoice.getUseScore());
        dto.setSeat(invoice.getSeat());
        dto.setPromotion(invoice.getPromotion());
        dto.setEmailMember(invoice.getEmailMember());
        return dto;
    }

    public static List<InvoiceDTO> InvoiceDTOList(List<Invoice> invoices) {
        return invoices.stream().map(InvoiceMapper::toInvoiceDTO).collect(Collectors.toList());
    }

}

