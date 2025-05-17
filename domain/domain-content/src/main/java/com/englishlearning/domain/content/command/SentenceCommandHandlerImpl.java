package com.englishlearning.domain.content.command;

import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import com.englishlearning.domain.content.event.SentenceEventPublisher;
import com.englishlearning.domain.content.event.SentenceUpdatedEvent;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.domain.content.repository.ArticleRepository;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * 句子命令处理器实现类
 * 实现处理各种句子相关命令和句子的查询
 */
@Service
@RequiredArgsConstructor
public class SentenceCommandHandlerImpl implements SentenceCommandHandler {
    
    private final SentenceRepository sentenceRepository;
    private final ArticleRepository articleRepository;
    private final WordRepository wordRepository;
    private final SentenceEventPublisher eventPublisher;
    
    /**
     * 处理创建句子命令
     * @param command 创建句子命令
     * @return 创建的句子实体
     */
    @Override
    public Sentence handle(CreateSentenceCommand command) {
        command.validate();
        
        // 验证文章是否存在
        if (command.getArticleId() != null && !command.getArticleId().trim().isEmpty()) {
            articleRepository.findById(command.getArticleId())
                    .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + command.getArticleId()));
        }
        
        // 创建句子实体
        Sentence sentence = Sentence.builder()
                .id(UUID.randomUUID().toString())
                .build();
        
        // 执行创建逻辑
        sentence.create(command);
        
        // 保存并发布事件
        Sentence savedSentence = sentenceRepository.save(sentence);

        SentenceCreatedEvent createdEvent = SentenceCreatedEvent.builder()
                .englishContent(savedSentence.getEnglishContent())
                .sentenceId(savedSentence.getId())
                .chineseMeaning(savedSentence.getChineseMeaning())
                .build();
        eventPublisher.publishSentenceCreatedEvent(createdEvent);
        
        return savedSentence;
    }
    
    /**
     * 处理更新句子命令
     * @param command 更新句子命令
     * @return 更新后的句子实体
     */
    @Override
    public Sentence handle(UpdateSentenceCommand command) {
        command.validate();
        
        // 获取句子实体
        Sentence sentence = sentenceRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + command.getId()));
        
        // 验证文章是否存在
        if (command.getArticleId() != null && !command.getArticleId().trim().isEmpty() && 
                !command.getArticleId().equals(sentence.getArticleId())) {
            articleRepository.findById(command.getArticleId())
                    .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + command.getArticleId()));
        }
        
        // 执行更新逻辑
        sentence.update(command);
        
        // 保存并发布事件
        Sentence updatedSentence = sentenceRepository.save(sentence);

        SentenceUpdatedEvent updatedEvent = SentenceUpdatedEvent.builder()
                .sentenceId(updatedSentence.getId())
                .chineseContent(updatedSentence.getEnglishContent())
                .chineseContent(updatedSentence.getChineseMeaning())
                .build();
        eventPublisher.publishSentenceUpdatedEvent(updatedEvent);
        return updatedSentence;
    }
    
    /**
     * 处理删除句子命令
     * @param command 删除句子命令
     */
    @Override
    public void handle(DeleteSentenceCommand command) {
        command.validate();
        
        // 验证句子是否存在
        Sentence sentence = sentenceRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + command.getId()));
        
        // 执行删除
        sentenceRepository.deleteById(command.getId());
    }
    
    /**
     * 添加变体
     * @param sentenceId 句子ID
     * @param variantType 变体类型
     * @param content 变体内容
     * @return 更新后的句子实体
     */
    @Override
    public Sentence addVariant(String sentenceId, String variantType, String content) {
        // 获取句子实体
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        // 创建变体
        SentenceVariant variant = SentenceVariant.builder()
                .id(UUID.randomUUID().toString())
                .type(variantType)
                .content(content)
                .build();
        
        // 添加变体
        sentence.addVariant(variant);
        
        // 保存并返回
        return sentenceRepository.save(sentence);
    }
    
    /**
     * 移除变体
     * @param sentenceId 句子ID
     * @param variantId 变体ID
     * @return 更新后的句子实体
     */
    @Override
    public Sentence removeVariant(String sentenceId, String variantId) {
        // 获取句子实体
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        // 移除变体
        sentence.removeVariant(variantId);
        
        // 保存并返回
        return sentenceRepository.save(sentence);
    }
    
    /**
     * 添加陌生单词
     * @param sentenceId 句子ID
     * @param wordId 单词ID
     * @return 更新后的句子实体
     */
    @Override
    public Sentence addUnfamiliarWord(String sentenceId, String wordId) {
        // 获取句子实体
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        // 获取单词实体
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        // 添加陌生单词
        sentence.addUnfamiliarWord(word);
        
        // 保存并返回
        return sentenceRepository.save(sentence);
    }
    
    /**
     * 移除陌生单词
     * @param sentenceId 句子ID
     * @param wordId 单词ID
     * @return 更新后的句子实体
     */
    @Override
    public Sentence removeUnfamiliarWord(String sentenceId, String wordId) {
        // 获取句子实体
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        // 移除陌生单词
        sentence.removeUnfamiliarWord(wordId);
        
        // 保存并返回
        return sentenceRepository.save(sentence);
    }
}