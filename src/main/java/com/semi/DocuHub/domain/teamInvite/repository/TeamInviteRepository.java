package com.semi.DocuHub.domain.teamInvite.repository;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.teamInvite.entity.TeamInvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamInviteRepository extends JpaRepository<TeamInvite, Long> {


    Optional<TeamInvite> findByTeamAndMember(Team team, Member member);
}
