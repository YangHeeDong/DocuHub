package com.semi.DocuHub.domain.team.controller;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.article.service.ArticleService;
import com.semi.DocuHub.domain.articleCategory.service.ArticleCategoryService;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.request.TeamRequest;
import com.semi.DocuHub.domain.team.response.TeamResponse;
import com.semi.DocuHub.domain.team.service.TeamService;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/team")
@RequiredArgsConstructor
public class ApiV1TeamController {

    private final TeamService teamService;
    private final ArticleService articleService;
    private final ArticleCategoryService articleCategoryService;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public RsData<TeamDto> create (@Valid TeamRequest.TeamCreateReq req, BindingResult br, @RequestParam(name = "teamImg", required = false) MultipartFile teamImg) {

        if(br.hasErrors()){
            return RsData.of("F-1","팀 생성 정보를 알맞게 입력해 주세요");
        }

        RsData<Team> result = teamService.save(req, teamImg);

        if(result.getIsFail()) return RsData.of(result.getResultCode(), result.getMsg());

        return RsData.of(result.getResultCode(), result.getMsg(), new TeamDto(result.getData()) );
    }

    @GetMapping("/getTeams")
    @PreAuthorize("isAuthenticated()")
    public RsData<TeamResponse.GetTeamsRes> getTeams ( @RequestParam(value="page", defaultValue="0") int page ) {

        RsData<Page<TeamDto>> result = teamService.getTeams(page);

        return RsData.of(result.getResultCode(), result.getMsg(), new TeamResponse.GetTeamsRes(result.getData()));
    }

    @GetMapping("/getTeam/{id}")
    @PreAuthorize("isAuthenticated()")
    public RsData<TeamResponse.GetTeamRes> getTeam ( @PathVariable(name = "id") Long id ) {

        RsData<TeamDto> result = teamService.getTeamById(id);

        if(result.getIsFail()) return RsData.of(result.getResultCode(), result.getMsg());

        List<Article> articles = articleService.findByTeamId(result.getData().getId());

        return RsData.of(result.getResultCode(), result.getMsg(), new TeamResponse.GetTeamRes(result.getData(),articles));
    }

    @PatchMapping("/edit")
    public RsData<TeamDto> edit (@Valid TeamRequest.TeamEditReq req, BindingResult br, @RequestParam(name = "teamImg", required = false) MultipartFile teamImg) {

        if(br.hasErrors()){
            return RsData.of("F-1","팀 생성 정보를 알맞게 입력해 주세요");
        }

        RsData<Team> result = teamService.edit(req, teamImg);

        if(result.getIsFail()) return RsData.of(result.getResultCode(), result.getMsg());

        return RsData.of(result.getResultCode(), result.getMsg(), new TeamDto(result.getData()) );
    }

    @DeleteMapping("/{id}")
    public RsData delete (@PathVariable(name = "id") Long id) {

        RsData result = teamService.delete(id);

        if(result.getIsFail()) return RsData.of(result.getResultCode(), result.getMsg());

        articleCategoryService.deleteArticleByTeamId(id);

        return RsData.of(result.getResultCode(), result.getMsg());
    }

}
