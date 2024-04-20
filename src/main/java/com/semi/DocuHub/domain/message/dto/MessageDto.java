package com.semi.DocuHub.domain.message.dto;

import com.semi.DocuHub.domain.member.dto.MemberDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private MemberDto sender;
    private MemberDto receiver;
    private String content;
    private Boolean isCheck;

}
