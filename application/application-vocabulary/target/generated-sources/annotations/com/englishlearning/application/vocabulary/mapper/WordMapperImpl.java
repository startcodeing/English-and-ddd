package com.englishlearning.application.vocabulary.mapper;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-15T16:06:20+0800",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class WordMapperImpl implements WordMapper {

    @Override
    public WordDTO toDTO(Word word) {
        if ( word == null ) {
            return null;
        }

        WordDTO.WordDTOBuilder wordDTO = WordDTO.builder();

        wordDTO.id( word.getId() );
        wordDTO.partOfSpeech( partOfSpeechToPartOfSpeechDTO( word.getPartOfSpeech() ) );
        wordDTO.pronunciation( word.getPronunciation() );

        return wordDTO.build();
    }

    @Override
    public Word toEntity(WordDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Word.WordBuilder word = Word.builder();

        word.id( dto.getId() );
        word.partOfSpeech( partOfSpeechDTOToPartOfSpeech( dto.getPartOfSpeech() ) );
        word.pronunciation( dto.getPronunciation() );

        return word.build();
    }

    @Override
    public List<WordDTO> toDTOList(List<Word> words) {
        if ( words == null ) {
            return null;
        }

        List<WordDTO> list = new ArrayList<WordDTO>( words.size() );
        for ( Word word : words ) {
            list.add( toDTO( word ) );
        }

        return list;
    }

    @Override
    public List<Word> toEntityList(List<WordDTO> dtos) {
        if ( dtos == null ) {
            return null;
        }

        List<Word> list = new ArrayList<Word>( dtos.size() );
        for ( WordDTO wordDTO : dtos ) {
            list.add( toEntity( wordDTO ) );
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
}
