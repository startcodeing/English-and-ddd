package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.common.utils.UUIDGenerator;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.repository.ArticleRepository;
import com.englishlearning.infrastructure.db.mapper.ArticlePoMapper;
import com.englishlearning.infrastructure.db.po.ArticlePO;
import com.englishlearning.infrastructure.db.repository.jpa.ArticleJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * 文章仓储实现
 */
@Repository
@RequiredArgsConstructor
public class ArticleRepositoryImpl implements ArticleRepository {
    
    private final ArticleJpaRepository jpaRepository;
    private final ArticlePoMapper mapper;
    private final UUIDGenerator uuidGenerator;
    
    @Override
    public Article save(Article article) {
        if (!StringUtils.hasText(article.getId())) {
            article.setId(uuidGenerator.generateUUID());
        }
        ArticlePO articlePO = mapper.toPo(article);
        ArticlePO savedPO = jpaRepository.save(articlePO);
        return mapper.toEntity(savedPO);
    }
    
    @Override
    public Optional<Article> findById(String id) {
        return jpaRepository.findById(id)
            .map(mapper::toEntity);
    }
    
    @Override
    public List<Article> findByTitleLike(String title) {
        return mapper.toEntityList(
            jpaRepository.findByTitleContaining(title)
        );
    }
    
    @Override
    public List<Article> findByContentLike(String content) {
        return mapper.toEntityList(
            jpaRepository.findByContentContaining(content)
        );
    }
    
    @Override
    public List<Article> findBySource(String source) {
        return mapper.toEntityList(
            jpaRepository.findBySource(source)
        );
    }
    
    @Override
    public List<Article> findByAuthor(String author) {
        return mapper.toEntityList(
            jpaRepository.findByAuthor(author)
        );
    }
    
    @Override
    public List<Article> findByDifficultyLevel(Integer difficultyLevel) {
        return mapper.toEntityList(
            jpaRepository.findByDifficultyLevel(difficultyLevel)
        );
    }
    
    @Override
    public List<Article> findByUnfamiliarWordId(String wordId) {
        return mapper.toEntityList(
            jpaRepository.findByUnfamiliarWordId(wordId)
        );
    }
    
    @Override
    public List<Article> findBySentenceId(String sentenceId) {
        return mapper.toEntityList(
            jpaRepository.findBySentenceId(sentenceId)
        );
    }
    
    @Override
    public List<Article> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
} 