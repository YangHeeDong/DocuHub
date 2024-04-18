package com.semi.DocuHub.domain.teamMember.service;

import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import com.semi.DocuHub.domain.teamMember.repository.TeamMemberRepository;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final ImageService imageService;
    private final Rq rq;

    @Transactional
    public void create(Team team, String authority) {

        TeamMember teamMember = TeamMember.builder()
                .teamMember(rq.getMember())
                .team(team)
                .authority(authority)
                .build();

        teamMemberRepository.save(teamMember);

    }

    public Page<TeamDto> getTeamsByMember(Member teamMember,int page) {

        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createDate"));

        Pageable pageable = PageRequest.of(page, 8, Sort.by(sorts));

        Page<TeamMember> teamMemberList = teamMemberRepository.findAllByTeamMember(teamMember,pageable);

        return teamMemberList.map(tm -> {
            return new TeamDto(tm.getTeam(),imageService.getImage("team",tm.getTeam().getId()),imageService.getImage("member",tm.getTeam().getTeamAdmin().getId()));
        });
    }

    public RsData delete(Team team, Member member) {


        Optional<TeamMember> teamMember = teamMemberRepository.findByTeamAndTeamMember(team,member);

        if(teamMember.isEmpty()) {
            return RsData.of("F-1","존재 하지 않는 팀원");
        }

        teamMemberRepository.delete(teamMember.get());

        return RsData.of("S-1","삭제 완료");

    }

    public RsData delete(Team team) {

        
        Optional<TeamMember> teamMember = teamMemberRepository.findByTeamAndTeamMember(team,rq.getMember());

        if(team.getTeamAdmin().getId() == rq.getMember().getId()){
            return RsData.of("F-2","팀장은 탈퇴할 수 없습니다.");
        }

        if(teamMember.isEmpty()) {
            return RsData.of("F-1","존재 하지 않는 팀원");
        }

        teamMemberRepository.delete(teamMember.get());

        return RsData.of("S-1","탈퇴 완료");

    }

    public RsData update(Team team, Member member) {

        Optional<TeamMember> teamMember = teamMemberRepository.findByTeamAndTeamMember(team,member);

        if(teamMember.isEmpty()) {
            return RsData.of("F-1","존재 하지 않는 팀원");
        }

        teamMemberRepository.save(teamMember.get().toBuilder().authority("member").build());

        return RsData.of("S-1","변경 완료");
    }
}
