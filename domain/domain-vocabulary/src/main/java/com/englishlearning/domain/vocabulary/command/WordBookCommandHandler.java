package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.WordBook;

/**
 * 单词本命令处理器接口
 * 定义处理各种单词本相关命令的方法
 */
public interface WordBookCommandHandler {
    
    /**
     * 处理创建单词本命令
     * @param command 创建单词本命令
     * @return 创建的单词本实体
     */
    WordBook handle(CreateWordBookCommand command);
    
    /**
     * 处理更新单词本命令
     * @param command 更新单词本命令
     * @return 更新后的单词本实体
     */
    WordBook handle(UpdateWordBookCommand command);
    
    /**
     * 处理删除单词本命令
     * @param command 删除单词本命令
     */
    void handle(DeleteWordBookCommand command);
    
    /**
     * 处理添加单词到单词本命令
     * @param command 添加单词到单词本命令
     * @return 更新后的单词本实体
     */
    WordBook handle(AddWordToWordBookCommand command);
    
    /**
     * 处理从单词本移除单词命令
     * @param command 从单词本移除单词命令
     * @return 更新后的单词本实体
     */
    WordBook handle(RemoveWordFromWordBookCommand command);
}