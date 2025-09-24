package com.group3.be.movie.theater.domain.role;

import com.group3.be.movie.theater.domain.permession.Permission;
import com.group3.be.movie.theater.domain.permession.PermissionService;
import com.group3.be.movie.theater.domain.role.dto.ResPermissionRoleDTO;
import com.group3.be.movie.theater.domain.role.dto.ResRoleDTO;
import com.group3.be.movie.theater.domain.seat_status.SeatStatus;
import com.group3.be.movie.theater.util.BaseService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final BaseService baseService;
    private final PermissionService permissionService;

    public List<ResRoleDTO> getAllRoleDTO() {
        return roleRepository.findAll().stream().map((r) -> baseService.convertObjectToObject(r, ResRoleDTO.class)).toList();
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional
    public void createDefaultRole() {
        Role admin = new Role();
        admin.setRoleName("Admin");
        admin.setDescription("The Admin has the highest authority in the system. They can manage users, assign roles, control content, configure system settings, and access all data.");
        admin.setPermissions(permissionService.getAllPermissions());
        Role employee = new Role();
        employee.setRoleName("Employee");
        employee.setDescription("The Employee has moderate access, mainly handling tasks related to their job. They do not have administrative or user management privileges.");
        Role member = new Role();
        member.setRoleName("Member");
        member.setDescription("The Member is a regular user who can use system services but has no administrative rights.");
        // save
        roleRepository.saveAllAndFlush(List.of(admin, employee, member));
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public Role updateRole(Long id, List<Long> selectedPermissions) {
        Role roleDB = findRoleById(id);
        List<Permission> permissions = new ArrayList<>();
        selectedPermissions.forEach(p -> permissions.add(permissionService.findPermissionById(p)));
        roleDB.setPermissions(permissions);
        return roleRepository.save(roleDB);
    }

    public Role findRoleById(Long id) {
        return roleRepository.findById(id).orElse(null);
    }
    public ResPermissionRoleDTO findPermissionRoleById(Long id) {
        return baseService.convertObjectToObject(findRoleById(id), ResPermissionRoleDTO.class);
    }

    public Role findRoleByName(String name) {
        return roleRepository.findByRoleName(name).orElse(null);
    }

    public boolean isExistRoleById(Long id) {
        return roleRepository.existsById(id);
    }

}
