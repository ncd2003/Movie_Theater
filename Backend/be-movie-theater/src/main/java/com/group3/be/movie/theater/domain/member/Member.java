package com.group3.be.movie.theater.domain.member;

import com.group3.be.movie.theater.domain.account.Account;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "MOVIETHEATER.MEMBER")
@Data
public class Member {
    @Id
    @Column(name = "MEMBER_ID", length = 10)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Column(name = "SCORE")
    private Double score = 0.0;

    @OneToOne
    @JoinColumn(name = "ACCOUNT_ID", unique = true)
    private Account account;
}
