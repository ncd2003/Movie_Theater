package com.group3.be.movie.theater.domain.employee;

import com.group3.be.movie.theater.domain.account.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmployeeDTO {
    private Long employeeId;
    private Account account;
}
