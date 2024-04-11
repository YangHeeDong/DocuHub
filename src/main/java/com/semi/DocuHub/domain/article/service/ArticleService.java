package com.semi.DocuHub.domain.article.service;

import com.semi.DocuHub.domain.article.repository.ArticleRepository;
import com.semi.DocuHub.domain.article.request.ArticleRequest;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    public RsData create(ArticleRequest.CreateReq createReq) {

        // 팀이라면 팀 회원인지 확인

        return RsData.of("","");
    }
}
