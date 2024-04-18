package com.semi.DocuHub.domain.article.controller;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.article.request.ArticleRequest;
import com.semi.DocuHub.domain.article.response.ArticleResponse;
import com.semi.DocuHub.domain.article.service.ArticleService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ApiV1ArticleController {

    private final ArticleService articleService;
    private final Rq rq;

    @PostMapping("/create")
    public RsData<ArticleResponse.createRes> create (@Valid @RequestBody ArticleRequest.CreateReq createReq, BindingResult br) {

        if(br.hasErrors()){
            return RsData.of("F-1","유효한 정보가 아닙니다.");
        }

        RsData<Article> result = articleService.create(createReq);

        if(result.getIsFail()){
            return RsData.of(result.getResultCode(), result.getMsg());
        }

        return RsData.of(result.getResultCode(),result.getMsg(), new ArticleResponse.createRes(result.getData()));
    }

    @GetMapping("/getArticle/{id}")
    public RsData<ArticleResponse.createRes> getArticle (@PathVariable(name = "id") Long id) {

        RsData<Article> result = articleService.findById(id);

        if(result.getIsFail()){
            return RsData.of(result.getResultCode(), result.getMsg());
        }

        return RsData.of(result.getResultCode(),result.getMsg(), new ArticleResponse.createRes(result.getData()));
    }

    @DeleteMapping ("/{id}")
    public RsData delete (@PathVariable(name = "id") Long id) {

        RsData result = articleService.delete(id);

        if(result.getIsFail()){
            return RsData.of(result.getResultCode(), result.getMsg());
        }

        return RsData.of(result.getResultCode(),result.getMsg());
    }

}
