package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.infrastructure.db.po.ArticlePO;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-15T16:06:22+0800",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class ArticlePoMapperImpl implements ArticlePoMapper {

    @Autowired
    private SentencePoMapper sentencePoMapper;
    @Autowired
    private WordPoMapper wordPoMapper;

    @Override
    public Article toEntity(ArticlePO po) {
        if ( po == null ) {
            return null;
        }

        Article.ArticleBuilder article = Article.builder();

        article.author( po.getAuthor() );
        article.content( po.getContent() );
        article.difficultyLevel( po.getDifficultyLevel() );
        article.id( po.getId() );
        article.publishDate( po.getPublishDate() );
        article.sentences( sentencePoMapper.toEntityList( po.getSentences() ) );
        article.source( po.getSource() );
        article.title( po.getTitle() );
        article.unfamiliarWords( wordPoMapper.toEntityList( po.getUnfamiliarWords() ) );

        return article.build();
    }

    @Override
    public ArticlePO toPo(Article entity) {
        if ( entity == null ) {
            return null;
        }

        ArticlePO.ArticlePOBuilder articlePO = ArticlePO.builder();

        articlePO.author( entity.getAuthor() );
        articlePO.content( entity.getContent() );
        articlePO.difficultyLevel( entity.getDifficultyLevel() );
        articlePO.id( entity.getId() );
        articlePO.publishDate( entity.getPublishDate() );
        articlePO.sentences( sentencePoMapper.toPoList( entity.getSentences() ) );
        articlePO.source( entity.getSource() );
        articlePO.title( entity.getTitle() );
        articlePO.unfamiliarWords( wordPoMapper.toPoList( entity.getUnfamiliarWords() ) );

        return articlePO.build();
    }

    @Override
    public List<Article> toEntityList(List<ArticlePO> poList) {
        if ( poList == null ) {
            return null;
        }

        List<Article> list = new ArrayList<Article>( poList.size() );
        for ( ArticlePO articlePO : poList ) {
            list.add( toEntity( articlePO ) );
        }

        return list;
    }

    @Override
    public List<ArticlePO> toPoList(List<Article> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<ArticlePO> list = new ArrayList<ArticlePO>( entityList.size() );
        for ( Article article : entityList ) {
            list.add( toPo( article ) );
        }

        return list;
    }
}
