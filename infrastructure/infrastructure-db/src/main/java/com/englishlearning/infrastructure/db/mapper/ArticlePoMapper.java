package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.infrastructure.db.po.ArticlePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 文章PO映射接口
 */
@Mapper(componentModel = "spring", uses = {SentencePoMapper.class, WordPoMapper.class})
public interface ArticlePoMapper {
    
    ArticlePoMapper INSTANCE = Mappers.getMapper(ArticlePoMapper.class);
    
    /**
     * PO转Entity
     */
    Article toEntity(ArticlePO po);
    
    /**
     * Entity转PO
     */
    ArticlePO toPo(Article entity);
    
    /**
     * PO List转Entity List
     */
    List<Article> toEntityList(List<ArticlePO> poList);
    
    /**
     * Entity List转PO List
     */
    List<ArticlePO> toPoList(List<Article> entityList);
} 