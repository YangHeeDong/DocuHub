package com.semi.DocuHub.domain.article.response;

import com.semi.DocuHub.domain.article.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
public class ArticleResponse {

    @Getter
    @Setter
    @AllArgsConstructor
    public static class createRes {
        Article article;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class getRes {
        Article article;
    }

}
