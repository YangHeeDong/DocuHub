package com.semi.DocuHub.domain.teamMember.service;

import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import com.semi.DocuHub.domain.teamMember.repository.TeamMemberRepository;
import com.semi.DocuHub.global.rq.Rq;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final ImageService imageService;
    private final Rq rq;

    @Transactional
    public void create(Team team) {

        TeamMember teamMember = TeamMember.builder()
                .teamMember(rq.getMember())
                .team(team)
                .build();

        teamMemberRepository.save(teamMember);

    }

    public List<TeamDto> getTeam(Member teamMember) {

        List<TeamMember> teamMemberList = teamMemberRepository.findAllByTeamMember(teamMember);

        List<TeamDto> teamList = teamMemberList.stream().map(tm -> {
            return new TeamDto(tm.getTeam(),imageService.getImage("team",tm.getTeam().getId()));
        }).toList();

        return teamList;
    }
}