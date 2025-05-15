package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.infrastructure.db.po.SentenceVariantPO;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-15T16:06:22+0800",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class SentenceVariantPoMapperImpl implements SentenceVariantPoMapper {

    @Override
    public SentenceVariant toEntity(SentenceVariantPO po) {
        if ( po == null ) {
            return null;
        }

        SentenceVariant.SentenceVariantBuilder sentenceVariant = SentenceVariant.builder();

        sentenceVariant.content( po.getContent() );
        sentenceVariant.description( po.getDescription() );
        sentenceVariant.id( po.getId() );
        sentenceVariant.type( po.getType() );

        return sentenceVariant.build();
    }

    @Override
    public SentenceVariantPO toPo(SentenceVariant entity) {
        if ( entity == null ) {
            return null;
        }

        SentenceVariantPO.SentenceVariantPOBuilder sentenceVariantPO = SentenceVariantPO.builder();

        sentenceVariantPO.content( entity.getContent() );
        sentenceVariantPO.description( entity.getDescription() );
        sentenceVariantPO.id( entity.getId() );
        sentenceVariantPO.type( entity.getType() );

        return sentenceVariantPO.build();
    }

    @Override
    public List<SentenceVariant> toEntityList(List<SentenceVariantPO> poList) {
        if ( poList == null ) {
            return null;
        }

        List<SentenceVariant> list = new ArrayList<SentenceVariant>( poList.size() );
        for ( SentenceVariantPO sentenceVariantPO : poList ) {
            list.add( toEntity( sentenceVariantPO ) );
        }

        return list;
    }

    @Override
    public List<SentenceVariantPO> toPoList(List<SentenceVariant> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<SentenceVariantPO> list = new ArrayList<SentenceVariantPO>( entityList.size() );
        for ( SentenceVariant sentenceVariant : entityList ) {
            list.add( toPo( sentenceVariant ) );
        }

        return list;
    }
}
