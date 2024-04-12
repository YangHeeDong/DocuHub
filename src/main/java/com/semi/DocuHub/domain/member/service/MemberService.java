package com.semi.DocuHub.domain.member.service;

import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.repository.MemberRepository;
import com.semi.DocuHub.domain.member.request.MemberRequest;
import com.semi.DocuHub.domain.member.response.MemberResponse;
import com.semi.DocuHub.global.email.EmailService;
import com.semi.DocuHub.global.jwt.JwtProvider;
import com.semi.DocuHub.global.rsData.RsData;
import com.semi.DocuHub.global.security.SecurityUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;
    private final ImageService imageService;

    @Transactional
    public RsData save(MemberRequest.SignupReq signupReq, MultipartFile profileImg) throws IOException {

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

        imageService.saveMemberProfile(member,profileImg);

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

        Optional<Member> member = memberRepository.findByUsername(loginReq.username);

        if(member.isEmpty()){
            return RsData.of("F-1","존재하지 않는 회원 입니다.");
        }

        if(!passwordEncoder.matches(loginReq.getPassword(), member.get().getPassword())){
            return RsData.of("F-2","비밀번호가 일치하지 않습니다.");
        }

        String refreshToken = member.get().getRefreshToken();

        String accessToken = jwtProvider.genAccessToken(member.get());

        return RsData.of("S-1","로그인 성공",new MemberResponse.LoginRes(member.get(),accessToken,refreshToken));
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

    public RsData findIdByEmail(String email) {

        Optional<Member> member = memberRepository.findByEmail(email);

        return member.map(value -> RsData.of("S-1", "회원님의 아이디는 " + value.getUsername() + " 입니다.")).orElseGet(() -> RsData.of("F-1", "가입되지 않은 이메일 입니다."));

    }

    public RsData findPassword(MemberRequest.FindPasswordReq req) {

        Optional<Member> member = memberRepository.findByUsername(req.getUsername());

        if(member.isEmpty()){
            return RsData.of("F-1", "가입되지 아이디 입니다.");
        }
        if(!member.get().getEmail().equals(req.email)){
            return RsData.of("F-2", "이메일이 일치하지 않습니다.");
        }

        // 임시 비밀번호 전송
        String tempPassword = emailService.sendConfirm(member.get().getEmail());

        // 비밀번호 변경
        Member updateMember = member.get().toBuilder().password(passwordEncoder.encode(tempPassword)).build();
        memberRepository.save(updateMember);

        return RsData.of("S-1","회원님의 이메일로 임시비밀번호를 발급하였습니다.");

    }
}
