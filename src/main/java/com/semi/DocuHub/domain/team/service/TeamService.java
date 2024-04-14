package com.semi.DocuHub.domain.team.service;

import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.repository.TeamRepository;
import com.semi.DocuHub.domain.team.request.TeamRequest;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import com.semi.DocuHub.domain.teamMember.service.TeamMemberService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final ImageService imageService;
    private final TeamMemberService teamMemberService;
    private final Rq rq;

    @SneakyThrows
    @Transactional
    public RsData<Team> save(TeamRequest.TeamCreateReq req, MultipartFile teamImg) {

        RsData valid = validTeam(req);

        if(valid.getIsFail()) return valid;

        Team team = Team.builder()
                .teamAdmin(rq.getMember())
                .teamName(req.getTeamName())
                .teamDescription(req.getTeamDescription())
                .build();

        teamRepository.save(team);

        imageService.saveTeamImg(team, teamImg);

        teamMemberService.create(team);

        return RsData.of("S-1","팀을 생성하였습니다.",team);
    }

    private RsData validTeam(TeamRequest.TeamCreateReq req) {

        if(teamRepository.existsByTeamName(req.getTeamName())) return RsData.of("F-1","이미 존재하는 팀 입니다.");

        return RsData.of("S-1","생성가능");
    }


    public RsData<Page<TeamDto>> getTeams(int page) {

        Member teamMember = rq.getMember();

        Page<TeamDto> teams = teamMemberService.getTeamsByMember(teamMember,page);

        return RsData.of("","",teams);

    }
}
