package com.group3.be.movie.theater.domain.employee;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.domain.account.AccountRepository;
import com.group3.be.movie.theater.domain.member.Member;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Employee> listAllEmployee() {
        return employeeRepository.findAll();
    }

    public List<EmployeeDTO> getAllEmployeesWithAccount() {
        return employeeRepository.findAll()
                .stream()
                .map(emp -> new EmployeeDTO(emp.getEmployeeId(), emp.getAccount()))
                .collect(Collectors.toList());
    }

    public void createEmployee(Employee employee) {
        employeeRepository.save(employee);
    }
}
