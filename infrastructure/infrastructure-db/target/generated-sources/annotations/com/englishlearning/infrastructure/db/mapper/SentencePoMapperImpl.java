package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.infrastructure.db.po.SentencePO;
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
public class SentencePoMapperImpl implements SentencePoMapper {

    @Autowired
    private SentenceVariantPoMapper sentenceVariantPoMapper;
    @Autowired
    private WordPoMapper wordPoMapper;

    @Override
    public Sentence toEntity(SentencePO po) {
        if ( po == null ) {
            return null;
        }

        Sentence.SentenceBuilder sentence = Sentence.builder();

        sentence.chineseMeaning( po.getChineseMeaning() );
        sentence.englishContent( po.getEnglishContent() );
        sentence.grammarAnalysis( po.getGrammarAnalysis() );
        sentence.id( po.getId() );
        sentence.unfamiliarWords( wordPoMapper.toEntityList( po.getUnfamiliarWords() ) );
        sentence.variants( sentenceVariantPoMapper.toEntityList( po.getVariants() ) );

        return sentence.build();
    }

    @Override
    public SentencePO toPo(Sentence entity) {
        if ( entity == null ) {
            return null;
        }

        SentencePO.SentencePOBuilder sentencePO = SentencePO.builder();

        sentencePO.chineseMeaning( entity.getChineseMeaning() );
        sentencePO.englishContent( entity.getEnglishContent() );
        sentencePO.grammarAnalysis( entity.getGrammarAnalysis() );
        sentencePO.id( entity.getId() );
        sentencePO.unfamiliarWords( wordPoMapper.toPoList( entity.getUnfamiliarWords() ) );
        sentencePO.variants( sentenceVariantPoMapper.toPoList( entity.getVariants() ) );

        return sentencePO.build();
    }

    @Override
    public List<Sentence> toEntityList(List<SentencePO> poList) {
        if ( poList == null ) {
            return null;
        }

        List<Sentence> list = new ArrayList<Sentence>( poList.size() );
        for ( SentencePO sentencePO : poList ) {
            list.add( toEntity( sentencePO ) );
        }

        return list;
    }

    @Override
    public List<SentencePO> toPoList(List<Sentence> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<SentencePO> list = new ArrayList<SentencePO>( entityList.size() );
        for ( Sentence sentence : entityList ) {
            list.add( toPo( sentence ) );
        }

        return list;
    }
}
