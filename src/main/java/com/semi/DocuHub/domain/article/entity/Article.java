package com.semi.DocuHub.domain.article.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.semi.DocuHub.domain.articleCategory.entity.ArticleCategory;
import com.semi.DocuHub.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Article extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    private ArticleCategory articleCategory;

    private String title;
    private String content;
    private Long View;

    private String sharing;
}
