package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.infrastructure.db.po.PartOfSpeechPO;
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
public class PartOfSpeechPoMapperImpl implements PartOfSpeechPoMapper {

    @Override
    public PartOfSpeech toEntity(PartOfSpeechPO po) {
        if ( po == null ) {
            return null;
        }

        PartOfSpeech.PartOfSpeechBuilder partOfSpeech = PartOfSpeech.builder();

        partOfSpeech.chineseMeaning( po.getChineseMeaning() );
        List<String> list = po.getCommonPhrases();
        if ( list != null ) {
            partOfSpeech.commonPhrases( new ArrayList<String>( list ) );
        }
        partOfSpeech.englishName( po.getEnglishName() );
        if ( po.getId() != null ) {
            partOfSpeech.id( String.valueOf( po.getId() ) );
        }
        partOfSpeech.usageSummary( po.getUsageSummary() );

        return partOfSpeech.build();
    }

    @Override
    public PartOfSpeechPO toPo(PartOfSpeech entity) {
        if ( entity == null ) {
            return null;
        }

        PartOfSpeechPO partOfSpeechPO = new PartOfSpeechPO();

        partOfSpeechPO.setChineseMeaning( entity.getChineseMeaning() );
        List<String> list = entity.getCommonPhrases();
        if ( list != null ) {
            partOfSpeechPO.setCommonPhrases( new ArrayList<String>( list ) );
        }
        partOfSpeechPO.setEnglishName( entity.getEnglishName() );
        if ( entity.getId() != null ) {
            partOfSpeechPO.setId( Long.parseLong( entity.getId() ) );
        }
        partOfSpeechPO.setUsageSummary( entity.getUsageSummary() );

        return partOfSpeechPO;
    }

    @Override
    public List<PartOfSpeech> toEntityList(List<PartOfSpeechPO> poList) {
        if ( poList == null ) {
            return null;
        }

        List<PartOfSpeech> list = new ArrayList<PartOfSpeech>( poList.size() );
        for ( PartOfSpeechPO partOfSpeechPO : poList ) {
            list.add( toEntity( partOfSpeechPO ) );
        }

        return list;
    }

    @Override
    public List<PartOfSpeechPO> toPoList(List<PartOfSpeech> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<PartOfSpeechPO> list = new ArrayList<PartOfSpeechPO>( entityList.size() );
        for ( PartOfSpeech partOfSpeech : entityList ) {
            list.add( toPo( partOfSpeech ) );
        }

        return list;
    }
}
