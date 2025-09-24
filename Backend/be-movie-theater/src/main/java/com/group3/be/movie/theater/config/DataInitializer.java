package com.group3.be.movie.theater.config;

import com.group3.be.movie.theater.domain.account.AccountService;
import com.group3.be.movie.theater.domain.permession.Permission;
import com.group3.be.movie.theater.domain.permession.PermissionService;
import com.group3.be.movie.theater.domain.role.RoleService;
import com.group3.be.movie.theater.domain.seat_status.SeatStatus;
import com.group3.be.movie.theater.domain.seat_status.SeatStatusService;
import com.group3.be.movie.theater.domain.seat_type.SeatTypeService;
import com.group3.be.movie.theater.domain.type.TypeService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SeatTypeService seatTypeService;
    private final SeatStatusService seatStatusService;
    private final RoleService roleService;
    private final PermissionService permissionService;
    private final AccountService accountService;
    private final TypeService typeService;

    @Override
    public void run(String... args) throws Exception {
        // Seat type
        if (seatTypeService.listAllSeatType().isEmpty()) {
            seatTypeService.createDefaultSeatType();
        }
        // Seat status
        if (seatStatusService.getAllSeatStatus().isEmpty()) {
            seatStatusService.createDefaultSeatStatus();
        }
        // Permission
        if (permissionService.getAllPermissions().isEmpty()) {
            permissionService.createDefaultPermission();
        }
        // Role
        if (roleService.getAllRoles().isEmpty()) {
            roleService.createDefaultRole();
        }
        // Account
        if(accountService.handleGetAllAccounts().isEmpty()){
            accountService.createDefaultAccount();
        }
        //Types
        if(typeService.getAllType().isEmpty()){
            typeService.createDefaultMovieTypes();
        }

    }
}
