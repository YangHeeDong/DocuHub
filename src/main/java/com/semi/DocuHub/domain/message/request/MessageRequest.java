package com.semi.DocuHub.domain.message.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {

    @Getter
    @Setter
    public static class CreateReq {
        public Long memberId;
        public String username;
        public String content;
    }

}
