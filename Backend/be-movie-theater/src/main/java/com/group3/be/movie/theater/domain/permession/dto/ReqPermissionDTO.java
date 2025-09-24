package com.group3.be.movie.theater.domain.permession.dto;

import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.permission.PermissionNameExists;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class ReqPermissionDTO {
    @NotBlank(message = "Permission name cant be null")
    @Length(min = 1, max = 50)
    @PermissionNameExists(groups = OnCreate.class)
    private String name;

    @NotBlank(message = "Permission method cant be null")
    private String method;

    @NotBlank(message = "Permission apiPath cant be null")
    private String apiPath;

    @NotBlank(message = "Permission module cant be null")
    private String module;
}
