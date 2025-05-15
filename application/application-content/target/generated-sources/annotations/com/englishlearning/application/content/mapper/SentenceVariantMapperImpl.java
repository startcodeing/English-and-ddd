package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-15T16:06:21+0800",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class SentenceVariantMapperImpl implements SentenceVariantMapper {

    @Override
    public SentenceVariantDTO toDTO(SentenceVariant entity) {
        if ( entity == null ) {
            return null;
        }

        SentenceVariantDTO.SentenceVariantDTOBuilder sentenceVariantDTO = SentenceVariantDTO.builder();

        sentenceVariantDTO.content( entity.getContent() );
        sentenceVariantDTO.description( entity.getDescription() );
        sentenceVariantDTO.id( entity.getId() );
        sentenceVariantDTO.type( entity.getType() );

        return sentenceVariantDTO.build();
    }

    @Override
    public SentenceVariant toEntity(SentenceVariantDTO dto) {
        if ( dto == null ) {
            return null;
        }

        SentenceVariant.SentenceVariantBuilder sentenceVariant = SentenceVariant.builder();

        sentenceVariant.content( dto.getContent() );
        sentenceVariant.description( dto.getDescription() );
        sentenceVariant.id( dto.getId() );
        sentenceVariant.type( dto.getType() );

        return sentenceVariant.build();
    }

    @Override
    public List<SentenceVariantDTO> toDTOList(List<SentenceVariant> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<SentenceVariantDTO> list = new ArrayList<SentenceVariantDTO>( entityList.size() );
        for ( SentenceVariant sentenceVariant : entityList ) {
            list.add( toDTO( sentenceVariant ) );
        }

        return list;
    }

    @Override
    public List<SentenceVariant> toEntityList(List<SentenceVariantDTO> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<SentenceVariant> list = new ArrayList<SentenceVariant>( dtoList.size() );
        for ( SentenceVariantDTO sentenceVariantDTO : dtoList ) {
            list.add( toEntity( sentenceVariantDTO ) );
        }

        return list;
    }
}
