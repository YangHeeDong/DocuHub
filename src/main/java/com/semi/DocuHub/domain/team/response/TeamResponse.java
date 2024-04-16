package com.semi.DocuHub.domain.team.response;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class TeamResponse {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GetTeamsRes {

        Page<TeamDto> teams;

    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GetTeamRes {

        TeamDto team;
        List<Article> articles;

    }

}
