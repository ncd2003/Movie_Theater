package com.group3.be.movie.theater.domain.account.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResSearchMemberAccount {
    private Long accountId;
    private String email;
    private String fullName;
    private String gender;
    private String identityCard;
    private String phoneNumber;
    private Double score;
}
