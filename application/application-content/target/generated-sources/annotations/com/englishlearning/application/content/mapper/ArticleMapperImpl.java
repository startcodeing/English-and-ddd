package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.domain.content.model.entity.Article;
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
public class ArticleMapperImpl implements ArticleMapper {

    @Autowired
    private SentenceMapper sentenceMapper;

    @Override
    public ArticleDTO toDTO(Article entity) {
        if ( entity == null ) {
            return null;
        }

        ArticleDTO.ArticleDTOBuilder articleDTO = ArticleDTO.builder();

        articleDTO.author( entity.getAuthor() );
        articleDTO.content( entity.getContent() );
        articleDTO.difficultyLevel( entity.getDifficultyLevel() );
        articleDTO.id( entity.getId() );
        articleDTO.publishDate( entity.getPublishDate() );
        articleDTO.sentences( sentenceMapper.toDTOList( entity.getSentences() ) );
        articleDTO.source( entity.getSource() );
        articleDTO.title( entity.getTitle() );
        articleDTO.unfamiliarWords( wordListToWordDTOList( entity.getUnfamiliarWords() ) );

        return articleDTO.build();
    }

    @Override
    public Article toEntity(ArticleDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Article.ArticleBuilder article = Article.builder();

        article.author( dto.getAuthor() );
        article.content( dto.getContent() );
        article.difficultyLevel( dto.getDifficultyLevel() );
        article.id( dto.getId() );
        article.publishDate( dto.getPublishDate() );
        article.sentences( sentenceMapper.toEntityList( dto.getSentences() ) );
        article.source( dto.getSource() );
        article.title( dto.getTitle() );
        article.unfamiliarWords( wordDTOListToWordList( dto.getUnfamiliarWords() ) );

        return article.build();
    }

    @Override
    public List<ArticleDTO> toDTOList(List<Article> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<ArticleDTO> list = new ArrayList<ArticleDTO>( entityList.size() );
        for ( Article article : entityList ) {
            list.add( toDTO( article ) );
        }

        return list;
    }

    @Override
    public List<Article> toEntityList(List<ArticleDTO> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Article> list = new ArrayList<Article>( dtoList.size() );
        for ( ArticleDTO articleDTO : dtoList ) {
            list.add( toEntity( articleDTO ) );
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
