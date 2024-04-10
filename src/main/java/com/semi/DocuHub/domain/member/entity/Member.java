package com.semi.DocuHub.domain.member.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.semi.DocuHub.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Member extends BaseEntity {

    private String username;

    @JsonIgnore
    private String password;

    private String email;

}
