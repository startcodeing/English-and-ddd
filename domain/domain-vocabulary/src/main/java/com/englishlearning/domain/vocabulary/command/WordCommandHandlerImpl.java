package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
        Optional<Word> existWord = wordRepository.findBySpelling(createCommand.getSpelling());
        if (existWord.isPresent()) {
            throw new RuntimeException("Word already exists");
        }
        
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(createCommand.getPartOfSpeechId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + createCommand.getPartOfSpeechId()));
        
        Word word = Word.builder().build();
        word.create(createCommand);
        word.setPartOfSpeech(partOfSpeech);
        
        return wordRepository.save(word);
    }
    
    /**
     * 处理更新单词命令
     * @param command 更新单词命令
     * @return 更新后的单词实体
     */
    @Override
    public Word handle(UpdateWordCommand command) {
        // 获取实体
        Word word = wordRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getId()));
        
        // 获取词性
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(command.getPartOfSpeechId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + command.getPartOfSpeechId()));
        
        // 执行更新逻辑
        word.update(command);
        word.setPartOfSpeech(partOfSpeech);
        
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
    
    /**
     * 添加同义词
     * @param wordId 单词ID
     * @param synonymId 同义词ID
     * @return 更新后的单词实体
     */
    @Override
    public Word addSynonym(String wordId, String synonymId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        Word synonym = wordRepository.findById(synonymId)
                .orElseThrow(() -> new IllegalArgumentException("同义词不存在: " + synonymId));
        
        word.addSynonym(synonym);
        return wordRepository.save(word);
    }
    
    /**
     * 添加反义词
     * @param wordId 单词ID
     * @param antonymId 反义词ID
     * @return 更新后的单词实体
     */
    @Override
    public Word addAntonym(String wordId, String antonymId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        Word antonym = wordRepository.findById(antonymId)
                .orElseThrow(() -> new IllegalArgumentException("反义词不存在: " + antonymId));
        
        word.addAntonym(antonym);
        return wordRepository.save(word);
    }
    
    /**
     * 处理添加例句命令
     * @param command 添加例句命令
     * @return 更新后的单词实体
     */
    @Override
    public Word handle(AddExampleSentenceCommand command) {
        command.validate();
        
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        word.addExampleSentence(command.getSentence());
        return wordRepository.save(word);
    }
    
    /**
     * 处理移除例句命令
     * @param command 移除例句命令
     * @return 更新后的单词实体
     */
    @Override
    public Word handle(RemoveExampleSentenceCommand command) {
        command.validate();
        
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        word.removeExampleSentence(command.getSentence());
        return wordRepository.save(word);
    }
}