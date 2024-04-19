package com.semi.DocuHub.domain.teamInvite.service;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamInvite.entity.TeamInvite;
import com.semi.DocuHub.domain.teamInvite.repository.TeamInviteRepository;
import com.semi.DocuHub.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamInviteService {

    private final TeamInviteRepository teamInviteRepository;

    public RsData invite(Team team, Member member) {

        Optional<TeamInvite> ti = teamInviteRepository.findByTeamAndMember(team,member);

        if(ti.isPresent()){
            return RsData.of("F-1","이미 요청한 멤버입니다.");
        }

        TeamInvite teamInvite = TeamInvite.builder().team(team).member(member).build();

        teamInviteRepository.save(teamInvite);

        return RsData.of("S-1","초대 요청을 보냈습니다.");
    }
}
