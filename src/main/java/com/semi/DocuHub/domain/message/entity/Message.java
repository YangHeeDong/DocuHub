package com.semi.DocuHub.domain.message.entity;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Message extends BaseEntity {

    @ManyToOne
    private Member sender;

    @ManyToOne
    private Member receiver;

    private String content;

    private Boolean isCheck;

}
