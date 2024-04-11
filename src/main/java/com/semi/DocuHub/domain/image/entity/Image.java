package com.semi.DocuHub.domain.image.entity;

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
public class Image extends BaseEntity {

    private String relationEntity;

    private Long relationId;

    private String originalFileName;

    private String path;

}
