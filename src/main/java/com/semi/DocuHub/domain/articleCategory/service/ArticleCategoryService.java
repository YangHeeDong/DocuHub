package com.semi.DocuHub.domain.articleCategory.service;

import com.semi.DocuHub.domain.article.entity.Article;
import com.semi.DocuHub.domain.articleCategory.entity.ArticleCategory;
import com.semi.DocuHub.domain.articleCategory.repository.ArticleCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleCategoryService {

    private final ArticleCategoryRepository articleCategoryRepository;

    public ArticleCategory save (ArticleCategory ac) {

        return articleCategoryRepository.save(ac);
    }

    public ArticleCategory findByRelationIdAndIsTeam(Long id, boolean isTeam) {
        return articleCategoryRepository.findByRelationIdAndIsTeam(id,isTeam).orElse(null);
    }

    public void deleteArticleByTeamId(Long id) {

        ArticleCategory ac = this.findByRelationIdAndIsTeam(id, true);

        if(ac != null){
            articleCategoryRepository.delete(ac);
        }

    }
}
