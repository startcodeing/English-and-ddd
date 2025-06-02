package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.infrastructure.db.po.ArticlePO;
import com.englishlearning.infrastructure.db.po.SentencePO;
import com.englishlearning.infrastructure.db.po.WordPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 文章PO映射接口
 */
@Mapper(componentModel = "spring", uses = {SentencePoMapper.class, WordPoMapper.class})
public interface ArticlePoMapper {
    

    /**
     * PO转Entity
     */
    @Mapping(target = "sentences", source = "sentences")
    @Mapping(target = "unfamiliarWords", source = "unfamiliarWords")
    Article toEntity(ArticlePO po);
    
    /**
     * Entity转PO
     */
    @Mapping(target = "sentences", source = "sentences")
    @Mapping(target = "unfamiliarWords", source = "unfamiliarWords")
    ArticlePO toPo(Article entity);
    
    /**
     * PO List转Entity List
     */
    List<Article> toEntityList(List<ArticlePO> poList);
    
    /**
     * Entity List转PO List
     */
    List<ArticlePO> toPoList(List<Article> entityList);

    // 映射 List<SentencePO> -> List<String>

    default List<String> mapSentencePOListToIdList(List<SentencePO> sentencePOList) {
        if (sentencePOList == null) {
            return Collections.emptyList();
        }
        return sentencePOList.stream()
                .map(SentencePO::getId)
                .collect(Collectors.toList());
    }


    // 映射 List<String> -> List<SentencePO>
    default List<SentencePO> mapIdListToSentencePOList(List<String> ids) {
        if (ids == null) {
            return Collections.emptyList();
        }
        return ids.stream()
                .map(id -> {
                    SentencePO po = new SentencePO();
                    po.setId(id);
                    return po;
                }).collect(Collectors.toList());
    }

}