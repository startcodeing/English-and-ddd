package com.englishlearning.application.content.mapper.impl;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.mapper.ArticleMapper;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.model.entity.Article;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ArticleMapper的手动实现类
 * 临时解决MapStruct编译问题
 */
@Component
public class ArticleMapperImpl implements ArticleMapper {

    @Autowired
    private SentenceMapper sentenceMapper;
    
    @Autowired
    private WordMapper wordMapper;

    @Override
    public ArticleDTO toDTO(Article entity) {
        if (entity == null) {
            return null;
        }

        return ArticleDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .source(entity.getSource())
                .author(entity.getAuthor())
                .publishDate(entity.getPublishDate())
                .difficultyLevel(entity.getDifficultyLevel())
                .unfamiliarWords(entity.getUnfamiliarWords())
                .sentences(entity.getSentences())
                .build();
    }

    @Override
    public Article toEntity(ArticleDTO dto) {
        if (dto == null) {
            return null;
        }

        Article article = new Article();
        article.setId(dto.getId());
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setSource(dto.getSource());
        article.setAuthor(dto.getAuthor());
        article.setPublishDate(dto.getPublishDate());
        article.setDifficultyLevel(dto.getDifficultyLevel());
        article.setUnfamiliarWords(dto.getUnfamiliarWords());
        article.setSentences(dto.getSentences());
        
        return article;
    }

    @Override
    public List<ArticleDTO> toDTOList(List<Article> entityList) {
        if (entityList == null) {
            return null;
        }

        return entityList.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Article> toEntityList(List<ArticleDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }

        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}