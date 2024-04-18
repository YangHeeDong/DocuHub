//    package com.semi.DocuHub.global.initData;
//
//    import com.semi.DocuHub.domain.image.service.ImageService;
//    import com.semi.DocuHub.domain.member.entity.Member;
//    import com.semi.DocuHub.domain.member.request.MemberRequest;
//    import com.semi.DocuHub.domain.member.service.MemberService;
//    import com.semi.DocuHub.domain.team.entity.Team;
//    import com.semi.DocuHub.domain.team.repository.TeamRepository;
//    import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
//    import com.semi.DocuHub.domain.teamMember.repository.TeamMemberRepository;
//    import com.semi.DocuHub.global.rsData.RsData;
//    import org.springframework.boot.CommandLineRunner;
//    import org.springframework.context.annotation.Bean;
//    import org.springframework.context.annotation.Configuration;
//    import org.springframework.context.annotation.Profile;
//
//    @Configuration
//    @Profile({"dev", "test"})
//    public class NotProd {
//
//        @Bean
//        CommandLineRunner initData(MemberService memberService, TeamRepository teamRepository, ImageService imageService, TeamMemberRepository teamMemberRepository) {
//
//            return args -> {
//
//                // 회원 3명 추가
//                for(int i = 1 ; i <=200 ; i++){
//                    RsData<Member> user1 = memberService.save(MemberRequest.SignupReq.builder()
//                            .username("user"+i)
//                            .password("1234")
//                            .passwordConfirm("1234")
//                            .email("user"+i+"@gmail.com").build(),null);
//                }
//
//                for(int i = 0; i<100; i++){
//
//                    Member member = memberService.findById(1L);
//                    Team team = Team.builder()
//                            .teamAdmin(member)
//                            .teamName("팀"+ i)
//                            .teamDescription("팀"+i+"설명")
//                            .build();
//
//                    team =teamRepository.save(team);
//                    imageService.saveTeamImg(team, null);
//                    TeamMember teamMember = TeamMember.builder()
//                            .teamMember(member)
//                            .team(team)
//                            .authority("admin")
//                            .build();
//                    teamMemberRepository.save(teamMember);
//
//                }
//
//                for(Long i = 2L; i <=100 ; i++){
//
//                    Member member = memberService.findById(i);
//                    Team team= teamRepository.findById(100L).get();
//
//                    TeamMember teamMember = TeamMember.builder()
//                            .teamMember(member)
//                            .team(team)
//                            .authority("admin")
//                            .build();
//                    teamMemberRepository.save(teamMember);
//                }
//
//                // 작성자 회원 추가
//    //            articleService.save(user1,ApiV1ArticleController.ArticleSaveReq.builder().title("제목1").content("내용1").build());
//    //            articleService.save(user1,ApiV1ArticleController.ArticleSaveReq.builder().title("제목2").content("내용2").build());
//    //            articleService.save(user2,ApiV1ArticleController.ArticleSaveReq.builder().title("제목3").content("내용3").build());
//    //            articleService.save(user2,ApiV1ArticleController.ArticleSaveReq.builder().title("제목4").content("내용4").build());
//    //            articleService.save(admin,ApiV1ArticleController.ArticleSaveReq.builder().title("제목5").content("내용5").build());
//
//
//            };
//        }
//    }
