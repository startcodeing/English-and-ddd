package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.AddWordMeaningExampleSentenceDTO;
import com.englishlearning.application.vocabulary.dto.DeleteWordMeaningSentenceDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.dto.WordMeaningDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.mapper.WordMeaningMapper;
import com.englishlearning.application.vocabulary.service.SentenceProvider;
import com.englishlearning.application.vocabulary.service.WordApplicationService;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Autowired
    public WordApplicationServiceImpl(WordRepository wordRepository,
                                      WordMapper wordMapper,
                                      SentenceProvider sentenceProvider,
                                      WordMeaningMapper wordMeaningMapper) {
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
        this.sentenceProvider = sentenceProvider;
        this.wordMeaningMapper = wordMeaningMapper;
    }
        
    /**
     * 添加单词词义
     * @param command 添加单词词义命令
     * @return 更新后的单词实体
     */
    @Transactional
    @Override
    public WordDTO addWordMeaning(WordMeaningDTO command) {
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));

        Optional<WordMeaning> existingMeaning = word.findMeaningByPartOfSpeech(command.getPartOfSpeechId());
        if (existingMeaning.isPresent()) {
            throw new IllegalArgumentException("该单词已存在词性为" + command.getPartOfSpeechId() + "的词义");
        }
        WordMeaning meaning = WordMeaning.builder()
                .id(UUID.randomUUID().toString())
                .partOfSpeechId(command.getPartOfSpeechId())
                .chineseMeaning(command.getChineseMeaning())
                .exampleSentenceIds(CollectionUtils.isEmpty(command.getExampleSentences())?
                        new ArrayList<>() : command.getExampleSentences())
                .synonymWordMeaningIds(CollectionUtils.isEmpty(command.getSynonymIds()) ?
                        new ArrayList<>() : command.getSynonymIds())
                .antonymWordMeaningIds(CollectionUtils.isEmpty(command.getAntonymIds()) ?
                        new ArrayList<>() : command.getAntonymIds())
                .build();
        word.addMeaning(meaning);
        Word wordPo = wordRepository.save(word);
        return wordMapper.toDTO(wordPo);
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
     * @param addSentenceDto 添加例句命令
     * @return 更新后的单词实体
     */
    @Transactional
    @Override
    public WordDTO addExampleSentence(AddWordMeaningExampleSentenceDTO addSentenceDto) {
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
     * @param deleteWordMeaningSentenceDTO 移除例句命令
     * @return 更新后的单词实体
     */
    @Transactional
    public WordMeaningDTO removeExampleSentence(DeleteWordMeaningSentenceDTO deleteWordMeaningSentenceDTO) {
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
     * @param wordId 单词ID
     * @param wordMeaningId 词性ID
     * @param synonymWordId 同义词ID
     * @param synonymWordMeaningId 同义词词性ID
     * @return 更新后的单词实体
     */
    @Transactional
    public WordMeaningDTO addSynonym(String wordId, String wordMeaningId, String synonymWordId,String synonymWordMeaningId) {
        // 获取单词实体
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        // 校验添加的同义词是否存在
        Word synonymWord = wordRepository.findById(synonymWordId).orElseThrow(() -> new IllegalArgumentException("同义词不存在: " + synonymWordId));
        synonymWord.findMeaningByMeaningId(synonymWordMeaningId).orElseThrow(() -> new IllegalArgumentException("同义词不存在: " + synonymWordMeaningId));
        
        // 查找对应词性的词义
        Optional<WordMeaning> meaningOpt = word.findMeaningByMeaningId(wordMeaningId);
        if (meaningOpt.isPresent()) {
            // 添加同义词并保存
            word.addSynonym(meaningOpt.get().getId(), synonymWordMeaningId);
        } else {
            throw new IllegalArgumentException("找不到词性为" + wordMeaningId + "的词义");
        }
        Word savedWord = wordRepository.save(word);
        return savedWord.findMeaningByMeaningId(wordMeaningId).map(wordMeaningMapper::toDTO).orElse(null);
    }
    
    /**
     * 添加反义词
     * @param wordId 单词ID
     * @param wordMeaningId 词性ID
     * @param antonymWordId 反义词ID
     * @param antonymMeaningId 反义词词性ID
     * @return 更新后的单词实体
     */
    @Transactional
    public WordMeaningDTO addAntonym(String wordId, String wordMeaningId,String antonymWordId,String antonymMeaningId) {
        // 获取单词实体
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        // 获取反义词实体
        Word antonymWord = wordRepository.findById(antonymWordId)
                .orElseThrow(() -> new IllegalArgumentException("反义词不存在: " + antonymWordId));
        antonymWord.findMeaningByMeaningId(antonymMeaningId).orElseThrow(() -> new IllegalArgumentException("反义词WordMeaning不存在: " + antonymMeaningId));
        
        // 查找对应词性的词义
        Optional<WordMeaning> meaningOpt = word.findMeaningByMeaningId(wordMeaningId);
        if (meaningOpt.isPresent()) {
            // 添加反义词并保存
            word.addAntonym(meaningOpt.get().getId(), antonymMeaningId);
        } else {
            throw new IllegalArgumentException("找不到词性为" + wordMeaningId + "的词义");
        }
        Word savedWord = wordRepository.save(word);
        return savedWord.findMeaningByMeaningId(wordMeaningId).map(wordMeaningMapper::toDTO).orElse(null);
    }

    @Override
    public void removeSynonym(String wordId,String meaningId, String synonymId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        word.findMeaningByMeaningId(meaningId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + meaningId));
        word.removeSynonym(meaningId, synonymId);
        wordRepository.save(word);
    }

    @Override
    public void removeAntonym(String wordId,String meaningId, String synonymId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        word.findMeaningByMeaningId(meaningId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + meaningId));
        word.removeAntonym(meaningId, synonymId);
        wordRepository.save(word);
    }

    @Transactional
    @Override
    public WordDTO createWord(WordDTO dto) {
        try {
            // 检查单词是否已存在
            Optional<Word> existWord = wordRepository.findBySpelling(dto.getSpelling());
            if (existWord.isPresent()) {
                throw new IllegalArgumentException("单词已存在: " + dto.getSpelling());
            }
            // 创建命令对象
            Word wordInfo = Word.builder()
                    .spelling(dto.getSpelling())
                    .pronunciation(dto.getPronunciation())
                    .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : 1)
                    .build();            
            Word word = Word.builder()
                    .id(UUID.randomUUID().toString())
                    .build();
            word.createWord(wordInfo);
            Word savedWord = wordRepository.save(word);
            return wordMapper.toDTO(savedWord);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("创建单词失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public WordDTO updateWord(WordDTO dto) {
        try {
            Word command = Word.builder()
                    .id(dto.getId())
                    .spelling(dto.getSpelling())
                    .pronunciation(dto.getPronunciation())
                    .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : 1)
                    .build();
            Word word = wordRepository.findById(command.getId())
                    .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getId()));
            word.updateWord(command);
            Word updatedWord = wordRepository.save(word);
            return wordMapper.toDTO(updatedWord);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("更新单词失败: " + e.getMessage());
        }
    }

    @Override
    public WordDTO getWord(String id) {
        try {
            // 查找单词
            Optional<Word> optionalWord = wordRepository.findById(id);
            return optionalWord.map(wordMapper::toDTO).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("获取单词失败: " + e.getMessage());
        }
    }

    @Override
    public WordDTO getWordBySpelling(String spelling) {
        try {
            // 查找单词
            Optional<Word> optionalWord = wordRepository.findBySpelling(spelling);
            return optionalWord.map(wordMapper::toDTO).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("获取单词失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordDTO> searchWordsByMeaning(String meaning) {
        try {
            // 根据中文意思模糊查询单词
            List<Word> words = wordRepository.findByChineseMeaningLike(meaning);
            return wordMapper.toDTOList(words);
        } catch (Exception e) {
            throw new RuntimeException("查询单词失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordDTO> getWordsByPartOfSpeech(String partOfSpeechId) {
        try {
            // 根据词性ID查询单词列表
            List<Word> words = wordRepository.findByPartOfSpeechId(partOfSpeechId);
            return wordMapper.toDTOList(words);
        } catch (Exception e) {
            throw new RuntimeException("查询单词失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordDTO> getAllWords() {
        try {
            // 获取所有单词
            List<Word> words = wordRepository.findAll();
            return wordMapper.toDTOList(words);
        } catch (Exception e) {
            throw new RuntimeException("获取单词列表失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void deleteWord(String id) {
        try {
            // 直接删除
            wordRepository.deleteById(id);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("删除单词失败: " + e.getMessage());
        }
    }
}