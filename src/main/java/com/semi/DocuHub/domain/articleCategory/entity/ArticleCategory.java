package com.semi.DocuHub.domain.articleCategory.entity;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.global.jpa.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class ArticleCategory extends BaseEntity {

    private Boolean isTeam;
    private Long relationId;

    @OneToMany(mappedBy = "articleCategory", cascade = CascadeType.REMOVE)
    private List<Article> articles;

}
