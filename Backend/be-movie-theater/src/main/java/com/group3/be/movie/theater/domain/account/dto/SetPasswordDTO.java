package com.group3.be.movie.theater.domain.account.dto;

import lombok.Data;

@Data
public class SetPasswordDTO {
    private String token;
    private String newPassword;
}
