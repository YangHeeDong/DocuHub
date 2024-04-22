package com.semi.DocuHub.domain.message.controller;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.domain.message.entity.Message;
import com.semi.DocuHub.domain.message.request.MessageRequest;
import com.semi.DocuHub.domain.message.service.MessageService;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamInvite.service.TeamInviteService;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/message")
@RequiredArgsConstructor
public class ApiV1MessageController {

    private final MessageService messageService;
    private final TeamInviteService teamInviteService;
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

    @PatchMapping("/teamAccept/{id}")
    public RsData teamAccept (@PathVariable(name = "id") Long id) {

        RsData<Message> result = messageService.findById(id);

        if(result.getIsFail()){
            return result;
        }

        Long teamInviteId = Long.parseLong(result.getData().getContent().split(" ")[2]);

        RsData result2 = teamInviteService.inviteAcceptOrReject(teamInviteId,true);
        if(result2.getIsFail()){
            return result2;
        }

        messageService.update(result.getData(), result.getData().getContent().split(" ")[1] + "팀원 요청을 수락하였습니다.");

        return result2;
    }

    @PatchMapping("/teamReject/{id}")
    public RsData teamReject (@PathVariable(name = "id") Long id) {

        RsData<Message> result = messageService.findById(id);

        if(result.getIsFail()){
            return result;
        }

        Long teamInviteId = Long.parseLong(result.getData().getContent().split(" ")[2]);

        RsData result2 = teamInviteService.inviteAcceptOrReject(teamInviteId,false);

        if(result2.getIsFail()){
            return result2;
        }

        messageService.update(result.getData(), result.getData().getContent().split(" ")[1] + "팀원 요청을 거절 하였습니다.");

        return result2;
    }

}
