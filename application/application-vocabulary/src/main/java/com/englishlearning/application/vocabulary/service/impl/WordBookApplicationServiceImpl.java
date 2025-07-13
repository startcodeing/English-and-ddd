package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.WordBookDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.service.WordBookApplicationService;
import com.englishlearning.domain.vocabulary.dto.AddWordToWordBookDomainDTO;
import com.englishlearning.domain.vocabulary.dto.CreateWordBookDTO;
import com.englishlearning.domain.vocabulary.dto.DeleteWordBookDomainDTO;
import com.englishlearning.domain.vocabulary.dto.RemoveWordFromWordBookDomainDTO;
import com.englishlearning.domain.vocabulary.dto.UpdateWordBookDomainDTO;
import com.englishlearning.domain.vocabulary.event.WordBookBatchDeletedEvent;
import com.englishlearning.domain.vocabulary.event.WordBookCreatedEvent;
import com.englishlearning.domain.vocabulary.event.WordBookDeletedEvent;
import com.englishlearning.domain.vocabulary.event.WordBookEventPublisher;
import com.englishlearning.domain.vocabulary.event.WordBookUpdatedEvent;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import com.englishlearning.domain.vocabulary.repository.WordBookRepository;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 单词本应用服务实现类
 * 整合了命令处理器的功能，直接与仓储交互
 */
@Service
public class WordBookApplicationServiceImpl implements WordBookApplicationService {

    private final WordBookRepository wordBookRepository;
    private final WordMapper wordMapper;
    private final WordRepository wordRepository;
    private final WordBookEventPublisher wordBookEventPublisher;

    @Autowired
    public WordBookApplicationServiceImpl(WordBookRepository wordBookRepository, 
                                         WordMapper wordMapper,
                                         WordRepository wordRepository,
                                         WordBookEventPublisher wordBookEventPublisher) {
        this.wordBookRepository = wordBookRepository;
        this.wordMapper = wordMapper;
        this.wordRepository = wordRepository;
        this.wordBookEventPublisher = wordBookEventPublisher;
    }

    @Transactional
    @Override
    public WordBookDTO createWordBook(WordBookDTO dto) {
        CreateWordBookDTO command = CreateWordBookDTO.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        command.validate();

        Optional<WordBook> existWordBook = wordBookRepository.findByName(command.getName());
        if (existWordBook.isPresent()) {
            throw new RuntimeException("单词本已存在");
        }
        WordBook wordBook = WordBook.builder().build();
        wordBook.create(command);

        WordBook savedWordBook = wordBookRepository.save(wordBook);
        
        // 发布单词本创建事件
        WordBookCreatedEvent event = new WordBookCreatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWordBook(savedWordBook);
        wordBookEventPublisher.publishWordBookCreatedEvent(event);
        
        return convertToDTO(savedWordBook);
    }

    @Transactional
    @Override
    public WordBookDTO updateWordBook(String id, WordBookDTO dto) {
        UpdateWordBookDomainDTO command = UpdateWordBookDomainDTO.builder()
                .id(id)
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        command.validate();
        WordBook wordBook = wordBookRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getId()));
        Optional<WordBook> existWordBook = wordBookRepository.findByName(command.getName());
        if (existWordBook.isPresent() && !existWordBook.get().getId().equals(command.getId())) {
            throw new RuntimeException("单词本名称已被使用");
        }
        wordBook.update(command);
        WordBook updatedWordBook = wordBookRepository.save(wordBook);
        
        // 发布单词本更新事件
        WordBookUpdatedEvent event = new WordBookUpdatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWordBook(updatedWordBook);
        wordBookEventPublisher.publishWordBookUpdatedEvent(event);
        
        return convertToDTO(updatedWordBook);
    }

    @Override
    public WordBookDTO getWordBook(String id) {
        Optional<WordBook> optionalWordBook = wordBookRepository.findById(id);
        return optionalWordBook.map(this::convertToDTO).orElse(null);
    }

    @Override
    public WordBookDTO getWordBookByName(String name) {
        Optional<WordBook> optionalWordBook = wordBookRepository.findByName(name);
        return optionalWordBook.map(this::convertToDTO).orElse(null);
    }

    @Override
    public List<WordBookDTO> getAllWordBooks() {
        List<WordBook> wordBooks = wordBookRepository.findAll();
        return wordBooks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deleteWordBook(String id) {
        DeleteWordBookDomainDTO command = DeleteWordBookDomainDTO.builder()
                .id(id)
                .build();
        command.validate();
        WordBook wordBook = wordBookRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getId()));
        
        wordBookRepository.deleteById(command.getId());
        
        // 发布单词本删除事件
        WordBookDeletedEvent event = new WordBookDeletedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWordBook(wordBook);
        wordBookEventPublisher.publishWordBookDeletedEvent(event);
    }
    
    @Transactional
    @Override
    public void batchDeleteWordBooks(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        wordBookRepository.deleteAllById(ids);
        // 发布单词本批量删除事件
        WordBookBatchDeletedEvent event = new WordBookBatchDeletedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setWordBookIds(ids);
        wordBookEventPublisher.publishWordBookBatchDeletedEvent(event);
    }

    @Transactional
    @Override
    public void addWordsToWordBook(String wordBookId, List<String> wordIds) {
        WordBook wordBook = wordBookRepository.findById(wordBookId)
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + wordBookId));
        for (String wordId : wordIds) {
            AddWordToWordBookDomainDTO command = AddWordToWordBookDomainDTO.builder()
                    .wordBookId(wordBookId)
                    .wordId(wordId)
                    .build();
            command.validate();
            Word word = wordRepository.findById(command.getWordId())
                    .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + command.getWordId()));
            wordBook.addWord(word);
        }
        wordBookRepository.save(wordBook);
    }

    @Transactional
    @Override
    public void removeWordFromWordBook(String wordBookId, String wordId) {
        RemoveWordFromWordBookDomainDTO command = RemoveWordFromWordBookDomainDTO.builder()
                .wordBookId(wordBookId)
                .wordId(wordId)
                .build();
        command.validate();
        WordBook wordBook = wordBookRepository.findById(command.getWordBookId())
                .orElseThrow(() -> new IllegalArgumentException("单词本不存在: " + command.getWordBookId()));
        if (!wordBook.containsWord(command.getWordId())) {
            throw new IllegalArgumentException("单词本中不存在该单词: " + command.getWordId());
        }
        wordBook.removeWord(command.getWordId());
        wordBookRepository.save(wordBook);
    }

    @Override
    public List<WordBookDTO> getWordsInWordBook(String wordBookId) {
        // 查找单词本
        Optional<WordBook> optionalWordBook = wordBookRepository.findById(wordBookId);
        if (optionalWordBook.isEmpty()) {
            return new ArrayList<>();
        }
        // 这里返回的是单词本列表，但根据接口定义，应该是返回单词列表
        // 可能是接口定义有误，这里按照接口定义实现
        List<WordBookDTO> result = new ArrayList<>();
        result.add(convertToDTO(optionalWordBook.get()));
        return result;
    }

    /**
     * 将实体转换为DTO
     */
    private WordBookDTO convertToDTO(WordBook wordBook) {
        List<Word> words = wordBook.getWords();
        List<com.englishlearning.application.vocabulary.dto.WordDTO> wordDTOs = null;
        
        if (words != null && !words.isEmpty()) {
            wordDTOs = words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        return WordBookDTO.builder()
                .id(wordBook.getId())
                .name(wordBook.getName())
                .description(wordBook.getDescription())
                .words(wordDTOs)
                .build();
    }
}