package com.semi.DocuHub.domain.article.controller;

import com.semi.DocuHub.domain.article.request.ArticleRequest;
import com.semi.DocuHub.domain.article.service.ArticleService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ApiV1ArticleController {

    private final ArticleService articleService;
    private final Rq rq;

    @PostMapping("/create")
    public RsData create (@Valid @RequestBody ArticleRequest.CreateReq createReq, BindingResult br) {

        if(br.hasErrors()){
            return RsData.of("F-1","유효한 정보가 아닙니다.");
        }

        RsData result = articleService.create(createReq);

        return RsData.of("","");
    }

}
