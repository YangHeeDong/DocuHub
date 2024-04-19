package com.semi.DocuHub.domain.member.response;

import com.semi.DocuHub.domain.member.dto.MemberDto;
import com.semi.DocuHub.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
public class MemberResponse {

    @NoArgsConstructor
    @Getter
    public static class SignupRes{
        private MemberDto memberDto;
        public SignupRes(Member member){
            this.memberDto = new MemberDto(member);
        }
    }

    @NoArgsConstructor
    @Getter
    public static class LoginRes{
        private MemberDto memberDto;
        private String accessToken;
        private String refreshToken;

        public LoginRes(MemberDto memberDto, String accessToken, String refreshToken){
            this.memberDto = memberDto;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }

    @NoArgsConstructor
    @Getter
    public static class SearchMemberRes {

        private List<MemberDto> members;
        public SearchMemberRes(List<MemberDto> members){
            this.members = members;
        }
    }
}
