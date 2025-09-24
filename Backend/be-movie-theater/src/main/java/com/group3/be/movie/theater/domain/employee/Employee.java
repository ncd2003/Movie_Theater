package com.group3.be.movie.theater.domain.employee;

import com.group3.be.movie.theater.domain.account.Account;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "MOVIETHEATER.EMPLOYEE")
public class Employee {
    @Id
    @Column(name = "EMPLOYEE_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long employeeId;
    @OneToOne()
    @JoinColumn(name = "ACCOUNT_ID", unique = true)
    private Account account;


}
