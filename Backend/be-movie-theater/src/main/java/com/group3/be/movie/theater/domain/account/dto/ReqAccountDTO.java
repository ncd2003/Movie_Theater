package com.group3.be.movie.theater.domain.account.dto;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.role.Role;
import com.group3.be.movie.theater.util.validation.account.AccountEmailNotExists;
import com.group3.be.movie.theater.util.validation.account.AccountIdentityCardNotExists;
import com.group3.be.movie.theater.util.validation.account.AccountPhoneNumberNotExists;
import com.group3.be.movie.theater.util.validation.auth.PasswordValid;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

@Getter
@Setter
public class ReqAccountDTO {
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @AccountEmailNotExists
    @Length(min = 6, max = 50)
    private String email;

    @Length(min = 10, max = 10)
    @AccountPhoneNumberNotExists
//    @PhoneNumberValid
    private String phoneNumber;

    @NotBlank(message = "Identity card cannot be empty")
    @Length(min = 10, max = 12)
    @AccountIdentityCardNotExists
    private String identityCard;

    @NotBlank(message = "Full name cannot be empty")
    @Length(max = 80)
    private String fullName;

    @PasswordValid
    private String password;
    private String confirmPassword;

    @Past(message = "Date of birth must be in the past")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Account.Gender gender;

    @NotBlank(message = "Address cannot be empty")
    @Length(max = 100)
    private String address;

    private Role role;
}
