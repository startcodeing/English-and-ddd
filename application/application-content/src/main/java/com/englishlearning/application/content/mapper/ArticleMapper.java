package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.domain.content.model.entity.Article;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 文章实体与DTO映射接口
 */
@Mapper(componentModel = "spring", uses = {SentenceMapper.class})
public interface ArticleMapper {
    
    ArticleMapper INSTANCE = Mappers.getMapper(ArticleMapper.class);
    
    /**
     * 实体转DTO
     */
    ArticleDTO toDTO(Article entity);
    
    /**
     * DTO转实体
     */
    Article toEntity(ArticleDTO dto);
    
    /**
     * 实体列表转DTO列表
     */
    List<ArticleDTO> toDTOList(List<Article> entityList);
    
    /**
     * DTO列表转实体列表
     */
    List<Article> toEntityList(List<ArticleDTO> dtoList);
} 