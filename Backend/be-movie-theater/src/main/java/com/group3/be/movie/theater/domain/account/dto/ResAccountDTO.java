package com.group3.be.movie.theater.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResAccountDTO {
    private Long accountId;
    private String email;
    private String fullName;
    private String address;
    private LocalDate birthDate;
    private String gender;
    private String identityCard;
    private String image;
    private String phoneNumber;
    private Instant updatedAt;
    private RoleAccount role;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoleAccount{
        private Long roleId;
        private String roleName;
    }
}
