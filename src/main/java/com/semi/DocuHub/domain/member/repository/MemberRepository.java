package com.semi.DocuHub.domain.member.repository;

import com.semi.DocuHub.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Member> findByUsername(String username);

    Optional<Member> findByRefreshToken(String refreshToken);

    Optional<Member> findByEmail(String email);

    List<Member> findByUsernameContaining(String searchParam);
}
