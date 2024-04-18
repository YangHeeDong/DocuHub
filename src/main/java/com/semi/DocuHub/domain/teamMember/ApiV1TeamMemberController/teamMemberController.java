package com.semi.DocuHub.domain.teamMember.ApiV1TeamMemberController;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.response.TeamResponse;
import com.semi.DocuHub.domain.team.service.TeamService;
import com.semi.DocuHub.domain.teamMember.service.TeamMemberService;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teamMember")
@RequiredArgsConstructor
public class teamMemberController {

    private final TeamMemberService teamMemberService;
    private final TeamService teamService;
    private final MemberService memberService;

    @DeleteMapping("/{teamId}/{memberId}")
    public RsData delete (@PathVariable(name = "teamId") Long teamId, @PathVariable(name = "memberId") Long memberId) {

        Team team = teamService.getTeamByIdForTeamMember(teamId);
        Member member = memberService.findById(memberId);

        return teamMemberService.delete(team,member);
    }

    @DeleteMapping("/{teamId}")
    public RsData leaveTeam (@PathVariable(name = "teamId") Long teamId) {

        Team team = teamService.getTeamByIdForTeamMember(teamId);

        return teamMemberService.delete(team);
    }

    @PatchMapping("/{teamId}/{memberId}")
    public RsData update (@PathVariable(name = "teamId") Long teamId, @PathVariable(name = "memberId") Long memberId) {

        Team team = teamService.getTeamByIdForTeamMember(teamId);
        Member member = memberService.findById(memberId);

        teamService.updateAdmin(team, member);

        return teamMemberService.update(team,member);
    }

}
