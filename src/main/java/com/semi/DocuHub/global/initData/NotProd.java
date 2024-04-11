package com.semi.DocuHub.global.initData;

import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.member.request.MemberRequest;
import com.semi.DocuHub.domain.member.service.MemberService;
import com.semi.DocuHub.global.rsData.RsData;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"dev", "test"})
public class NotProd {

    @Bean
    CommandLineRunner initData(MemberService memberService) {

        return args -> {

            // 회원 3명 추가
            RsData<Member> user1 = memberService.save(MemberRequest.SignupReq.builder()
                    .username("user1")
                    .password("1234")
                    .passwordConfirm("1234")
                    .email("user1@gmail.com").build(),null);
            RsData<Member> user2 = memberService.save(MemberRequest.SignupReq.builder()
                    .username("user2")
                    .password("1234")
                    .passwordConfirm("1234")
                    .email("user2@gmail.com").build(),null);
            RsData<Member> admin = memberService.save(MemberRequest.SignupReq.builder()
                    .username("admin")
                    .password("1234")
                    .passwordConfirm("1234")
                    .email("admin@gmail.com").build(),null);


            // 작성자 회원 추가
//            articleService.save(user1,ApiV1ArticleController.ArticleSaveReq.builder().title("제목1").content("내용1").build());
//            articleService.save(user1,ApiV1ArticleController.ArticleSaveReq.builder().title("제목2").content("내용2").build());
//            articleService.save(user2,ApiV1ArticleController.ArticleSaveReq.builder().title("제목3").content("내용3").build());
//            articleService.save(user2,ApiV1ArticleController.ArticleSaveReq.builder().title("제목4").content("내용4").build());
//            articleService.save(admin,ApiV1ArticleController.ArticleSaveReq.builder().title("제목5").content("내용5").build());


        };
    }
}
