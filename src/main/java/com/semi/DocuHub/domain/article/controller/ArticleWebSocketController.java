package com.semi.DocuHub.domain.article.controller;

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

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ii {
        Long id;
        String content;
    }

    @MessageMapping("/chat/rooms/{articleId}/send")
    @SendTo("/topic/public/rooms/{articleId}")
    public String sendMessage(@DestinationVariable Long articleId, @Payload ii i) {

        return i.getContent();
    }
}
