package com.semi.DocuHub.domain.article.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ArticleRequest {

    @Getter
    public static class CreateReq {

        @NotBlank
        private String title;

        @NotNull
        private Boolean isTeam;

        @NotNull
        private Long teamId;

    }



}
