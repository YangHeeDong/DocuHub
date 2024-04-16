package com.semi.DocuHub.domain.article.repository;


import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.articleCategory.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article,Long> {
    boolean existsByTitleAndArticleCategory(String title, ArticleCategory ac);

    List<Article> findAllByArticleCategory(ArticleCategory ac);
}
