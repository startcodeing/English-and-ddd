package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.mapper.SentenceVariantMapper;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.command.CreateSentenceCommand;
import com.englishlearning.domain.content.command.DeleteSentenceCommand;
import com.englishlearning.domain.content.command.SentenceCommandHandler;
import com.englishlearning.domain.content.command.UpdateSentenceCommand;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.repository.SentenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 句子应用服务实现类
 * 使用命令处理器模式与领域层交互
 */
@Service
@RequiredArgsConstructor
public class SentenceApplicationServiceImpl implements SentenceApplicationService {
    
    private final SentenceRepository sentenceRepository;
    private final SentenceCommandHandler sentenceCommandHandler;
    private final SentenceMapper sentenceMapper;
    private final SentenceVariantMapper variantMapper;
    private final WordMapper wordMapper;
    
    /**
     * 创建句子
     */
    @Transactional
    @Override
    public SentenceDTO createSentence(SentenceDTO sentenceDTO) {
        try {
            // 创建命令对象
            CreateSentenceCommand command = CreateSentenceCommand.builder()
                    .englishContent(sentenceDTO.getEnglishContent())
                    .chineseMeaning(sentenceDTO.getChineseMeaning())
                    .grammarAnalysis(sentenceDTO.getGrammarAnalysis())
                    .build();
            
            // 通过命令处理器执行命令
            Sentence savedSentence = sentenceCommandHandler.handle(command);
            // 转换为DTO并返回
            return sentenceMapper.toDTO(savedSentence);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("创建句子失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新句子
     */
    @Transactional
    @Override
    public SentenceDTO updateSentence(SentenceDTO sentenceDTO) {
        try {
            // 创建命令对象
            UpdateSentenceCommand command = UpdateSentenceCommand.builder()
                    .id(sentenceDTO.getId())
                    .englishContent(sentenceDTO.getEnglishContent())
                    .chineseMeaning(sentenceDTO.getChineseMeaning())
                    .grammarAnalysis(sentenceDTO.getGrammarAnalysis())
                    .build();
            
            // 通过命令处理器执行命令
            Sentence updatedSentence = sentenceCommandHandler.handle(command);
            
            // 转换为DTO并返回
            return sentenceMapper.toDTO(updatedSentence);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("更新句子失败: " + e.getMessage());
        }
    }
    
    /**
     * 查找句子
     */
    @Override
    public Optional<SentenceDTO> findSentenceById(String id) {
        return sentenceRepository.findById(id)
                .map(sentenceMapper::toDTO);
    }
    
    /**
     * 查找所有句子
     */
    @Override
    public List<SentenceDTO> findAllSentences() {
        return sentenceRepository.findAll().stream()
                .map(sentenceMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据英文内容查找句子
     */
    @Override
    public List<SentenceDTO> findSentencesByEnglishContent(String englishContent) {
        return sentenceRepository.findByEnglishContentLike(englishContent).stream()
                .map(sentenceMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据中文意思查找句子
     */
    @Override
    public List<SentenceDTO> findSentencesByChineseMeaning(String chineseMeaning) {
        return sentenceRepository.findByChineseMeaningLike(chineseMeaning).stream()
                .map(sentenceMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 为句子添加变体
     */
    @Transactional
    @Override
    public SentenceDTO addVariant(String sentenceId, SentenceVariantDTO variantDTO) {
        try {
            // 通过命令处理器执行命令
            Sentence updatedSentence = sentenceCommandHandler.addVariant(
                    sentenceId,
                    variantDTO.getType(),
                    variantDTO.getContent()
            );
            
            // 转换为DTO并返回
            return sentenceMapper.toDTO(updatedSentence);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("添加句子变体失败: " + e.getMessage());
        }
    }
    
    /**
     * 为句子添加陌生单词
     */
    @Transactional
    @Override
    public SentenceDTO addUnfamiliarWord(String sentenceId, WordDTO wordDTO) {
        try {
            // 通过命令处理器执行命令
            Sentence updatedSentence = sentenceCommandHandler.addUnfamiliarWord(
                    sentenceId,
                    wordDTO.getId()
            );
            
            // 转换为DTO并返回
            return sentenceMapper.toDTO(updatedSentence);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("添加陌生单词失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除句子
     */
    @Transactional
    @Override
    public void deleteSentence(String id) {
        try {
            // 创建命令对象
            DeleteSentenceCommand command = DeleteSentenceCommand.builder()
                    .id(id)
                    .build();
            
            // 通过命令处理器执行命令
            sentenceCommandHandler.handle(command);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("删除句子失败: " + e.getMessage());
        }
    }
}