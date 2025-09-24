package com.group3.be.movie.theater.domain.role.dto;

import com.group3.be.movie.theater.domain.permession.dto.ReqPermissionDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Getter
@Setter
public class ReqRoleDTO {
    @NotBlank(message = "Role name cant be null")
    @Length(min = 1, max = 50)
    private String roleName;

    @NotBlank(message = "Description cant be null")
    @Length(min = 10, max = 255)
    private String description;

    private List<ReqPermissionDTO> permissions;
}
