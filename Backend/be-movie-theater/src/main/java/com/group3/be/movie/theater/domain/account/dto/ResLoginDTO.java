package com.group3.be.movie.theater.domain.account.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.role.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    @JsonProperty("access_token")
    private String accessToken;
    private AccountLogin userLogin;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccountLogin{
        private Long accountId;
        private String email;
        private String fullName;
        private Account.Status status;
        private Role role;
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccountInsideToken{
        private Long accountId;
        private String email;
        private String fullName;
    }
}
