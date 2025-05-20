package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.dto.WordMeaningDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.service.WordApplicationService;
import com.englishlearning.domain.vocabulary.command.CreateWordCommand;
import com.englishlearning.domain.vocabulary.command.DeleteWordCommand;
import com.englishlearning.domain.vocabulary.command.UpdateWordCommand;
import com.englishlearning.domain.vocabulary.command.WordMeaningCommand;
import com.englishlearning.domain.vocabulary.command.AddExampleSentenceCommand;
import com.englishlearning.domain.vocabulary.command.RemoveExampleSentenceCommand;
import com.englishlearning.domain.vocabulary.command.AddWordMeaningCommand;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
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
    private final WordMapper wordMapper;
    private final PartOfSpeechRepository partOfSpeechRepository;

    @Autowired
    public WordApplicationServiceImpl(WordRepository wordRepository,
                                      WordMapper wordMapper,
                                      PartOfSpeechRepository partOfSpeechRepository) {
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
        this.partOfSpeechRepository = partOfSpeechRepository;
    }
        
    /**
     * 添加单词词义
     * @param command 添加单词词义命令
     * @return 更新后的单词实体
     */
    @Transactional
    public Word addWordMeaning(AddWordMeaningCommand command) {        
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        // 检查是否已存在相同词性的词义
        Optional<WordMeaning> existingMeaning = word.findMeaningByPartOfSpeech(command.getPartOfSpeechId());
        if (existingMeaning.isPresent()) {
            throw new IllegalArgumentException("该单词已存在词性为" + command.getPartOfSpeechId() + "的词义");
        }
        // 创建新词义
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
        // 添加词义
        word.addMeaning(meaning);
        // 保存并返回
        return wordRepository.save(word);
    }
    
    /**
     * 添加例句
     * @param command 添加例句命令
     * @return 更新后的单词实体
     */
    @Transactional
    public Word addExampleSentence(AddExampleSentenceCommand command) {
        command.validate();
        
        // 获取单词实体
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        // 如果提供了词义ID，则使用词义ID添加例句
        if (command.getWordMeaningId() != null && !command.getWordMeaningId().trim().isEmpty()) {
            word.addExampleSentence(command.getWordMeaningId(), command.getSentence());
        } else {
            // 兼容旧版本，使用词性ID查找词义
            word.addExampleSentence(command.getPartOfSpeechId(), command.getSentence());
        }
        
        return wordRepository.save(word);
    }
    
    /**
     * 移除例句
     * @param command 移除例句命令
     * @return 更新后的单词实体
     */
    @Transactional
    public Word removeExampleSentence(RemoveExampleSentenceCommand command) {
        command.validate();
        
        // 获取单词实体
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        // 如果提供了词义ID，则使用词义ID移除例句
        if (command.getWordMeaningId() != null && !command.getWordMeaningId().trim().isEmpty()) {
            word.removeExampleSentence(command.getWordMeaningId(), command.getSentence());
        } else {
            // 兼容旧版本，使用词性ID移除例句
            word.removeExampleSentence(command.getPartOfSpeechId(), command.getSentence());
        }
        
        return wordRepository.save(word);
    }
    
    /**
     * 添加同义词
     * @param wordId 单词ID
     * @param partOfSpeechId 词性ID
     * @param synonymId 同义词ID
     * @return 更新后的单词实体
     */
    @Transactional
    public Word addSynonym(String wordId, String wordMeaningId, String synonymWordId,String synonymWordMeaningId) {
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
        
        return wordRepository.save(word);
    }
    
    /**
     * 添加反义词
     * @param wordId 单词ID
     * @param partOfSpeechId 词性ID
     * @param antonymId 反义词ID
     * @return 更新后的单词实体
     */
    @Transactional
    public Word addAntonym(String wordId, String wordMeaningId,String antonymWordId,String antonymMeaningId) {
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
        
        return wordRepository.save(word);
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
            
            List<WordMeaningCommand> meaningCommands = new ArrayList<>();
            if (!CollectionUtils.isEmpty(dto.getWordMeanings())){
                meaningCommands = dto.getWordMeanings().stream().map(meaningDTO -> WordMeaningCommand.builder()
                        .partOfSpeechId(meaningDTO.getPartOfSpeech() != null ? meaningDTO.getPartOfSpeech().getId() : null)
                        .chineseMeaning(meaningDTO.getChineseMeaning())
                        .exampleSentences(meaningDTO.getExampleSentences())
                        .synonymIds(meaningDTO.getSynonymIds())
                        .antonymIds(meaningDTO.getAntonymIds())
                        .build()).toList();
            }
            
            // 创建命令对象
            CreateWordCommand command = CreateWordCommand.builder()
                    .spelling(dto.getSpelling())
                    .pronunciation(dto.getPronunciation())
                    .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : 1)
                    .wordMeanings(meaningCommands)
                    .build();
            
            // 创建单词实体
            Word word = Word.builder()
                    .id(UUID.randomUUID().toString())
                    .build();
            word.createWordBasic(command);
            
            // 保存并返回
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
    public WordDTO updateWord(String id, WordDTO dto) {
        try {
            // 准备词义列表
            List<WordMeaningCommand> meaningCommands = new ArrayList<>();
            // 如果有新版本的词义列表，则使用它
            for (WordMeaningDTO meaningDTO : dto.getWordMeanings()) {
                WordMeaningCommand meaningCommand = WordMeaningCommand.builder()
                        .partOfSpeechId(meaningDTO.getPartOfSpeech() != null ? meaningDTO.getPartOfSpeech().getId() : null)
                        .chineseMeaning(meaningDTO.getChineseMeaning())
                        .exampleSentences(meaningDTO.getExampleSentences())
                        .synonymIds(meaningDTO.getSynonymIds())
                        .antonymIds(meaningDTO.getAntonymIds())
                        .build();
                meaningCommands.add(meaningCommand);
            }
            // 创建命令对象
            UpdateWordCommand command = UpdateWordCommand.builder()
                    .id(id)
                    .spelling(dto.getSpelling())
                    .pronunciation(dto.getPronunciation())
                    .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : 1)
                    .wordMeanings(meaningCommands)
                    .build();

            // 验证命令
            command.validate();
            
            // 获取单词实体
            Word word = wordRepository.findById(command.getId())
                    .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getId()));
            
            // 使用实体的update方法更新单词
            word.updateWordBasic(command);
            
            // 保存并返回
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
            // 创建命令对象
            DeleteWordCommand command = DeleteWordCommand.builder()
                    .id(id)
                    .build();

            // 验证命令
            command.validate();
            
            // 直接删除
            wordRepository.deleteById(command.getId());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("删除单词失败: " + e.getMessage());
        }
    }
}