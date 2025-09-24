package com.group3.be.movie.theater.domain.permession;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.group3.be.movie.theater.domain.role.Role;
import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
//@AllArgsConstructor
@Entity
@Table(name = "MOVIETHEATER.PERMISSION")
public class Permission {
    @Id
    @Column(name = "PERMISSION_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PERMISSION_NAME")
    private String name;

    @Column(name = "PERMISSION_API_PATH")
    private String apiPath;

    @Column(name = "PERMISSION_METHOD")
    private String method;

    @Column(name = "PERMISSION_MODULE")
    private String module;

    @Column(name = "ACTIVE")
    private Boolean active = true;
    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;

    public Permission(String name, String apiPath, String method, String module) {
        this.name = name;
        this.apiPath = apiPath;
        this.method = method;
        this.module = module;
    }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "permissions")
    @JsonIgnore
    private List<Role> roles;

    @PrePersist
    public void handleBeforeCreateAt(){
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdateAt(){
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.updatedAt = Instant.now();
    }
}
