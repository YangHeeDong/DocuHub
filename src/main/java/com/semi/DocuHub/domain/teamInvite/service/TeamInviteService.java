package com.semi.DocuHub.domain.teamInvite.service;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.message.service.MessageService;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamInvite.entity.TeamInvite;
import com.semi.DocuHub.domain.teamInvite.repository.TeamInviteRepository;
import com.semi.DocuHub.domain.teamMember.service.TeamMemberService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamInviteService {

    private final TeamInviteRepository teamInviteRepository;
    private final TeamMemberService teamMemberService;
    private final MessageService messageService;
    private final Rq rq;

    public RsData invite(Team team, Member member) {

        Optional<TeamInvite> ti = teamInviteRepository.findByTeamAndMember(team,member);

        if(ti.isPresent()){
            return RsData.of("F-1","이미 요청한 멤버입니다.");
        }

        TeamInvite teamInvite = TeamInvite.builder().team(team).member(member).build();

        teamInvite = teamInviteRepository.save(teamInvite);

        messageService.create(member,"TeamInvite "+team.getTeamName()+" "+teamInvite.getId());

        return RsData.of("S-1","초대 요청을 보냈습니다.");
    }

    @Transactional
    public RsData inviteAcceptOrReject(Long teamInviteId, boolean b) {

        Optional<TeamInvite> temp = teamInviteRepository.findById(teamInviteId);
        
        if(temp.isEmpty()){
            return RsData.of("F-1","유효하지 않은 접근 입니다.");
        }
        
        TeamInvite ti = temp.get();
        
        if(ti.getMember().getId() != rq.getMember().getId()){
            return RsData.of("F-2","유효하지 않은 접근 입니다.");
        }

        if(b){
            teamMemberService.create(ti.getTeam(),"member");
        }

        teamInviteRepository.delete(ti);

        return RsData.of("S-1",b? "팀원 요청을 수락하였습니다." : "팀원 요청을 거절하였습니다." );
    }
}
