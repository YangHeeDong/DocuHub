package com.semi.DocuHub.domain.message.controller;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.domain.message.request.MessageRequest;
import com.semi.DocuHub.domain.message.service.MessageService;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/message")
@RequiredArgsConstructor
public class ApiV1MessageController {

    private final MessageService messageService;
    private final MemberService memberService;

    @GetMapping("/{memberId}")
    public RsData getMessagesByMember (@PathVariable(name = "memberId") Long memberId) {
        Member member = memberService.findById(memberId);
        return messageService.getMessagesByMember(member);

    }

    @GetMapping("")
    public RsData getMessagesMember () {
        return messageService.getMessagesMember();

    }

    @PostMapping("")
    public RsData create (@RequestBody MessageRequest.CreateReq req) {

        Member reciveMember = memberService.findById(req.getMemberId());

        return messageService.create(reciveMember,req.getContent());

    }

}
