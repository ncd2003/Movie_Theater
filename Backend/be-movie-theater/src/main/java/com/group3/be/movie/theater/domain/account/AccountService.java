package com.group3.be.movie.theater.domain.account;

import com.group3.be.movie.theater.domain.account.dto.RegisterDTO;
import com.group3.be.movie.theater.domain.account.dto.ReqAccountDTO;
import com.group3.be.movie.theater.domain.account.dto.ResAccountDTO;
import com.group3.be.movie.theater.domain.account.dto.SetPasswordDTO;
import com.group3.be.movie.theater.domain.account.email.EmailService;
import com.group3.be.movie.theater.domain.account.otp.JwtOtpUtil;
import com.group3.be.movie.theater.domain.account.otp.OtpService;
import com.group3.be.movie.theater.domain.account.dto.ResSearchMemberAccount;
import com.group3.be.movie.theater.domain.employee.Employee;
import com.group3.be.movie.theater.domain.employee.EmployeeService;
import com.group3.be.movie.theater.domain.member.Member;
import com.group3.be.movie.theater.domain.member.MemberService;
import com.group3.be.movie.theater.domain.role.Role;
import com.group3.be.movie.theater.domain.role.RoleService;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final MemberService memberService;
    private final EmployeeService employeeService;
    private final BaseService baseService;
    private final RoleService roleService;
    private final EmailService emailService;
    private final JwtOtpUtil jwtOtpUtil;
    private final OtpService otpService;


    public List<Account> handleGetAllAccounts() {
        return accountRepository.findByActiveTrue();
    }

    // create account
    @Transactional
    public Account handleCreateAccount(ReqAccountDTO ReqAccountDTO) {
        Account account = baseService.convertObjectToObject(ReqAccountDTO, Account.class);
        // Hash Password
        String hashPassword = passwordEncoder.encode(account.getPassword());
        account.setPassword(hashPassword);

        // Lấy Role từ database để đảm bảo tồn tại
        Role role = roleService.findRoleById(account.getRole().getRoleId());
        if (role == null) {
            throw new RuntimeException("Role not found");
        }
        account.setRole(role);

        // Xử lý theo từng loại Role
        // Admin
        if (role.getRoleId() == 1L) {
            return accountRepository.save(account);
        }
        // Employee
        else if (role.getRoleId() == 2L) {
            Employee employee = new Employee();
            employee.setAccount(account);
            employeeService.createEmployee(employee);
        }
        // Member
        else if (role.getRoleId() == 3L) {
            Member member = new Member();
            member.setAccount(account);
            memberService.createMember(member);
        }

        return accountRepository.save(account);
    }

    // Register account
    @Transactional
    public Account registerMember(RegisterDTO registerDTO) {
        // convert registerDTO to account
        Account account = baseService.convertObjectToObject(registerDTO, Account.class);

        // hash Password
        String hashPassword = this.passwordEncoder.encode(account.getPassword());
        account.setPassword(hashPassword);

        // role = member
        Role role = roleService.findRoleByName("Member");
        account.setRole(role);

        // save member in db
        Member member = new Member();
        member.setAccount(account);
        memberService.createMember(member);

        // Set member to account
        account.setMember(member);

        return accountRepository.save(account);
    }

    // update account
    @Transactional
    public ResAccountDTO updateAccount(Long id, Account accountUpdated) {
        return accountRepository.findById(id).map(account -> {
            if (accountUpdated.getFullName() != null) account.setFullName(accountUpdated.getFullName());
            if (accountUpdated.getAddress() != null) account.setAddress(accountUpdated.getAddress());
            if (accountUpdated.getGender() != null) account.setGender(accountUpdated.getGender());
            if (accountUpdated.getBirthDate() != null) account.setBirthDate(accountUpdated.getBirthDate());
            if (accountUpdated.getRole() != null) account.setRole(accountUpdated.getRole());

            if (accountUpdated.getPhoneNumber() != null) {
                Optional<Account> existingAccountWithPhone = accountRepository.findByPhoneNumber(accountUpdated.getPhoneNumber());

                if (existingAccountWithPhone.isPresent() && !existingAccountWithPhone.get().getAccountId().equals(id)) {
                    throw new IdInvalidException("Phone number is existed already!");
                }

                account.setPhoneNumber(accountUpdated.getPhoneNumber());
            }

            if(accountUpdated.getImage() != null) account.setImage(accountUpdated.getImage());

            // Nếu không gửi password, giữ nguyên giá trị cũ
            if (accountUpdated.getPassword() != null && !accountUpdated.getPassword().isEmpty()) {
                account.setPassword(accountUpdated.getPassword()); // Nếu có mã hóa, dùng passwordEncoder.encode()
            }

            Account savedAccount = accountRepository.save(account);
            return baseService.convertObjectToObject(savedAccount, ResAccountDTO.class);
        }).orElseThrow(() -> new RuntimeException("Account not found"));
    }


    // delete account
    @Transactional
    public void deleteAccount(Long accountID) {
        Account account = accountRepository.findByAccountId(accountID).get();
        account.setActive(false);
        accountRepository.save(account);
    }


    // update refresh token
    public void updateAccountToken(String refreshToken, String email) {
        Account currentAccountDB = accountRepository.findByEmailAndActiveTrue(email);
        if (currentAccountDB != null) {
            currentAccountDB.setRefreshToken(refreshToken);
            this.accountRepository.saveAndFlush(currentAccountDB);
        }
    }

    // find by token and email
    public Account getUserByRefreshTokenAndEmail(String refreshToken, String email) {
        return accountRepository.findByRefreshTokenAndEmail(refreshToken, email);
    }

    public void createDefaultAccount() {
        SecurityUtil securityUtil;
        Account account = new Account();
        account.setEmail("admin@gmail.com");
        account.setFullName("Admin");
        account.setPassword(passwordEncoder.encode("123456"));
        account.setRole(roleService.findRoleById(1L));
        accountRepository.save(account);
    }

    public boolean isExistEmail(String email) {
        return accountRepository.existsByEmailAndActiveTrue(email);
    }

    public boolean isExistPhoneNumber(String phoneNumber) {
        return accountRepository.existsByPhoneNumberAndActiveTrue(phoneNumber);
    }

    public boolean isExistIdentityCard(String identityCard) {
        return accountRepository.existsByIdentityCardAndActiveTrue(identityCard);
    }

    public Account handleGetAccountByEmail(String email) {
        return accountRepository.findByEmailAndActiveTrue(email);
    }

    public ResAccountDTO handleGetAccountDTOByEmail(String email) {
        return baseService.convertObjectToObject(accountRepository.findByEmailAndActiveTrue(email), ResAccountDTO.class);
    }

    public boolean isExistId(Long id) {
        return accountRepository.existsById(id);
    }

    public ResSearchMemberAccount findAccountMemberByEmailOrPhoneNumber(String valueSearch) {
        Account accountDB = accountRepository.findByEmailOrPhoneNumber(valueSearch);
        if(accountDB == null){
            return null;
        }
        ResSearchMemberAccount resSearchMemberAccount = baseService.convertObjectToObject(accountDB, ResSearchMemberAccount.class);
        resSearchMemberAccount.setScore(accountDB.getMember().getScore());
        return resSearchMemberAccount;
    }

    public void requestPasswordReset(String email) {
        Account account = accountRepository.findByEmailAndActiveTrue(email);
        if (account == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không tìm thấy tài khoản với email này.");
    }

        otpService.sendOtpEmail(email);
    }

    // Xác thực OTP khi người dùng bấm vào link
    public boolean verifyOtp(String token) {
        Claims claims = jwtOtpUtil.parseOtpToken(token);
        return claims != null; // Nếu giải mã token thành công, OTP hợp lệ
    }

    // Đặt lại mật khẩu nếu OTP hợp lệ
    public void resetPassword(SetPasswordDTO dto) {
        Claims claims = jwtOtpUtil.parseOtpToken(dto.getToken());
        if (claims == null) {
            throw new RuntimeException("OTP không hợp lệ hoặc đã hết hạn.");
        }

        String email = claims.getSubject(); // Lấy email từ token
        Account account = accountRepository.findByEmailAndActiveTrue(email);
        if (account == null) {
            throw new RuntimeException("Không tìm thấy tài khoản với email này.");
        }

        account.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        accountRepository.save(account);
    }

    public Account.Status updateStatus(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IdInvalidException("Account not found"));

        Account.Status newStatus = (account.getStatus() == Account.Status.ACTIVE) ? Account.Status.BANNED : Account.Status.ACTIVE;
        account.setStatus(newStatus);

        accountRepository.save(account);

        return newStatus;
    }

}
