package com.semi.DocuHub.domain.team.service;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.article.service.ArticleService;
import com.semi.DocuHub.domain.image.entity.Image;
import com.semi.DocuHub.domain.image.service.ImageService;
import com.semi.DocuHub.domain.member.dto.MemberDto;
import com.semi.DocuHub.domain.member.entity.Member;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.repository.TeamRepository;
import com.semi.DocuHub.domain.team.request.TeamRequest;
import com.semi.DocuHub.domain.teamMember.entity.TeamMember;
import com.semi.DocuHub.domain.teamMember.service.TeamMemberService;
import com.semi.DocuHub.global.rq.Rq;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final ImageService imageService;
    private final TeamMemberService teamMemberService;
    private final Rq rq;

    @SneakyThrows
    @Transactional
    public RsData<Team> save(TeamRequest.TeamCreateReq req, MultipartFile teamImg) {

        RsData valid = validTeam(req);

        if(valid.getIsFail()) return valid;

        Team team = Team.builder()
                .teamAdmin(rq.getMember())
                .teamName(req.getTeamName())
                .teamDescription(req.getTeamDescription())
                .build();

        teamRepository.save(team);

        imageService.saveTeamImg(team, teamImg);

        teamMemberService.create(team,"admin");

        return RsData.of("S-1","팀을 생성하였습니다.",team);
    }

    @Transactional
    private RsData validTeam(TeamRequest.TeamCreateReq req) {

        if(teamRepository.existsByTeamName(req.getTeamName())) return RsData.of("F-1","이미 존재하는 팀 입니다.");

        return RsData.of("S-1","생성가능");
    }

    @Transactional
    public RsData<Page<TeamDto>> getTeams(int page) {

        Member teamMember = rq.getMember();

        Page<TeamDto> teams = teamMemberService.getTeamsByMember(teamMember,page);

        return RsData.of("","",teams);

    }

    @Transactional
    public RsData<TeamDto> getTeamById(Long id) {

        Team team = teamRepository.findById(id).orElseGet(null);

        if(team == null){
            return RsData.of("F-1","존재하지 않는 팀입니다.");
        }

        TeamMember tm = team.getTeamMemberList().stream().filter(teamMember -> teamMember.getTeamMember() == rq.getMember()).findFirst().orElse(null);

        if(tm == null){
            return RsData.of("F-2","잘못된 접근 입니다.");
        }

        Image teamImg = imageService.getImage("team",team.getId());

        List<MemberDto> teamMembers = team.getTeamMemberList().stream().map( teamMember -> {
            return new MemberDto(teamMember.getTeamMember(), imageService.getImage("member",teamMember.getTeamMember().getId()));
        } ).toList();

        return RsData.of("S-1",
                "팀 조회 성공",
                new TeamDto(
                        team,
                        teamImg,
                        imageService.getImage("member",team.getTeamAdmin().getId()),
                        teamMembers
                )

        );

    }

    public RsData<Team> edit(TeamRequest.TeamEditReq req, MultipartFile teamImg) {

        Team team = teamRepository.findByTeamName(req.getTeamName());

        // 새로 업데이트할 이름이 존재한다면
        if(team != null){
            // 만약 그 이름을 가진 팀이 원래 내 팀이 아니라면
            if(team.getId() != req.getId()){
                return RsData.of("F-2","이미 존재하는 팀 이름 입니다.");
            }
        }else{
            team = teamRepository.findById(req.getId()).get();
        }

        team = team.toBuilder()
                .teamName(req.getTeamName())
                .teamDescription(req.getTeamDescription())
                .build() ;

        if(team.getTeamAdmin().getId() != rq.getMember().getId()){
            return RsData.of("F-1","권한이 없습니다.");
        }

        teamRepository.save(team);

        if(teamImg !=  null){
            imageService.updateTeamImg(team, teamImg);
        }

        return RsData.of("S-1","수정 성공", team);
    }

    public RsData delete(Long id) {

        Team team = teamRepository.findById(id).orElseGet(null);

        if(team == null){
            return RsData.of("F-1","존재하지 않는 팀입니다.");
        }

        TeamMember tm = team.getTeamMemberList().stream().filter(teamMember -> teamMember.getTeamMember() == rq.getMember()).findFirst().orElse(null);

        if(tm == null){
            return RsData.of("F-2","잘못된 접근 입니다.");
        }

        if(team.getTeamMemberList().size() > 1){
            return RsData.of("F-3","팀원 추방 후 삭제해주세요");
        }

        imageService.deleteImg("team",team.getId());

        teamRepository.delete(team);

        return RsData.of("S-1","팀을 삭제했습니다.");

    }
}
