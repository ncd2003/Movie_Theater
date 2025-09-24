package com.group3.be.movie.theater.domain.permession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    boolean existsByApiPathAndMethodAndModule(String apiPath, String method, String module);

    boolean existsByNameAndIdNotAndActiveTrue(String permissionName, Long id);

    boolean existsByNameAndActiveTrue(String permissionName);

    List<Permission> findByActiveTrue();

    List<Permission> findByModuleAndActiveTrue(String module);
}
