package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-15T16:06:21+0800",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class SentenceMapperImpl implements SentenceMapper {

    @Autowired
    private SentenceVariantMapper sentenceVariantMapper;

    @Override
    public SentenceDTO toDTO(Sentence entity) {
        if ( entity == null ) {
            return null;
        }

        SentenceDTO.SentenceDTOBuilder sentenceDTO = SentenceDTO.builder();

        sentenceDTO.chineseMeaning( entity.getChineseMeaning() );
        sentenceDTO.englishContent( entity.getEnglishContent() );
        sentenceDTO.grammarAnalysis( entity.getGrammarAnalysis() );
        sentenceDTO.id( entity.getId() );
        sentenceDTO.unfamiliarWords( wordListToWordDTOList( entity.getUnfamiliarWords() ) );
        sentenceDTO.variants( sentenceVariantMapper.toDTOList( entity.getVariants() ) );

        return sentenceDTO.build();
    }

    @Override
    public Sentence toEntity(SentenceDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Sentence.SentenceBuilder sentence = Sentence.builder();

        sentence.chineseMeaning( dto.getChineseMeaning() );
        sentence.englishContent( dto.getEnglishContent() );
        sentence.grammarAnalysis( dto.getGrammarAnalysis() );
        sentence.id( dto.getId() );
        sentence.unfamiliarWords( wordDTOListToWordList( dto.getUnfamiliarWords() ) );
        sentence.variants( sentenceVariantMapper.toEntityList( dto.getVariants() ) );

        return sentence.build();
    }

    @Override
    public List<SentenceDTO> toDTOList(List<Sentence> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<SentenceDTO> list = new ArrayList<SentenceDTO>( entityList.size() );
        for ( Sentence sentence : entityList ) {
            list.add( toDTO( sentence ) );
        }

        return list;
    }

    @Override
    public List<Sentence> toEntityList(List<SentenceDTO> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Sentence> list = new ArrayList<Sentence>( dtoList.size() );
        for ( SentenceDTO sentenceDTO : dtoList ) {
            list.add( toEntity( sentenceDTO ) );
        }

        return list;
    }

    protected PartOfSpeechDTO partOfSpeechToPartOfSpeechDTO(PartOfSpeech partOfSpeech) {
        if ( partOfSpeech == null ) {
            return null;
        }

        PartOfSpeechDTO.PartOfSpeechDTOBuilder partOfSpeechDTO = PartOfSpeechDTO.builder();

        partOfSpeechDTO.chineseMeaning( partOfSpeech.getChineseMeaning() );
        List<String> list = partOfSpeech.getCommonPhrases();
        if ( list != null ) {
            partOfSpeechDTO.commonPhrases( new ArrayList<String>( list ) );
        }
        partOfSpeechDTO.englishName( partOfSpeech.getEnglishName() );
        partOfSpeechDTO.id( partOfSpeech.getId() );
        partOfSpeechDTO.usageSummary( partOfSpeech.getUsageSummary() );

        return partOfSpeechDTO.build();
    }

    protected WordDTO wordToWordDTO(Word word) {
        if ( word == null ) {
            return null;
        }

        WordDTO.WordDTOBuilder wordDTO = WordDTO.builder();

        wordDTO.id( word.getId() );
        wordDTO.partOfSpeech( partOfSpeechToPartOfSpeechDTO( word.getPartOfSpeech() ) );
        wordDTO.pronunciation( word.getPronunciation() );

        return wordDTO.build();
    }

    protected List<WordDTO> wordListToWordDTOList(List<Word> list) {
        if ( list == null ) {
            return null;
        }

        List<WordDTO> list1 = new ArrayList<WordDTO>( list.size() );
        for ( Word word : list ) {
            list1.add( wordToWordDTO( word ) );
        }

        return list1;
    }

    protected PartOfSpeech partOfSpeechDTOToPartOfSpeech(PartOfSpeechDTO partOfSpeechDTO) {
        if ( partOfSpeechDTO == null ) {
            return null;
        }

        PartOfSpeech.PartOfSpeechBuilder partOfSpeech = PartOfSpeech.builder();

        partOfSpeech.chineseMeaning( partOfSpeechDTO.getChineseMeaning() );
        List<String> list = partOfSpeechDTO.getCommonPhrases();
        if ( list != null ) {
            partOfSpeech.commonPhrases( new ArrayList<String>( list ) );
        }
        partOfSpeech.englishName( partOfSpeechDTO.getEnglishName() );
        partOfSpeech.id( partOfSpeechDTO.getId() );
        partOfSpeech.usageSummary( partOfSpeechDTO.getUsageSummary() );

        return partOfSpeech.build();
    }

    protected Word wordDTOToWord(WordDTO wordDTO) {
        if ( wordDTO == null ) {
            return null;
        }

        Word.WordBuilder word = Word.builder();

        word.id( wordDTO.getId() );
        word.partOfSpeech( partOfSpeechDTOToPartOfSpeech( wordDTO.getPartOfSpeech() ) );
        word.pronunciation( wordDTO.getPronunciation() );

        return word.build();
    }

    protected List<Word> wordDTOListToWordList(List<WordDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<Word> list1 = new ArrayList<Word>( list.size() );
        for ( WordDTO wordDTO : list ) {
            list1.add( wordDTOToWord( wordDTO ) );
        }

        return list1;
    }
}
