package com.group3.be.movie.theater.domain.permession;

import com.group3.be.movie.theater.domain.permession.dto.ReqPermissionDTO;
import com.group3.be.movie.theater.domain.permession.dto.ResPermissionModuleDTO;
import com.group3.be.movie.theater.util.BaseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final BaseService baseService;

    public List<Permission> getAllPermissions() {
        return permissionRepository.findByActiveTrue();
    }

    public List<ResPermissionModuleDTO> getAllPermissionsDto() {
        List<String> modules = List.of("Account", "CinemaRoom", "Movie", "Permission", "Promotion", "Role", "Schedule", "ScheduleSeat", "Seat","SeatStatus", "SeatType","ShowDate","Invoice", "Ticket","File","Type");
        List<ResPermissionModuleDTO> resPermissionDTOList = new ArrayList<>();

        modules.forEach(m -> {
                    List<Permission> permissions = permissionRepository.findByModuleAndActiveTrue(m);
                    if (!permissions.isEmpty()) {
                        ResPermissionModuleDTO permissionDTO = new ResPermissionModuleDTO();
                        permissionDTO.setModule(m);
                        permissionDTO.setPermissionModules(permissions.stream().map(p -> baseService.convertObjectToObject(p, ResPermissionModuleDTO.PermissionModule.class)).toList());
                        resPermissionDTOList.add(permissionDTO);
                    }
                }
        );
        return resPermissionDTOList;
    }

    public Permission createPermission(ReqPermissionDTO reqPermissionDTO) {
        return permissionRepository.save(baseService.convertObjectToObject(reqPermissionDTO, Permission.class));
    }

    public Permission updatePermission(Long id, ReqPermissionDTO reqPermissionDTO) {
        Permission permissionDB = findPermissionById(id);
        permissionDB.setName(reqPermissionDTO.getName());
        permissionDB.setApiPath(reqPermissionDTO.getApiPath());
        permissionDB.setModule(reqPermissionDTO.getModule());
        permissionDB.setMethod(reqPermissionDTO.getMethod());
        return permissionRepository.save(permissionDB);
    }

    public void deletePermission(Long id) {
        Permission permissionDB = findPermissionById(id);
        permissionDB.setActive(false);
        permissionRepository.save(permissionDB);
    }

    public boolean existsByPermissionNameAndIdNot(String permissionName, Long id) {
        return permissionRepository.existsByNameAndIdNotAndActiveTrue(permissionName, id);
    }

    public Permission findPermissionById(Long id) {
        return permissionRepository.findById(id).orElse(null);
    }

    public boolean isExistPermission(ReqPermissionDTO reqPermissionDTO) {
        return permissionRepository.existsByApiPathAndMethodAndModule(reqPermissionDTO.getApiPath(), reqPermissionDTO.getMethod(), reqPermissionDTO.getModule());
    }

    public boolean isExistPermissionByPermissionName(String permissionName) {
        return permissionRepository.existsByNameAndActiveTrue(permissionName);
    }

    public boolean isExistPermissionById(Long id) {
        return permissionRepository.existsById(id);
    }

    public void createDefaultPermission() {
        List<Permission> arr = new ArrayList<>();

        // Account
        arr.add(new Permission("Get all account", "/api/v1/account", "GET", "Account"));
        arr.add(new Permission("Create a account", "/api/v1/account", "POST", "Account"));
        arr.add(new Permission("Update a account", "/api/v1/account/{id}", "PUT", "Account"));
        arr.add(new Permission("Delete a account", "/api/v1/account/{id}", "DELETE", "Account"));
        arr.add(new Permission("Fetch a account by identity card", "/api/v1/account/search", "POST", "Account"));
        arr.add(new Permission("Change password", "/api/v1/auth/request-password-reset", "POST", "Account"));
        arr.add(new Permission("Get current user", "/api/v1/account/profile", "GET", "Account"));
        arr.add(new Permission("Get current user", "/api/v1/auth/account", "GET", "Account"));
        arr.add(new Permission("Verify OTP", "/api/v1/auth/verify-otp", "GET", "Account"));
        arr.add(new Permission("Reset Password", "/api/v1/auth/reset-password", "POST", "Account"));
        arr.add(new Permission("Get a account by email or phone number", "/api/v1/account/search", "GET", "Account"));
        arr.add(new Permission("Update Status", "/api/v1/account/updateStatus/{id}", "PUT", "Account"));


        // Cinema room
        arr.add(new Permission("Get all cinema room", "/api/v1/cinema-room", "GET", "CinemaRoom"));
        arr.add(new Permission("Create a cinema room", "/api/v1/cinema-room", "POST", "CinemaRoom"));
        arr.add(new Permission("Update a cinema room", "/api/v1/cinema-room/{id}", "PUT", "CinemaRoom"));
        arr.add(new Permission("Delete a cinema room", "/api/v1/cinema-room/{id}", "DELETE", "CinemaRoom"));
        arr.add(new Permission("Get a cinema room by id", "/api/v1/cinema-room/{id}", "GET", "CinemaRoom"));
        arr.add(new Permission("Get a cinema room by id", "/api/v1/cinema-room/{id}", "GET", "CinemaRoom"));

        // Invoice
        arr.add(new Permission("Get all invoices", "/api/v1/invoice", "GET", "Invoice"));
        arr.add(new Permission("Create a invoice", "/api/v1/invoice/createInvoice/{accountId}", "POST", "Invoice"));
        arr.add(new Permission("Update a invoice", "/api/v1/invoice/{invoiceId}/update-status", "PUT", "Invoice"));
        arr.add(new Permission("Get all invoices by date", "/api/v1/invoice/by-date", "GET", "Invoice"));
        arr.add(new Permission("Get all invoices by account id", "/api/v1/invoice/{accId}", "GET", "Invoice"));
        arr.add(new Permission("Search invoices", "/api/v1/invoice/search", "GET", "Invoice"));

        // Movie
        arr.add(new Permission("Create a movie", "/api/v1/movies", "POST", "Movie"));
        arr.add(new Permission("Update a movie", "/api/v1/movies/{id}", "PUT", "Movie"));
        arr.add(new Permission("Delete a movie", "/api/v1/movies/{id}", "DELETE", "Movie"));
        arr.add(new Permission("Get a movie by id", "/api/v1/movies/{id}", "GET", "Movie"));
        arr.add(new Permission("Add types to a movie", "/api/v1/movies/{id}/types", "POST", "Movie"));
        arr.add(new Permission("Search movies by name", "/api/v1/movies/search", "GET", "Movie"));
        arr.add(new Permission("Add image to movie", "/api/v1/movies/{id}/image", "POST", "Movie"));
        arr.add(new Permission("Get all movie", "/api/v1/movies", "GET", "Movie"));

        // Permission
        arr.add(new Permission("Get all permission room", "/api/v1/permission", "GET", "Permission"));
        arr.add(new Permission("Create a permission", "/api/v1/permission", "POST", "Permission"));
        arr.add(new Permission("Update a permission", "/api/v1/permission/{id}", "PUT", "Permission"));
        arr.add(new Permission("Delete a permission", "/api/v1/permission/{id}", "DELETE", "Permission"));
        arr.add(new Permission("Get all permission dto", "/api/v1/permission/permissionDto", "GET", "Permission"));

        // Promotion
        arr.add(new Permission("Get all promotion", "/api/v1/promotions", "GET", "Promotion"));
        arr.add(new Permission("Create a promotion", "/api/v1/promotions", "POST", "Promotion"));
        arr.add(new Permission("Update a promotion", "/api/v1/promotions/{id}", "PUT", "Promotion"));
        arr.add(new Permission("Delete a promotion", "/api/v1/promotions/{id}", "DELETE", "Promotion"));
        arr.add(new Permission("Get a promotion by id", "/api/v1/promotions/{id}", "GET", "Promotion"));

        // Role
        arr.add(new Permission("Get all role", "/api/v1/role", "GET", "Role"));
        arr.add(new Permission("Update a role", "/api/v1/role/{id}", "PUT", "Role"));
        arr.add(new Permission("Get all permission role by id", "/api/v1/role/{id}", "GET", "Role"));
        arr.add(new Permission("Get all role dto", "/api/v1/role/roleDto", "GET", "Role"));

        // Schedule
        arr.add(new Permission("Add a single schedule", "/api/v1/schedules/add", "POST", "Schedule"));
        arr.add(new Permission("Add multiple schedules within a date range for a specific movie", "/api/v1/schedules/add-range", "POST", "Schedule"));
        arr.add(new Permission("Get all schedules for a specific show date", "/api/v1/schedules/show-date/{showDateId}", "GET", "Schedule"));
        arr.add(new Permission("Delete schedules within a date range for a specific movie", "/api/v1/schedules/delete-range", "DELETE", "Schedule"));
        arr.add(new Permission("Get all schedule", "/api/v1/schedules/movie-date", "GET", "Schedule"));
        arr.add(new Permission("Find a schedule by id", "/api/v1/schedules", "GET", "Schedule"));
        arr.add(new Permission("Delete all schedule of a show date", "/api/v1/schedules/show-date/{showDateId}", "DELETE", "Schedule"));

        // Schedule seat
        arr.add(new Permission("Display schedule seat", "/api/v1/seat-schedule/{id}", "GET", "ScheduleSeat"));
        arr.add(new Permission("Add schedule seat", "/api/v1/seat-schedule", "POST", "ScheduleSeat"));

        // Seat
        arr.add(new Permission("Display setup seats", "/api/v1/seat/{id}", "GET", "Seat"));
        arr.add(new Permission("Create setup seats", "/api/v1/seat/{id}", "POST", "Seat"));
        arr.add(new Permission("Update setup seats", "/api/v1/seat/{id}", "PUT", "Seat"));
        arr.add(new Permission("Check exist room in seat", "/api/v1/seat/existedRoomInSeat/{id}", "GET", "Seat"));
        arr.add(new Permission("Fetch seat by row,col and roomId", "/api/v1/seat/findByRowColRoomId/{id}", "GET", "Seat"));

        // Seat status
        arr.add(new Permission("Get all seat status", "/api/v1/seat-status", "GET", "SeatStatus"));
        arr.add(new Permission("Create a seat status", "/api/v1/seat-status", "POST", "SeatStatus"));
        arr.add(new Permission("Update a seat status", "/api/v1/seat-status/{id}", "PUT", "SeatStatus"));
        arr.add(new Permission("Delete a seat status", "/api/v1/seat-status/{id}", "DELETE", "SeatStatus"));
        arr.add(new Permission("Get all seat status dto", "/api/v1/seat-status/seatStatusDto", "GET", "SeatStatus"));

        // Seat type
        arr.add(new Permission("Get all seat type", "/api/v1/seat-type", "GET", "SeatType"));
        arr.add(new Permission("Create a seat type", "/api/v1/seat-type", "POST", "SeatType"));
        arr.add(new Permission("Update a seat type", "/api/v1/seat-type/{id}", "PUT", "SeatType"));
        arr.add(new Permission("Delete a seat type", "/api/v1/seat-type/{id}", "DELETE", "SeatType"));
        arr.add(new Permission("Get all seat type dto", "/api/v1/seat-type/seatTypeDto", "GET", "SeatType"));

        // Show date
        arr.add(new Permission("Add show date", "/api/v1/show-dates", "POST", "ShowDate"));
        arr.add(new Permission("Add show date", "/api/v1/show-dates/range", "POST", "ShowDate"));
        arr.add(new Permission("Add show date", "/api/v1/show-dates/movie/{movieId}", "GET", "ShowDate"));
        arr.add(new Permission("Add room to show date", "/api/v1/show-dates/room", "PUT", "ShowDate"));

        // Ticket
        arr.add(new Permission("Get all type", "/api/v1/type", "GET", "Type"));
        arr.add(new Permission("Create a type", "/api/v1/type", "POST", "Type"));
        arr.add(new Permission("Get a type by id", "/api/v1/type/{id}", "GET", "Type"));
        arr.add(new Permission("Delete a type", "/api/v1/type/{id}", "DELETE", "Type"));
        arr.add(new Permission("Get types by movie id", "/api/v1/type/movie/{movieId}", "GET", "Type"));

        // Payment
        arr.add(new Permission("Create payment", "/api/v1/vn-pay", "POST", "Type"));
        arr.add(new Permission("Payment callback", "/api/v1/payment-callback", "GET", "Type"));

        //File
        arr.add(new Permission("Save File", "/api/v1/file/upload", "POST", "File"));
        arr.add(new Permission("Delete File", "/api/v1/file/delete", "POST", "File"));

        permissionRepository.saveAll(arr);
    }
}