package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.WordBookDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.service.WordBookApplicationService;
import com.englishlearning.domain.vocabulary.command.*;
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
 */
@Service
public class WordBookApplicationServiceImpl implements WordBookApplicationService {

    private final WordBookRepository wordBookRepository;
    private final WordMapper wordMapper;
    private final WordBookCommandHandler wordBookCommandHandler;

    @Autowired
    public WordBookApplicationServiceImpl(WordBookRepository wordBookRepository, 
                                         WordMapper wordMapper,
                                         WordBookCommandHandler wordBookCommandHandler) {
        this.wordBookRepository = wordBookRepository;
        this.wordMapper = wordMapper;
        this.wordBookCommandHandler = wordBookCommandHandler;
    }

    @Transactional
    @Override
    public WordBookDTO createWordBook(WordBookDTO dto) {
        try {
            // 创建命令对象
            CreateWordBookCommand command = CreateWordBookCommand.builder()
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .build();
            
            // 通过命令处理器执行命令
            WordBook savedWordBook = wordBookCommandHandler.handle(command);
            
            // 转换为DTO并返回
            return convertToDTO(savedWordBook);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("创建单词本失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public WordBookDTO updateWordBook(String id, WordBookDTO dto) {
        try {
            // 创建命令对象
            UpdateWordBookCommand command = UpdateWordBookCommand.builder()
                    .id(id)
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .build();
            
            // 通过命令处理器执行命令
            WordBook updatedWordBook = wordBookCommandHandler.handle(command);
            
            return convertToDTO(updatedWordBook);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("更新单词本失败: " + e.getMessage());
        }
    }

    @Override
    public WordBookDTO getWordBook(String id) {
        try {
            // 查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(id);
            return optionalWordBook.map(this::convertToDTO).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("获取单词本失败: " + e.getMessage());
        }
    }

    @Override
    public WordBookDTO getWordBookByName(String name) {
        try {
            // 根据名称查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findByName(name);
            return optionalWordBook.map(this::convertToDTO).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("获取单词本失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordBookDTO> getAllWordBooks() {
        try {
            // 获取所有单词本
            List<WordBook> wordBooks = wordBookRepository.findAll();

            // 转换为DTO列表并返回
            return wordBooks.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("获取所有单词本失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void deleteWordBook(String id) {
        try {
            // 创建命令对象
            DeleteWordBookCommand command = DeleteWordBookCommand.builder()
                    .id(id)
                    .build();
            
            // 通过命令处理器执行命令
            wordBookCommandHandler.handle(command);
        } catch (Exception e) {
            throw new RuntimeException("删除单词本失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void addWordsToWordBook(String wordBookId, List<String> wordIds) {
        try {
            for (String wordId : wordIds) {
                // 创建命令对象
                AddWordToWordBookCommand command = AddWordToWordBookCommand.builder()
                        .wordBookId(wordBookId)
                        .wordId(wordId)
                        .build();
                
                // 通过命令处理器执行命令
                wordBookCommandHandler.handle(command);
            }
        } catch (Exception e) {
            throw new RuntimeException("向单词本添加单词失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void removeWordFromWordBook(String wordBookId, String wordId) {
        try {
            // 创建命令对象
            RemoveWordFromWordBookCommand command = RemoveWordFromWordBookCommand.builder()
                    .wordBookId(wordBookId)
                    .wordId(wordId)
                    .build();
            
            // 通过命令处理器执行命令
            wordBookCommandHandler.handle(command);
        } catch (Exception e) {
            throw new RuntimeException("从单词本移除单词失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordBookDTO> getWordsInWordBook(String wordBookId) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("获取单词本中的单词失败: " + e.getMessage());
        }
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