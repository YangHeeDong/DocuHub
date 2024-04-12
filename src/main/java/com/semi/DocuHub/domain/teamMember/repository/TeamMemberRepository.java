package com.semi.DocuHub.domain.teamMember.repository;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findAllByTeamMember(Member teamMember);
}
