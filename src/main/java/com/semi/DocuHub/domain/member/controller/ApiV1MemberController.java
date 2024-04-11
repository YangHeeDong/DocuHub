package com.semi.DocuHub.domain.member.controller;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.request.MemberRequest;
import com.semi.DocuHub.domain.member.response.MemberResponse;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import com.semi.DocuHub.global.security.SecurityUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class ApiV1MemberController {

    private final MemberService memberService;
    private final Rq rq;

    @PostMapping("/signup")
    public RsData signup(@Valid @RequestBody MemberRequest.SignupReq signupReq, BindingResult br){

        if(br.hasErrors()){
            return RsData.of("F-1","가입 정보를 알맞게 입력해 주세요.");
        }

        RsData result = memberService.save(signupReq);

        if(result.getIsFail()) return RsData.of(result.getResultCode(), result.getMsg(),result.getData());

        return RsData.of(result.getResultCode(), result.getMsg(), new MemberResponse.SignupRes( (Member) result.getData()));
    }

    @PostMapping("/login")
    public RsData login(@Valid @RequestBody MemberRequest.LoginReq loginReq, BindingResult br) throws Exception {

        if(br.hasErrors()){
            return RsData.of("F-1","로그인 정보를 알맞게 입력해 주세요.");
        }

        RsData<MemberResponse.LoginRes> result= memberService.authAndMakeTokens(loginReq);

        if(result.getIsFail()){
            return RsData.of(
                    result.getResultCode(),
                    result.getMsg());
        }

        // 토큰을 쿠키에 등록
        rq.setCrossDomainCookie("accessToken", result.getData().getAccessToken());
        rq.setCrossDomainCookie("refreshToken", result.getData().getRefreshToken());

        SecurityUser securityUser = memberService.getUserFromAccessToken(result.getData().getAccessToken());
        rq.setLogin(securityUser);

        return result;
    }

}
