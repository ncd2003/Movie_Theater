package com.group3.be.movie.theater.domain.account.dto;

import com.group3.be.movie.theater.util.validation.auth.PasswordValid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {
    @Email(message = "Invalid email")
    @NotBlank
    private String email;

    private String password;
}
