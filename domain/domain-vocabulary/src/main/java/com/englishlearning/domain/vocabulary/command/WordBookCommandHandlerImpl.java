package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import com.englishlearning.domain.vocabulary.repository.WordBookRepository;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 单词本命令处理器实现类
 * 实现处理各种单词本相关命令和单词本的查询
 */
@Service
@RequiredArgsConstructor
public class WordBookCommandHandlerImpl implements WordBookCommandHandler {
    
    private final WordBookRepository wordBookRepository;
    private final WordRepository wordRepository;
    
    /**
     * 处理创建单词本命令
     * @param command 创建单词本命令
     * @return 创建的单词本实体
     */
    @Override
    public WordBook handle(CreateWordBookCommand command) {
        command.validate();
        
        Optional<WordBook> existWordBook = wordBookRepository.findByName(command.getName());
        if (existWordBook.isPresent()) {
            throw new RuntimeException("单词本已存在");
        }
        
        WordBook wordBook = WordBook.builder().build();
        wordBook.create(command);
        
        return wordBookRepository.save(wordBook);
    }
    
    /**
     * 处理更新单词本命令
     * @param command 更新单词本命令
     * @return 更新后的单词本实体
     */
    @Override
    public WordBook handle(UpdateWordBookCommand command) {
        command.validate();
        
        // 获取实体
        WordBook wordBook = wordBookRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getId()));
        
        // 检查名称是否已被其他单词本使用
        Optional<WordBook> existWordBook = wordBookRepository.findByName(command.getName());
        if (existWordBook.isPresent() && !existWordBook.get().getId().equals(command.getId())) {
            throw new RuntimeException("单词本名称已被使用");
        }
        
        // 执行更新逻辑
        wordBook.update(command);
        
        // 保存并返回
        return wordBookRepository.save(wordBook);
    }
    
    /**
     * 处理删除单词本命令
     * @param command 删除单词本命令
     */
    @Override
    public void handle(DeleteWordBookCommand command) {
        command.validate();
        wordBookRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getId()));
        wordBookRepository.deleteById(command.getId());
    }
    
    /**
     * 处理添加单词到单词本命令
     * @param command 添加单词到单词本命令
     * @return 更新后的单词本实体
     */
    @Override
    public WordBook handle(AddWordToWordBookCommand command) {
        command.validate();
        
        // 获取单词本
        WordBook wordBook = wordBookRepository.findById(command.getWordBookId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getWordBookId()));
        
        // 获取单词
        Word word = wordRepository.findById(command.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
        
        // 添加单词到单词本
        wordBook.addWord(word);
        
        // 保存并返回
        return wordBookRepository.save(wordBook);
    }
    
    /**
     * 处理从单词本移除单词命令
     * @param command 从单词本移除单词命令
     * @return 更新后的单词本实体
     */
    @Override
    public WordBook handle(RemoveWordFromWordBookCommand command) {
        command.validate();
        
        // 获取单词本
        WordBook wordBook = wordBookRepository.findById(command.getWordBookId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getWordBookId()));
        
        // 检查单词是否存在
        if (!wordBook.containsWord(command.getWordId())) {
            throw new IllegalArgumentException("单词本中不存在该单词: " + command.getWordId());
        }
        
        // 从单词本移除单词
        wordBook.removeWord(command.getWordId());
        
        // 保存并返回
        return wordBookRepository.save(wordBook);
    }
}