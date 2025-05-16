package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.WordBookDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import com.englishlearning.domain.vocabulary.repository.WordBookRepository;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 单词本应用服务实现类
 */
@Service
public class WordBookApplicationServiceImpl implements WordBookApplicationService {

    private final WordBookRepository wordBookRepository;
    private final WordRepository wordRepository;
    private final WordMapper wordMapper;

    @Autowired
    public WordBookApplicationServiceImpl(WordBookRepository wordBookRepository, 
                                         WordRepository wordRepository,
                                         WordMapper wordMapper) {
        this.wordBookRepository = wordBookRepository;
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
    }

    @Override
    public Result<WordBookDTO> createWordBook(WordBookDTO dto) {
        try {
            // 检查是否已存在相同名称的单词本
            Optional<WordBook> existingWordBook = wordBookRepository.findByName(dto.getName());
            if (existingWordBook.isPresent()) {
                return Result.failure("已存在相同名称的单词本");
            }

            // 创建新的单词本实体
            WordBook wordBook = WordBook.builder()
                    .id(UUID.randomUUID().toString())
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .words(new ArrayList<>())
                    .build();

            // 保存到仓储
            WordBook savedWordBook = wordBookRepository.save(wordBook);
            
            // 转换为DTO并返回
            return Result.success(convertToDTO(savedWordBook));
        } catch (Exception e) {
            return Result.failure("创建单词本失败: " + e.getMessage());
        }
    }

    @Override
    public Result<WordBookDTO> updateWordBook(String id, WordBookDTO dto) {
        try {
            // 查找要更新的单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(id);
            if (optionalWordBook.isEmpty()) {
                return Result.failure("未找到指定ID的单词本");
            }

            // 检查是否存在相同名称但ID不同的单词本
            Optional<WordBook> existingWordBook = wordBookRepository.findByName(dto.getName());
            if (existingWordBook.isPresent() && !existingWordBook.get().getId().equals(id)) {
                return Result.failure("已存在相同名称的单词本");
            }

            // 更新单词本实体
            WordBook wordBook = optionalWordBook.get();
            wordBook.setName(dto.getName());
            wordBook.setDescription(dto.getDescription());

            // 保存到仓储
            WordBook updatedWordBook = wordBookRepository.save(wordBook);
            return Result.success(convertToDTO(updatedWordBook));
        } catch (Exception e) {
            return Result.failure("更新单词本失败: " + e.getMessage());
        }
    }

    @Override
    public Result<WordBookDTO> getWordBook(String id) {
        try {
            // 查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(id);
            return optionalWordBook.map(wordBook -> Result.success(convertToDTO(wordBook)))
                    .orElseGet(() -> Result.failure("未找到指定ID的单词本"));
        } catch (Exception e) {
            return Result.failure("获取单词本失败: " + e.getMessage());
        }
    }

    @Override
    public Result<WordBookDTO> getWordBookByName(String name) {
        try {
            // 根据名称查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findByName(name);
            return optionalWordBook.map(wordBook -> Result.success(convertToDTO(wordBook)))
                    .orElseGet(() -> Result.failure("未找到指定名称的单词本"));
        } catch (Exception e) {
            return Result.failure("获取单词本失败: " + e.getMessage());
        }
    }

    @Override
    public Result<List<WordBookDTO>> getAllWordBooks() {
        try {
            // 获取所有单词本
            List<WordBook> wordBooks = wordBookRepository.findAll();

            // 转换为DTO列表并返回
            List<WordBookDTO> dtoList = wordBooks.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return Result.success(dtoList);
        } catch (Exception e) {
            return Result.failure("获取所有单词本失败: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> deleteWordBook(String id) {
        try {
            // 检查单词本是否存在
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(id);
            if (optionalWordBook.isEmpty()) {
                return Result.failure("未找到指定ID的单词本");
            }

            // 删除单词本
            wordBookRepository.deleteById(id);

            return Result.success();
        } catch (Exception e) {
            return Result.failure("删除单词本失败: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> addWordsToWordBook(String wordBookId, List<String> wordIds) {
        try {
            // 查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(wordBookId);
            if (optionalWordBook.isEmpty()) {
                return Result.failure("未找到指定ID的单词本");
            }

            WordBook wordBook = optionalWordBook.get();
            List<Word> currentWords = wordBook.getWords();
            if (currentWords == null) {
                currentWords = new ArrayList<>();
            }

            // 查找要添加的单词
            for (String wordId : wordIds) {
                Optional<Word> optionalWord = wordRepository.findById(wordId);
                if (optionalWord.isPresent()) {
                    Word word = optionalWord.get();
                    // 检查单词是否已在单词本中
                    boolean exists = currentWords.stream()
                            .anyMatch(w -> w.getId().equals(wordId));
                    if (!exists) {
                        currentWords.add(word);
                    }
                }
            }

            wordBook.setWords(currentWords);
            wordBookRepository.save(wordBook);

            return Result.success();
        } catch (Exception e) {
            return Result.failure("向单词本添加单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> removeWordFromWordBook(String wordBookId, String wordId) {
        try {
            // 查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(wordBookId);
            if (optionalWordBook.isEmpty()) {
                return Result.failure("未找到指定ID的单词本");
            }

            WordBook wordBook = optionalWordBook.get();
            List<Word> words = wordBook.getWords();
            if (words != null) {
                // 移除指定ID的单词
                words = words.stream()
                        .filter(word -> !word.getId().equals(wordId))
                        .collect(Collectors.toList());
                wordBook.setWords(words);
                wordBookRepository.save(wordBook);
            }

            return Result.success();
        } catch (Exception e) {
            return Result.failure("从单词本移除单词失败: " + e.getMessage());
        }
    }

    @Override
    public Result<List<WordBookDTO>> getWordsInWordBook(String wordBookId) {
        try {
            // 查找单词本
            Optional<WordBook> optionalWordBook = wordBookRepository.findById(wordBookId);
            if (optionalWordBook.isEmpty()) {
                return Result.failure("未找到指定ID的单词本");
            }

            // 这里返回的是单词本列表，但根据接口定义，应该是返回单词列表
            // 可能是接口定义有误，这里按照接口定义实现
            List<WordBookDTO> result = new ArrayList<>();
            result.add(convertToDTO(optionalWordBook.get()));
            return Result.success(result);
        } catch (Exception e) {
            return Result.failure("获取单词本中的单词失败: " + e.getMessage());
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