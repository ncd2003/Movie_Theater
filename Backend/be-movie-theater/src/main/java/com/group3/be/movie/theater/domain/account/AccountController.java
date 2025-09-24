package com.group3.be.movie.theater.domain.account;

import com.group3.be.movie.theater.domain.account.dto.*;
import com.group3.be.movie.theater.domain.member.Member;
import com.group3.be.movie.theater.domain.member.MemberService;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.domain.account.dto.ResAccountDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.validation.account.AccountIdExists;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/account")
public class AccountController {
    private final AccountService accountService;
    private final MemberService memberService;

    @APIMessage("Fetch all accounts")
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.status(HttpStatus.OK).body(accountService.handleGetAllAccounts());
    }

    @APIMessage("Create a account")
    @PostMapping
    public ResponseEntity<Account> createAccount( @Validated @RequestBody ReqAccountDTO reqAccountDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.handleCreateAccount(reqAccountDTO));
    }

    @APIMessage("Update a account")
    @PutMapping("/{id}")
    public ResponseEntity<ResAccountDTO> updateAccount(@PathVariable("id") @AccountIdExists Long id, @Validated @RequestBody Account accountUpdate) {
        return ResponseEntity.ok().body(accountService.updateAccount(id, accountUpdate));
    }

    @APIMessage("Delete account")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") @AccountIdExists Long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.ok().body(null);
    }

    @APIMessage("Fetch a account by identity card")
    @GetMapping("/search")
    public ResponseEntity<ResSearchMemberAccount> fetchAccountByEmailOrPhoneNumber(@NotBlank(message = "Value search cant blank") @RequestParam String valueSearch) {
        ResSearchMemberAccount resSearchMemberAccount = accountService.findAccountMemberByEmailOrPhoneNumber(valueSearch);
        return ResponseEntity.status(HttpStatus.OK).body(resSearchMemberAccount);
    }

    @APIMessage("Fetch account")
    @GetMapping("/profile")

    public ResponseEntity<ResAccountDTO> getAccount() {
        // Lấy email của user từ SecurityUtil
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok().body(accountService.handleGetAccountDTOByEmail(email));
    }

    @APIMessage("Update Status")
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable("id") Long accountId) {
        Account.Status newStatus = accountService.updateStatus(accountId);
        return ResponseEntity.ok().body("Status updated to: " + newStatus);
    }
}
