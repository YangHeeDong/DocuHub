package com.semi.DocuHub.domain.team.dto;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.member.dto.MemberDto;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TeamDto {

    private Long id;

    private MemberDto teamAdmin;

    private String teamName;

    private String teamDescription;

    private List<MemberDto> teamMemberList;

    private List<MemberDto> teamInviteList;

    private Image teamImg;

    public TeamDto(Team team, Image teamImg, Image teamAdminImg,List<MemberDto> teamMemberList,List<MemberDto> teamInviteList) {
        this.id = team.getId();
        this.teamAdmin = new MemberDto(team.getTeamAdmin(), teamAdminImg);
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamMemberList = teamMemberList;
        this.teamInviteList = teamInviteList;
        this.teamImg = teamImg;
    }

    public TeamDto(Team team, Image teamImg, Image teamAdminImg) {
        this.id = team.getId();
        this.teamAdmin = new MemberDto(team.getTeamAdmin(), teamAdminImg);
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamImg = teamImg;
    }

    public TeamDto(Team team) {
        this.id = team.getId();
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamImg = null;
    }
}
