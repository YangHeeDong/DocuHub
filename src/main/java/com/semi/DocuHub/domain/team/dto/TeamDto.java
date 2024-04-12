package com.semi.DocuHub.domain.team.dto;

import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TeamDto {

    private String teamName;

    private String teamDescription;

    private List<Member> teamMemberList;

    private Image teamImg;

    public TeamDto(Team team, Image teamImg) {
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamMemberList = team.getTeamMemberList().stream().map(TeamMember::getTeamMember).toList();
        this.teamImg = teamImg;
    }
}
