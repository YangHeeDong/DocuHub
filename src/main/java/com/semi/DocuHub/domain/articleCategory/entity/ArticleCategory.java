package com.semi.DocuHub.domain.articleCategory.entity;

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
public class ArticleCategory extends BaseEntity {

    private Boolean isTeam;
    private Long relationId;

}
