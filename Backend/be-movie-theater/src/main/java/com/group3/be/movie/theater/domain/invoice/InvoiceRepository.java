package com.group3.be.movie.theater.domain.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT i FROM Invoice i WHERE i.bookingDate >= :startDate AND i.bookingDate <= :endDate")
    List<Invoice> findInvoicesBetweenDates(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    List<Invoice> getInvoiceByAccount_AccountId(Long accountId);

    @Query("SELECT i FROM Invoice i WHERE i.bookingDate <= :endDate")
    List<Invoice> findInvoicesBeforeDate(@Param("endDate") Instant endDate);

    @Query("SELECT i FROM Invoice i WHERE (:accountId IS NULL OR i.account.accountId = :accountId) " +
            "OR (:invoiceId IS NULL OR i.invoiceId = :invoiceId)" +
            "OR (:phoneNumber IS NULL OR i.account.phoneNumber = :phoneNumber)" +
            "OR (:identityCard IS NULL OR i.account.identityCard = :identityCard)"

    )
    List<Invoice> searchInvoices(@Param("accountId") Long accountId,
                                 @Param("invoiceId") Long invoiceId,
                                 @Param("phoneNumber") String phoneNumber,
                                 @Param("identityCard") String identityCard
    );


    Optional<Invoice> findByOrderId(String orderId);


    List<Invoice> findByStatus(Invoice.Status status);
}
