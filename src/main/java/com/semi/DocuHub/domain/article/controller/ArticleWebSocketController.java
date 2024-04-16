package com.semi.DocuHub.domain.article.controller;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.article.service.ArticleService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.*;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ArticleWebSocketController {

    private final ArticleService articleService;
    private final Rq rq;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SocketReq {
        Long id;
        Long memberId;
        String content;
    }

    @MessageMapping("/article/{articleId}/send")
    @SendTo("/topic/public/article/{articleId}")
    public String sendMessage(@DestinationVariable Long articleId, @Payload SocketReq sq) {

        Article result = articleService.findByIdForWebSocket(sq.getMemberId(),sq.getId());

        if(result == null) {
            return "";
        }

        Article article = result.toBuilder().content(sq.getContent())
                .build();

        articleService.update(article);

        return sq.getContent();
    }
}

