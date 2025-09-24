package com.group3.be.movie.theater.domain.account;

import com.group3.be.movie.theater.domain.account.dto.ResAccountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    boolean existsByEmailAndActiveTrue(String email);

    boolean existsByPhoneNumberAndActiveTrue(String phoneNumber);

    boolean existsByIdentityCardAndActiveTrue(String identityCard);

    Account findByEmailAndActiveTrue(String email);

    Account findByRefreshTokenAndEmail(String refreshToken, String email);

    Optional<Account> findByAccountId(Long accountId);

    List<Account> findByActiveTrue(); // Lấy tất cả tài khoản có active = true

    Optional<Account> findByEmail(String email);

    @Query("select a from Account a " +
            "join fetch a.member " +
            "where a.email = :value or a.phoneNumber = :value")
    Account findByEmailOrPhoneNumber(String value);

    Optional<Account> findByPhoneNumber(String phoneNumber);
}
