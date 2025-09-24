package com.group3.be.movie.theater.domain.permession;

import com.group3.be.movie.theater.domain.permession.dto.ReqPermissionDTO;
import com.group3.be.movie.theater.domain.permession.dto.ResPermissionDTO;
import com.group3.be.movie.theater.domain.permession.dto.ResPermissionModuleDTO;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.permission.PermissionIdExists;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/permission")
@AllArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public ResponseEntity<List<Permission>> getPermission() {
        return ResponseEntity.ok().body(permissionService.getAllPermissions());
    }

    @GetMapping("/permissionDto")
    public ResponseEntity<List<ResPermissionModuleDTO>> getPermissionDTO() {
        return ResponseEntity.ok().body(permissionService.getAllPermissionsDto());
    }

    @PostMapping
    public ResponseEntity<Permission> createPermission(@Validated(OnCreate.class) @RequestBody ReqPermissionDTO reqPermissionDTO) {
        if (permissionService.isExistPermission(reqPermissionDTO)) {
            throw new IdInvalidException("Permission already exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(permissionService.createPermission(reqPermissionDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Permission> updatePermission(@PathVariable("id") @PermissionIdExists Long id, @Validated @RequestBody ReqPermissionDTO reqPermissionDTO) {
        if (permissionService.existsByPermissionNameAndIdNot(reqPermissionDTO.getName(), id)) {
            throw new IdInvalidException("Permission name already exists");
        }
        return ResponseEntity.ok().body(permissionService.updatePermission(id, reqPermissionDTO));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable("id") @PermissionIdExists Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }
}
