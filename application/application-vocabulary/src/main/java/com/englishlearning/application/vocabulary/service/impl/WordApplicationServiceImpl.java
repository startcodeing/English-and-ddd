package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.*;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.mapper.WordMeaningMapper;
import com.englishlearning.application.vocabulary.service.SentenceProvider;
import com.englishlearning.application.vocabulary.service.WordApplicationService;
import com.englishlearning.domain.vocabulary.event.WordCreatedEvent;
import com.englishlearning.domain.vocabulary.event.WordDeletedEvent;
import com.englishlearning.domain.vocabulary.event.WordEventPublisher;
import com.englishlearning.domain.vocabulary.event.WordMeaningAddedEvent;
import com.englishlearning.domain.vocabulary.event.WordUpdatedEvent;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.util.*;

/**
 * 单词应用服务实现类
 * 整合了命令处理器的功能，直接与仓储交互
 */
@Service
public class WordApplicationServiceImpl implements WordApplicationService {


    private final WordRepository wordRepository;
    private final SentenceProvider sentenceProvider;
    private final WordMapper wordMapper;
    private final WordMeaningMapper wordMeaningMapper;
    private final WordEventPublisher wordEventPublisher;

    @Autowired
    public WordApplicationServiceImpl(WordRepository wordRepository,
                                      WordMapper wordMapper,
                                      SentenceProvider sentenceProvider,
                                      WordMeaningMapper wordMeaningMapper,
                                      WordEventPublisher wordEventPublisher) {
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
        this.sentenceProvider = sentenceProvider;
        this.wordMeaningMapper = wordMeaningMapper;
        this.wordEventPublisher = wordEventPublisher;
    }

    /**
     * 添加单词词义
     *
     * @param command 添加单词词义命令
     * @return 更新后的单词实体
     */
    @Transactional
    @Override
    public WordDTO addWordMeaning(WordMeaningDTO command) {
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        String wordMeaningId = StringUtils.hasText(command.getId()) ? command.getId() : null;
        List<String> sentenceIdList = sentenceProvider.addSentence(command.getSentences());
        WordMeaning meaning = WordMeaning.builder()
                .id(wordMeaningId)
                .partOfSpeechId(command.getPartOfSpeechId())
                .chineseMeaning(command.getChineseMeaning())
                .exampleSentenceIds(sentenceIdList)
                .synonymWordMeaningIds(CollectionUtils.isEmpty(command.getSynonymWordMeaningIds()) ?
                        new ArrayList<>() : command.getSynonymWordMeaningIds())
                .antonymWordMeaningIds(CollectionUtils.isEmpty(command.getAntonymWordMeaningIds()) ?
                        new ArrayList<>() : command.getAntonymWordMeaningIds())
                .build();
        if (Objects.isNull(wordMeaningId)) {
            word.addMeaning(meaning);
            
            // 只有新增词义时才发布事件
            Word wordPo = wordRepository.save(word);
            
            // 发布词义添加事件
            WordMeaningAddedEvent event = new WordMeaningAddedEvent();
            event.setUserId("system"); // 临时设置，等用户功能添加后修改
            event.setUsername("system"); // 临时设置，等用户功能添加后修改
            event.setWord(wordPo);
            event.setWordMeaning(meaning);
            wordEventPublisher.publishWordMeaningAddedEvent(event);
            
            return wordMapper.toDTO(wordPo);
        } else {
            word.updateMeaning(meaning);
            Word wordPo = wordRepository.save(word);
            return wordMapper.toDTO(wordPo);
        }
    }


