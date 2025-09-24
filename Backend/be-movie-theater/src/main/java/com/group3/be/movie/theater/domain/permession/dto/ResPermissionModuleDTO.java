package com.group3.be.movie.theater.domain.permession.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResPermissionModuleDTO {
    private String module;
    private List<PermissionModule> permissionModules;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PermissionModule{
        private Long id;
        private String name;
        private String apiPath;
        private String method;
    }

}
