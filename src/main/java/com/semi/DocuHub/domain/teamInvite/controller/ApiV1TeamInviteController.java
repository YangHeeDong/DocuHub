package com.semi.DocuHub.domain.teamInvite.controller;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.service.TeamService;
import com.semi.DocuHub.domain.teamInvite.entity.TeamInvite;
import com.semi.DocuHub.domain.teamInvite.request.TeamInviteReq;
import com.semi.DocuHub.domain.teamInvite.service.TeamInviteService;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teamInvite")
@RequiredArgsConstructor
public class ApiV1TeamInviteController {

    private final TeamInviteService teamInviteService;
    private final MemberService memberService;
    private final TeamService teamService;

    @PostMapping("")
    public RsData invite (@Valid @RequestBody TeamInviteReq.inviteReq req, BindingResult br) {

        Team team = teamService.getTeamByIdForTeamMember(req.getTeamId());
        Member member = memberService.findById(req.getMemberId());

        return teamInviteService.invite(team, member);
    }

}
