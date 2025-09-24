package com.group3.be.movie.theater.domain.role.dto;

import com.group3.be.movie.theater.domain.permession.dto.ResPermissionDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ResPermissionRoleDTO {
    private Long roleId;
    private String roleName;
    private List<ResPermissionDTO> permissions;
    private Instant updatedAt;
}
