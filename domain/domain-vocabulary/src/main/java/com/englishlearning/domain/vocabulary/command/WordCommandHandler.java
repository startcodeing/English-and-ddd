package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.Word;

/**
 * 单词命令处理器接口
 * 定义处理各种单词相关命令的方法
 */
public interface WordCommandHandler {
    
    /**
     * 处理创建单词命令
     * @param command 创建单词命令
     * @return 创建的单词实体
     */
    Word handle(CreateWordCommand command);
    
    /**
     * 处理更新单词命令
     * @param command 更新单词命令
     * @return 更新后的单词实体
     */
    Word handle(UpdateWordCommand command);
    
    /**
     * 处理删除单词命令
     * @param command 删除单词命令
     */
    void handle(DeleteWordCommand command);
    
    /**
     * 处理添加例句命令
     * @param command 添加例句命令
     * @return 更新后的单词实体
     */
    Word handle(AddExampleSentenceCommand command);
    
    /**
     * 处理移除例句命令
     * @param command 移除例句命令
     * @return 更新后的单词实体
     */
    Word handle(RemoveExampleSentenceCommand command);
    
    /**
     * 添加同义词
     * @param wordId 单词ID
     * @param synonymId 同义词ID
     * @return 更新后的单词实体
     */
    Word addSynonym(String wordId, String synonymId);
    
    /**
     * 添加反义词
     * @param wordId 单词ID
     * @param antonymId 反义词ID
     * @return 更新后的单词实体
     */
    Word addAntonym(String wordId, String antonymId);
}