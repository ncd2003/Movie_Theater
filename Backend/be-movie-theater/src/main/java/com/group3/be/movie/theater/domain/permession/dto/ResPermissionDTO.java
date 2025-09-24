package com.group3.be.movie.theater.domain.permession.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPermissionDTO {
    private Long id;
    private String module;
    private String apiPath;
    private String method;
}
