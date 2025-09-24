package com.group3.be.movie.theater.domain.account;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.group3.be.movie.theater.domain.employee.Employee;
import com.group3.be.movie.theater.domain.member.Member;
import com.group3.be.movie.theater.domain.role.Role;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.util.validation.account.AccountEmailNotExists;
import com.group3.be.movie.theater.util.validation.account.AccountIdentityCardNotExists;
import com.group3.be.movie.theater.util.validation.account.AccountPhoneNumberNotExists;
import com.group3.be.movie.theater.util.validation.auth.PasswordValid;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "MOVIETHEATER.ACCOUNT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @Column(name = "ACCOUNT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(name = "EMAIL", length = 50, unique = true, nullable = false)
    private String email;

    @Column(name = "FULL_NAME", length = 80)
    private String fullName;

    @Column(name = "PASSWORD", length = 800, nullable = false)
    private String password;

    @Column(name = "ADDRESS", length = 100)
    private String address;

    @Column(name = "DATE_OF_BIRTH")
    private LocalDate birthDate;

    @Column(name = "GENDER")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "IDENTITY_CARD", unique = true)
    private String identityCard;

    @Column(name = "IMAGE", length = 255)
    private String image;

    @Column(name = "PHONE_NUMBER", length = 10, unique = true)
    private String phoneNumber;

    @Column(name = "STATUS", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Column(name = "REFRESH_TOKEN",columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    @Column(name = "ACTIVE")
    private Boolean active = true;
    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonIgnore  // Ngăn chặn vòng lặp vô hạn
    private Member member;
    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonIgnore  // Ngăn chặn vòng lặp vô hạn
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    public enum Status {
        ACTIVE, BANNED
    }

    public enum Gender{
        MALE, FEMALE, OTHER
    }

    @PrePersist
    public void handleBeforeCreateAt(){
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdateAt(){
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.updatedAt = Instant.now();
    }

}
