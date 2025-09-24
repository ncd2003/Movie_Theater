package com.group3.be.movie.theater.domain.account.dto;

import com.group3.be.movie.theater.domain.account.Account.Gender;
import com.group3.be.movie.theater.util.validation.account.AccountEmailNotExists;
import com.group3.be.movie.theater.util.validation.account.AccountIdentityCardNotExists;
import com.group3.be.movie.theater.util.validation.account.AccountPhoneNumberNotExists;
import com.group3.be.movie.theater.util.validation.auth.PasswordValid;
import com.group3.be.movie.theater.util.validation.auth.PhoneNumberValid;
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
public class RegisterDTO {
    @NotBlank
    @Email
    @AccountEmailNotExists
    @Length(min = 6, max = 50)
    private String email;

    @NotBlank
    @Length(min = 10, max = 10)
    @AccountPhoneNumberNotExists
//    @PhoneNumberValid
    private String phoneNumber;

    @NotBlank
    @AccountIdentityCardNotExists
    private String identityCard;

    @NotBlank
    @Length(max = 80)
    private String fullName;

    @PasswordValid
    private String password;
    private String confirmPassword;

    @Past
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @NotBlank
    @Length(max = 100)
    private String address;


}
