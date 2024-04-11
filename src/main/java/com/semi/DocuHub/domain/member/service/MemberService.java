package com.semi.DocuHub.domain.member.service;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.repository.MemberRepository;
import com.semi.DocuHub.domain.member.request.MemberRequest;
import com.semi.DocuHub.domain.member.response.MemberResponse;
import com.semi.DocuHub.global.jwt.JwtProvider;
import com.semi.DocuHub.global.rsData.RsData;
import com.semi.DocuHub.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public RsData save(MemberRequest.SignupReq signupReq) {

        RsData valid = validation(signupReq);

        // 중복체크
        if(valid.getIsFail()){
            return valid;
        }

        // 가입
        Member member = Member.builder()
                .username(signupReq.username)
                .password(passwordEncoder.encode(signupReq.getPassword()))
                .email(signupReq.getEmail())
                .build();

        String refreshToken = jwtProvider.genToken(member,60*60*24*365*20);

        member = member.toBuilder().refreshToken(refreshToken).build();

        memberRepository.save(member);

        return RsData.of("S-1","가입성공",member);
    }

    // 가입시 validation
    private RsData validation(MemberRequest.SignupReq signupReq){

        if(memberRepository.existsByUsername(signupReq.getUsername())){
            return RsData.of("F-1","이미 존재하는 아이디 입니다.","username");
        }

        if(!signupReq.getPassword().equals(signupReq.getPasswordConfirm())){
            return RsData.of("F-1","비밀번호와 비밀번호 확인이 일치하지 않습니다.","password");
        }

        if(memberRepository.existsByEmail(signupReq.getEmail())){
            return RsData.of("F-1","이미 존재하는 이메일 입니다.","email");
        }

        return RsData.of("S-1","가입가능");
    }

    public RsData authAndMakeTokens(MemberRequest.LoginReq loginReq) throws Exception {

        Member member = memberRepository.findByUsername(loginReq.username).orElseThrow(() -> new Exception("존재하지 않는 회원"));

        if(!passwordEncoder.matches(loginReq.getPassword(), member.getPassword())){
            throw new Exception("비밀번호가 일치하지 않습니다.");
        }

        String refreshToken = member.getRefreshToken();

        String accessToken = jwtProvider.genAccessToken(member);

        return RsData.of("S-1","로그인 성공",new MemberResponse.LoginRes(member,accessToken,refreshToken));
    }

    public SecurityUser getUserFromAccessToken(String accessToken) {
        Map<String, Object> payloadBody = jwtProvider.getClaims(accessToken);

        long id = (int) payloadBody.get("id");
        String username = (String) payloadBody.get("username");
        List<GrantedAuthority> authorities = new ArrayList<>();

        return new SecurityUser(
                id,
                username,
                "",
                authorities
        );
    }

    public boolean validateToken(String token) {
        return jwtProvider.verify(token);
    }

    public RsData<String> refreshAccessToken(String refreshToken) throws Exception {
        Member member = memberRepository.findByRefreshToken(refreshToken).orElseThrow(() -> new Exception("존재하지 않는 리프레시 토큰입니다."));

        String accessToken = jwtProvider.genAccessToken(member);

        return RsData.of("S-1", "토큰 갱신 성공", accessToken);
    }

}
