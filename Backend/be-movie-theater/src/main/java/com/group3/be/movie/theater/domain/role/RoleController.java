package com.group3.be.movie.theater.domain.role;

import com.group3.be.movie.theater.domain.role.dto.ResPermissionRoleDTO;
import com.group3.be.movie.theater.domain.role.dto.ResRoleDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.validation.role.RoleIdExists;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/role")
@AllArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok().body(roleService.getAllRoles());
    }

    @APIMessage("Update permission role")
    @PutMapping("/{id}")
    public ResponseEntity<Role> updatePermissionsRole(@PathVariable("id") @RoleIdExists Long id, @RequestBody List<Long> selectedPermissions) {
        return ResponseEntity.ok().body(roleService.updateRole(id, selectedPermissions));
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<ResPermissionRoleDTO> fetchPermissionRoleById(@PathVariable("id") @RoleIdExists Long id) {
        return ResponseEntity.ok().body(roleService.findPermissionRoleById(id));
    }

    @GetMapping("/roleDto")
    public ResponseEntity<List<ResRoleDTO>> getAllRolesDTO() {
        return ResponseEntity.ok().body(roleService.getAllRoleDTO());
    }

}
