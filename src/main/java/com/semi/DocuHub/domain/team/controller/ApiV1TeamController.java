package com.semi.DocuHub.domain.team.controller;

import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.request.TeamRequest;
import com.semi.DocuHub.domain.team.response.TeamResponse;
import com.semi.DocuHub.domain.team.service.TeamService;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public RsData<Team> create (@Valid TeamRequest.TeamCreateReq req, BindingResult br, @RequestParam(name = "teamImg", required = false) MultipartFile teamImg) {

        if(br.hasErrors()){
            return RsData.of("F-1","팀 생성 정보를 알맞게 입력해 주세요");
        }

        RsData<Team> result = teamService.save(req, teamImg);

        if(result.getIsFail()) return RsData.of(result.getResultCode(), result.getMsg());

        return RsData.of(result.getResultCode(), result.getMsg(), result.getData() );
    }

    @GetMapping("/getTeams")
    @PreAuthorize("isAuthenticated()")
    public RsData<TeamResponse.GetTeamsRes> getTeams () {

        RsData<List<TeamDto>> result = teamService.getTeams();

        return RsData.of(result.getResultCode(), result.getMsg(), new TeamResponse.GetTeamsRes(result.getData()));
    }


}
