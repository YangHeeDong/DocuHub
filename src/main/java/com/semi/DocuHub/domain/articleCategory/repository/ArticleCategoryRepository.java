package com.semi.DocuHub.domain.articleCategory.repository;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.articleCategory.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Long> {
    Optional<ArticleCategory> findByRelationIdAndIsTeam(Long id, boolean isTeam);
}
