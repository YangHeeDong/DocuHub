package com.semi.DocuHub.domain.article.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ArticleRequest {

    @Getter
    public static class CreateReq {

        @NotBlank
        private String title;

        @NotBlank
        private Boolean isTeam;

        @NotBlank
        private Long teamId;

        @NotBlank
        private String sharing;

    }



}
