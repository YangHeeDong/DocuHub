package com.semi.DocuHub.domain.article.repository;


import com.semi.DocuHub.domain.article.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article,Long> {
}
