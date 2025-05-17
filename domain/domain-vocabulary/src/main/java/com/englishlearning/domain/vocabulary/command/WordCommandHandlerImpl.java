package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

/**
 * 单词命令处理器实现类
 * 实现处理各种单词相关命令和单词的查询
 */
@Service
@RequiredArgsConstructor
public class WordCommandHandlerImpl implements WordCommandHandler {
    
    private final WordRepository wordRepository;
    private final PartOfSpeechRepository partOfSpeechRepository;
    
    /**
     * 处理创建单词命令
     * @param createCommand 创建单词命令
     * @return 创建的单词实体
     */
    @Override
    public Word handle(CreateWordCommand createCommand) {
        createCommand.validate();
        
        // 检查单词是否已存在
        Optional<Word> existWord = wordRepository.findBySpelling(createCommand.getSpelling());
        if (existWord.isPresent()) {
            throw new IllegalArgumentException("单词已存在: " + createCommand.getSpelling());
        }
        
        // 创建单词实体
        Word word = Word.builder()
                .id(UUID.randomUUID().toString())
                .spelling(createCommand.getSpelling())
                .pronunciation(createCommand.getPronunciation())
                .difficultyLevel(createCommand.getDifficultyLevel())
                .meanings(new ArrayList<>())
                .build();
        
        // 执行创建逻辑
        word.create(createCommand);
        
        // 保存并返回
        return wordRepository.save(word);
    }
    
    /**
     * 处理更新单词命令
     * @param command 更新单词命令
     * @return 更新后的单词实体
     */
    @Override
    public Word handle(UpdateWordCommand command) {
        command.validate();
        
        // 获取单词实体
        Word word = wordRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getId()));
        
        // 执行更新逻辑
        word.update(command);
        
        // 保存并返回
        return wordRepository.save(word);
    }
    
    @Override
    public Word handle(AddWordMeaningCommand command) {
        command.validate();
        
        // 获取单词实体
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
                .exampleSentences(CollectionUtils.isEmpty(command.getExampleSentences()) ?
                        new ArrayList<>() : command.getExampleSentences())
                .synonymIds(CollectionUtils.isEmpty(command.getSynonymIds()) ?
                        new ArrayList<>() : command.getSynonymIds())
                .antonymIds(CollectionUtils.isEmpty(command.getAntonymIds()) ?
                        new ArrayList<>() : command.getAntonymIds())
                .build();
        
        // 添加词义
        word.addMeaning(meaning);
        
        // 保存并返回
        return wordRepository.save(word);
    }
    
    /**
     * 处理删除单词命令
     * @param command 删除单词命令
     */
    @Override
    public void handle(DeleteWordCommand command) {
        command.validate();
        wordRepository.deleteById(command.getId());
    }

    @Override
    public Word handle(AddExampleSentenceCommand command) {
        return null;
    }

    @Override
    public Word handle(RemoveExampleSentenceCommand command) {
        return null;
    }

    /**
     * 添加同义词
     */
    @Override
    public Word addSynonym(String wordId, String partOfSpeechId, String synonymId) {
        // 获取单词实体
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        // 获取同义词实体
        Word synonym = wordRepository.findById(synonymId)
                .orElseThrow(() -> new IllegalArgumentException("同义词不存在: " + synonymId));
        
        // 添加同义词并保存
        word.addSynonym(partOfSpeechId, synonym);
        return wordRepository.save(word);
    }
    
    /**
     * 添加反义词
     */
    @Override
    public Word addAntonym(String wordId, String partOfSpeechId, String antonymId) {
        // 获取单词实体
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        // 获取反义词实体
        Word antonym = wordRepository.findById(antonymId)
                .orElseThrow(() -> new IllegalArgumentException("反义词不存在: " + antonymId));
        
        // 添加反义词并保存
        word.addAntonym(partOfSpeechId, antonym);
        return wordRepository.save(word);
    }
    
    /**
     * 添加例句
     */
    @Override
    public Word addExampleSentence(AddExampleSentenceCommand command) {
        command.validate();
        
        // 获取单词实体
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        // 添加例句并保存
        word.addExampleSentence(command.getPartOfSpeechId(), command.getSentence());
        return wordRepository.save(word);
    }
    
    /**
     * 移除例句
     */
    @Override
    public Word removeExampleSentence(RemoveExampleSentenceCommand command) {
        command.validate();
        
        // 获取单词实体
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        // 移除例句并保存
        word.removeExampleSentence(command.getPartOfSpeechId(), command.getSentence());
        return wordRepository.save(word);
    }
}