package com.semi.DocuHub.domain.team.dto;

import com.semi.DocuHub.domain.article.entity.Article;
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

    private Long id;

    private Member teamAdmin;

    private String teamName;

    private String teamDescription;

    private List<Member> teamMemberList;

    private Image teamImg;

    private List<Article> articles;

    public TeamDto(Team team, Image teamImg, List<Article> articles) {
        this.id = team.getId();
        this.teamAdmin = team.getTeamAdmin();
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamMemberList = team.getTeamMemberList().stream().map(TeamMember::getTeamMember).toList();
        this.teamImg = teamImg;
        this.articles = articles;
    }

    public TeamDto(Team team, Image teamImg) {
        this.id = team.getId();
        this.teamAdmin = team.getTeamAdmin();
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamMemberList = team.getTeamMemberList().stream().map(TeamMember::getTeamMember).toList();
        this.teamImg = teamImg;
    }

    public TeamDto(Team team) {
        this.id = team.getId();
        this.teamAdmin = team.getTeamAdmin();
        this.teamName = team.getTeamName();
        this.teamDescription = team.getTeamDescription();
        this.teamImg = null;
    }
}