    @Override
    public WordDTO removeWordMeaning(String wordId, String meaningId) {
        Word word = wordRepository.findById(wordId).orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        word.findMeaningByMeaningId(meaningId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + meaningId));
        word.removeMeaning(meaningId);
        Word wordPo = wordRepository.save(word);
        return wordMapper.toDTO(wordPo);
    }

    /**
     * 为单词的词性添加例句
     *
     * @param addSentenceDto 添加例句命令
     * @return 更新后的单词实体
     */
    @Transactional
    @Override
    public WordDTO addExampleSentence(ExampleSentenceDTO addSentenceDto) {
        Word word = wordRepository.findById(addSentenceDto.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + addSentenceDto.getWordId()));

        WordMeaning wordMeaning = word.findMeaningByMeaningId(addSentenceDto.getWordMeaningId())
                .orElseThrow(() -> new IllegalArgumentException("WordMeaning不存在: " + addSentenceDto.getWordMeaningId()));

        List<String> sentenceIdList = sentenceProvider.addSentence(addSentenceDto.getSentences());

        sentenceIdList.forEach(sentenceId -> word.addExampleSentence(wordMeaning.getId(), sentenceId));

        Word savedWord = wordRepository.save(word);
        return wordMapper.toDTO(savedWord);
    }

    /**
     * 移除例句
     *
     * @param deleteWordMeaningSentenceDTO 移除例句命令
     * @return 更新后的单词实体
     */
    @Transactional
    public WordMeaningDTO removeExampleSentence(DeleteExampleSentenceDTO deleteWordMeaningSentenceDTO) {
        Word word = wordRepository.findById(deleteWordMeaningSentenceDTO.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + deleteWordMeaningSentenceDTO.getWordId()));

        WordMeaning wordMeaning = word.findMeaningByMeaningId(deleteWordMeaningSentenceDTO.getWordMeaningId())
                .orElseThrow(() -> new IllegalArgumentException("WordMeaning不存在: " + deleteWordMeaningSentenceDTO.getWordMeaningId()));

        deleteWordMeaningSentenceDTO.getSentenceIdList().forEach(sentenceId -> word.removeExampleSentence(wordMeaning.getId(), sentenceId));
        Word saveWord = wordRepository.save(word);
        Optional<WordMeaning> savedWordMeaning = saveWord.findMeaningByMeaningId(wordMeaning.getId());
        return savedWordMeaning.map(wordMeaningMapper::toDTO).orElse(null);

    }

    /**
     * 添加同义词
     *
     * @param wordId               单词ID
     * @param wordMeaningId        词性ID
     * @param synonymWordId        同义词ID
     * @param synonymWordMeaningId 同义词词性ID
     * @return 更新后的单词实体
     */
    @Transactional
    public WordMeaningDTO addSynonym(String wordId, String wordMeaningId, String synonymWordId, String synonymWordMeaningId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));

        Word synonymWord = wordRepository.findById(synonymWordId).orElseThrow(() -> new IllegalArgumentException("同义词不存在: " + synonymWordId));
        synonymWord.findMeaningByMeaningId(synonymWordMeaningId).orElseThrow(() -> new IllegalArgumentException("同义词不存在: " + synonymWordMeaningId));

        Optional<WordMeaning> meaningOpt = word.findMeaningByMeaningId(wordMeaningId);
        if (meaningOpt.isEmpty()) {
            throw new IllegalArgumentException("找不到词性为" + wordMeaningId + "的词义");
        }
        word.addSynonym(meaningOpt.get().getId(),synonymWordId,synonymWordMeaningId);
        Word savedWord = wordRepository.save(word);
        return savedWord.findMeaningByMeaningId(wordMeaningId).map(wordMeaningMapper::toDTO).orElse(null);
    }

    /**
     * 添加反义词
     *
     * @param wordId           单词ID
     * @param wordMeaningId    词性ID
     * @param antonymWordId    反义词ID
     * @param antonymMeaningId 反义词词性ID
     * @return 更新后的单词实体
     */
    @Transactional
    public WordMeaningDTO addAntonym(String wordId, String wordMeaningId, String antonymWordId, String antonymMeaningId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));

        Word antonymWord = wordRepository.findById(antonymWordId)
                .orElseThrow(() -> new IllegalArgumentException("反义词不存在: " + antonymWordId));
        antonymWord.findMeaningByMeaningId(antonymMeaningId).orElseThrow(() -> new IllegalArgumentException("反义词WordMeaning不存在: " + antonymMeaningId));

        Optional<WordMeaning> meaningOpt = word.findMeaningByMeaningId(wordMeaningId);
        if (meaningOpt.isEmpty()) {
            throw new IllegalArgumentException("找不到词性为" + wordMeaningId + "的词义");
        }
        word.addAntonym(meaningOpt.get().getId(), antonymWordId,antonymMeaningId);
        Word savedWord = wordRepository.save(word);
        return savedWord.findMeaningByMeaningId(wordMeaningId).map(wordMeaningMapper::toDTO).orElse(null);
    }

    @Override
    public void removeSynonym(String wordId, String meaningId, String synonymId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        word.findMeaningByMeaningId(meaningId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + meaningId));
        word.removeSynonym(meaningId, synonymId);
        wordRepository.save(word);
    }

    @Override
    public void removeAntonym(String wordId, String meaningId, String synonymId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        word.findMeaningByMeaningId(meaningId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + meaningId));
        word.removeAntonym(meaningId, synonymId);
        wordRepository.save(word);
    }

    @Transactional
    @Override
    public WordDTO createWord(WordDTO dto) {
        Optional<Word> existWord = wordRepository.findBySpelling(dto.getSpelling());
        if (existWord.isPresent()) {
            throw new IllegalArgumentException("单词已存在: " + dto.getSpelling());
        }
        Word wordInfo = Word.builder()
                .spelling(dto.getSpelling())
                .phonetic(dto.getPhonetic())
                .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : 1)
                .meanings(new ArrayList<>())
                .build();
        Word word = Word.builder()
                .id(UUID.randomUUID().toString())
                .meanings(new ArrayList<>())
                .build();
        word.createWord(wordInfo);
        Word savedWord = wordRepository.save(word);
        
        // 发布单词创建事件
        WordCreatedEvent event = new WordCreatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWord(savedWord);
        wordEventPublisher.publishWordCreatedEvent(event);
        
        return wordMapper.toDTO(savedWord);
    }

    @Transactional
    @Override
    public WordDTO updateWord(String id,WordDTO dto) {
        Word command = Word.builder()
                .id(id)
                .spelling(dto.getSpelling())
                .phonetic(dto.getPhonetic())
                .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : 1)
                .build();
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getId()));
        word.updateWord(command);
        Word updatedWord = wordRepository.save(word);
        
        // 发布单词更新事件
        WordUpdatedEvent event = new WordUpdatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWord(updatedWord);
        wordEventPublisher.publishWordUpdatedEvent(event);
        
        return wordMapper.toDTO(updatedWord);
    }

    @Override
    public WordDTO getWord(String id) {
        Optional<Word> optionalWord = wordRepository.findById(id);
        return optionalWord.map(wordMapper::toDTO).orElse(null);
    }

    @Override
    public WordDetailDTO getWordDetail(String id) {
        Word word = wordRepository.findById(id).orElseThrow(() -> new RuntimeException("单词不存在"));
        return wordMapper.toDetailDTO(word);
    }

    @Override
    public WordDTO getWordBySpelling(String spelling) {
        Optional<Word> optionalWord = wordRepository.findBySpelling(spelling);
        return optionalWord.map(wordMapper::toDTO).orElse(null);
    }

    @Override
    public List<WordDTO> searchWordsByMeaning(String meaning) {
        List<Word> words = wordRepository.findByChineseMeaningLike(meaning);
        return wordMapper.toDTOList(words);
    }

    @Override
    public List<WordDTO> getWordsByPartOfSpeech(String partOfSpeechId) {
        List<Word> words = wordRepository.findByPartOfSpeechId(partOfSpeechId);
        return wordMapper.toDTOList(words);
    }

    @Override
    public List<WordDTO> getAllWords() {
        List<Word> words = wordRepository.findAll();
        return wordMapper.toDTOList(words);
    }

    @Transactional
    @Override
    public void deleteWord(String id) {
        // 在删除前获取单词信息，用于事件发布
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + id));
        
        wordRepository.deleteById(id);
        
        // 发布单词删除事件
        WordDeletedEvent event = new WordDeletedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWord(word);
        wordEventPublisher.publishWordDeletedEvent(event);
    }
    
    @Transactional
    @Override
    public void batchDeleteWords(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        wordRepository.deleteAllById(ids);
    }
}