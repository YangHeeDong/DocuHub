package com.semi.DocuHub.domain.member.controller;

import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.request.MemberRequest;
import com.semi.DocuHub.domain.member.response.MemberResponse;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import com.semi.DocuHub.global.security.SecurityUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class ApiV1MemberController {

    private final MemberService memberService;

    private final Rq rq;

    @PostMapping("/signup")
    public RsData signup(MemberRequest.SignupReq signupReq, BindingResult br, @RequestParam(name = "profileImg", required = false) MultipartFile profileImg) throws IOException {

        if(br.hasErrors()){
            return RsData.of("F-1","가입 정보를 알맞게 입력해 주세요.");
        }

        RsData result = memberService.save(signupReq, profileImg);

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

    @PostMapping("/logout")
    public RsData<String> logout () {

        // 토큰을 쿠키에 등록
        rq.removeCrossDomainCookie("accessToken");
        rq.removeCrossDomainCookie("refreshToken");

        SecurityContextHolder.clearContext();

        return RsData.of(
                "S-1",
                "로그아웃 되었습니다."
        );
    }

    @PostMapping("/findId")
    public RsData findId(@Valid @RequestBody MemberRequest.FindIdReq req, BindingResult br){

        if(br.hasErrors()){
            return RsData.of("F-1","이메일을 입력해 주세요");
        }

        return memberService.findIdByEmail(req.getEmail());
    }

    @PostMapping("/findPassword")
    public RsData findPassword(@Valid @RequestBody MemberRequest.FindPasswordReq req, BindingResult br){

        if(br.hasErrors()){
            return RsData.of("F-1","회원정보를 알맞게 입력해 주세요");
        }

        return memberService.findPassword(req);
    }


}
