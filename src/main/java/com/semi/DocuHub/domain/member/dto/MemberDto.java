package com.semi.DocuHub.domain.member.dto;

import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class MemberDto {

    private Long id ;
    private String username;
    private String email;
    private LocalDateTime createDate;
    private String memberImgPath;

    public MemberDto(Member member){

        this.id = member.getId();
        this.username = member.getUsername();
        this.email = member.getEmail();
        this.createDate =member.getCreateDate();

    }

    public MemberDto(Member member, Image memberImg){

        this.id = member.getId();
        this.username = member.getUsername();
        this.email = member.getEmail();
        this.createDate =member.getCreateDate();
        this.memberImgPath = memberImg.getPath();

    }
}
