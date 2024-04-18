package com.semi.DocuHub.domain.article.service;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.article.repository.ArticleRepository;
import com.semi.DocuHub.domain.article.request.ArticleRequest;
import com.semi.DocuHub.domain.articleCategory.entity.ArticleCategory;
import com.semi.DocuHub.domain.articleCategory.service.ArticleCategoryService;
import com.semi.DocuHub.domain.team.dto.TeamDto;
import com.semi.DocuHub.domain.team.entity.Team;
import com.semi.DocuHub.domain.team.service.TeamService;
import com.semi.DocuHub.global.rsData.RsData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    private final ArticleCategoryService articleCategoryService;
    private final TeamService teamService;

    @Transactional
    public RsData create(ArticleRequest.CreateReq createReq) {

        RsData<TeamDto> result = teamService.getTeamById(createReq.getTeamId());

        if(result.getIsFail()){
            return RsData.of(result.getResultCode(), result.getMsg());
        }

        ArticleCategory ac = articleCategoryService.findByRelationIdAndIsTeam(result.getData().getId(), true);
        if( ac == null ){
            ac = ArticleCategory.builder()
                    .relationId(result.getData().getId())
                    .isTeam(true)
                    .build();
            ac = articleCategoryService.save(ac);
        }

        if(articleRepository.existsByTitleAndArticleCategory(createReq.getTitle(),ac)){
            return RsData.of("F-2", "이미 존재하는 제목입니다.");
        };


        Article article = Article.builder()
                .title(createReq.getTitle())
                .content("")
                .View(0L)
                .articleCategory(ac)
                .build();

        article = articleRepository.save(article);

        return RsData.of("S-1","게시글을 생성하였습니다.",article);
    }

    public RsData<Article> findById(Long id) {

        Article article = articleRepository.findById(id).orElse(null);

        if(article == null){
            return RsData.of("F-1", "존재하지 않는 게시글 입니다.");
        }

        RsData<TeamDto> team = teamService.getTeamById(article.getArticleCategory().getRelationId());

        if( team.getIsFail()) {
            return RsData.of("F-2", "권한이 없습니다.");
        }

        return RsData.of("S-1","조회 성공",article);

    }

    public List<Article> findByTeamId(Long teamId) {

        ArticleCategory ac = articleCategoryService.findByRelationIdAndIsTeam(teamId,true);

        if(ac == null ) return null;

        return articleRepository.findAllByArticleCategory(ac);
    }

    public void update(Article article) {
        articleRepository.save(article);
    }

    public Article findByIdForWebSocket(Long memberId, Long id) {

        Article article = articleRepository.findById(id).orElse(null);

        if(article == null){
            return null;
        }

        return article;

    }

    public RsData delete(Long id) {
        
        Article article = articleRepository.findById(id).orElse(null);

        if(article == null){
            return RsData.of("F-1", "존재하지 않는 게시글 입니다.");
        }

        RsData<TeamDto> team = teamService.getTeamById(article.getArticleCategory().getRelationId());

        if( team.getIsFail()) {
            return RsData.of("F-2", "권한이 없습니다.");
        }
        
        articleRepository.delete(article);

        return RsData.of("S-1", "삭제하였습니다.");
    }
}
