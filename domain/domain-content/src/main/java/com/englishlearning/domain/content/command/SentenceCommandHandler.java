package com.englishlearning.domain.content.command;

import com.englishlearning.domain.content.model.entity.Sentence;

/**
 * 句子命令处理器接口
 * 定义处理各种句子相关命令的方法
 */
public interface SentenceCommandHandler {
    
    /**
     * 处理创建句子命令
     * @param command 创建句子命令
     * @return 创建的句子实体
     */
    Sentence handle(CreateSentenceCommand command);
    
    /**
     * 处理更新句子命令
     * @param command 更新句子命令
     * @return 更新后的句子实体
     */
    Sentence handle(UpdateSentenceCommand command);
    
    /**
     * 处理删除句子命令
     * @param command 删除句子命令
     */
    void handle(DeleteSentenceCommand command);
    
    /**
     * 添加变体
     * @param sentenceId 句子ID
     * @param variantType 变体类型
     * @param content 变体内容
     * @return 更新后的句子实体
     */
    Sentence addVariant(String sentenceId, String variantType, String content);
    
    /**
     * 移除变体
     * @param sentenceId 句子ID
     * @param variantId 变体ID
     * @return 更新后的句子实体
     */
    Sentence removeVariant(String sentenceId, String variantId);
    
    /**
     * 添加陌生单词
     * @param sentenceId 句子ID
     * @param wordId 单词ID
     * @return 更新后的句子实体
     */
    Sentence addUnfamiliarWord(String sentenceId, String wordId);
    
    /**
     * 移除陌生单词
     * @param sentenceId 句子ID
     * @param wordId 单词ID
     * @return 更新后的句子实体
     */
    Sentence removeUnfamiliarWord(String sentenceId, String wordId);
}