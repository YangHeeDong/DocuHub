package com.semi.DocuHub.domain.message.repository;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    List<Message> findBySenderOrReceiver(Member member,Member member2);
}
