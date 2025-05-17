package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.service.WordApplicationService;
import com.englishlearning.domain.vocabulary.command.*;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 单词应用服务实现类
 */
@Service
public class WordApplicationServiceImpl implements WordApplicationService {

    private final WordRepository wordRepository;
    private final WordMapper wordMapper;
    private final WordCommandHandler wordCommandHandler;

    @Autowired
    public WordApplicationServiceImpl(WordRepository wordRepository, 
                                      WordMapper wordMapper,
                                      WordCommandHandler wordCommandHandler) {
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
        this.wordCommandHandler = wordCommandHandler;
    }

    @Transactional
    @Override
    public WordDTO createWord(WordDTO dto) {
        try {
            // 创建命令对象
            CreateWordCommand command = CreateWordCommand.builder()
                    .spelling(dto.getWord())
                    .pronunciation(dto.getPronunciation())
                    .chineseMeaning(dto.getMeaning())
                    .partOfSpeechId(dto.getPartOfSpeech() != null ? dto.getPartOfSpeech().getId() : null)
                    .exampleSentences(dto.getPartOfSpeech().getCommonPhrases())
                    .build();
            
            // 通过命令处理器执行命令
            Word savedWord = wordCommandHandler.handle(command);
            
            // 转换为DTO并返回
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
            // 创建命令对象
            UpdateWordCommand command = UpdateWordCommand.builder()
                    .id(id)
                    .spelling(dto.getWord())
                    .pronunciation(dto.getPronunciation())
                    .chineseMeaning(dto.getMeaning())
                    .partOfSpeechId(dto.getPartOfSpeech() != null ? dto.getPartOfSpeech().getId() : null)
                    .exampleSentences(dto.getPartOfSpeech().getCommonPhrases())
                    .build();
            
            // 通过命令处理器执行命令
            Word updatedWord = wordCommandHandler.handle(command);
            // 转换为DTO并返回
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
            // 根据拼写查找单词
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
            return words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("查询单词失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordDTO> getWordsByPartOfSpeech(String partOfSpeechId) {
        try {
            // 根据词性ID查询单词列表
            List<Word> words = wordRepository.findByPartOfSpeechId(partOfSpeechId);
            return words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("查询单词失败: " + e.getMessage());
        }
    }

    @Override
    public List<WordDTO> getAllWords() {
        try {
            // 获取所有单词
            List<Word> words = wordRepository.findAll();
            return words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("获取所有单词失败: " + e.getMessage());
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
            // 通过命令处理器执行命令
            wordCommandHandler.handle(command);
        } catch (Exception e) {
            throw new RuntimeException("删除单词失败: " + e.getMessage());
        }
    }
}