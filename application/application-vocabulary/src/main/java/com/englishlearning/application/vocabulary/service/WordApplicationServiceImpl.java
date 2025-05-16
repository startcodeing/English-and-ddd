package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 单词应用服务实现类
 */
@Service
public class WordApplicationServiceImpl implements WordApplicationService {

    private final WordRepository wordRepository;
    private final WordMapper wordMapper;

    @Autowired
    public WordApplicationServiceImpl(WordRepository wordRepository, WordMapper wordMapper) {
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
    }

    @Override
    public Result<WordDTO> createWord(WordDTO dto) {
        try {
            // 检查是否已存在相同拼写的单词
            Optional<Word> existingWord = wordRepository.findBySpelling(dto.getWord());
            if (existingWord.isPresent()) {
                return Result.failure("已存在相同拼写的单词");
            }

            // 创建新的单词实体
            Word word = wordMapper.toEntity(dto);
            word.setId(UUID.randomUUID().toString());

            // 保存到仓储
            Word savedWord = wordRepository.save(word);
            
            // 转换为DTO并返回
            return Result.success(wordMapper.toDTO(savedWord));
        } catch (Exception e) {
            return Result.failure("创建单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<WordDTO> updateWord(String id, WordDTO dto) {
        try {
            // 查找要更新的单词
            Optional<Word> optionalWord = wordRepository.findById(id);
            if (optionalWord.isEmpty()) {
                return Result.failure("未找到指定ID的单词");
            }

            // 检查是否存在相同拼写但ID不同的单词
            Optional<Word> existingWord = wordRepository.findBySpelling(dto.getWord());
            if (existingWord.isPresent() && !existingWord.get().getId().equals(id)) {
                return Result.failure("已存在相同拼写的单词");
            }

            // 更新单词实体
            Word word = optionalWord.get();
            word.setSpelling(dto.getWord());
            word.setChineseMeaning(dto.getMeaning());
            word.setPronunciation(dto.getPronunciation());
            if (dto.getPartOfSpeech() != null) {
                // 这里需要处理词性的转换，可能需要注入PartOfSpeechRepository
                // 简化处理，直接使用mapper转换
                word.setPartOfSpeech(wordMapper.toEntity(dto).getPartOfSpeech());
            }

            // 保存到仓储
            Word updatedWord = wordRepository.save(word);

            // 转换为DTO并返回
            return Result.success(wordMapper.toDTO(updatedWord));
        } catch (Exception e) {
            return Result.failure("更新单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<WordDTO> getWord(String id) {
        try {
            // 查找单词
            Optional<Word> optionalWord = wordRepository.findById(id);
            return optionalWord.map(word -> Result.success(wordMapper.toDTO(word)))
                    .orElseGet(() -> Result.failure("未找到指定ID的单词"));
        } catch (Exception e) {
            return Result.failure("获取单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<WordDTO> getWordBySpelling(String spelling) {
        try {
            // 根据拼写查找单词
            Optional<Word> optionalWord = wordRepository.findBySpelling(spelling);
            return optionalWord.map(word -> Result.success(wordMapper.toDTO(word)))
                    .orElseGet(() -> Result.failure("未找到指定拼写的单词"));
        } catch (Exception e) {
            return Result.failure("获取单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<List<WordDTO>> searchWordsByMeaning(String meaning) {
        try {
            // 根据中文意思模糊查询单词
            List<Word> words = wordRepository.findByChineseMeaningLike(meaning);
            List<WordDTO> dtoList = words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
            return Result.success(dtoList);
        } catch (Exception e) {
            return Result.failure("查询单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<List<WordDTO>> getWordsByPartOfSpeech(String partOfSpeechId) {
        try {
            // 根据词性ID查询单词列表
            List<Word> words = wordRepository.findByPartOfSpeechId(partOfSpeechId);
            List<WordDTO> dtoList = words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
            return Result.success(dtoList);
        } catch (Exception e) {
            return Result.failure("查询单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<List<WordDTO>> getAllWords() {
        try {
            // 获取所有单词
            List<Word> words = wordRepository.findAll();
            List<WordDTO> dtoList = words.stream()
                    .map(wordMapper::toDTO)
                    .collect(Collectors.toList());
            return Result.success(dtoList);
        } catch (Exception e) {
            return Result.failure("获取所有单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> deleteWord(String id) {
        try {
            // 检查单词是否存在
            Optional<Word> optionalWord = wordRepository.findById(id);
            if (optionalWord.isEmpty()) {
                return Result.failure("未找到指定ID的单词");
            }

            // 删除单词
            wordRepository.deleteById(id);

            return Result.success();
        } catch (Exception e) {
            return Result.failure("删除单词失败: " + e.getMessage());
        }
    }
}