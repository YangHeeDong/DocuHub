package com.semi.DocuHub.domain.member.repository;

import com.semi.DocuHub.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
