package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;

/**
 * 词性命令处理器接口
 * 定义处理各种词性相关命令的方法
 */
public interface PartOfSpeechCommandHandler {
    
    /**
     * 处理创建词性命令
     * @param command 创建词性命令
     * @return 创建的词性实体
     */
    PartOfSpeech handle(CreatePartOfSpeechCommand command);
    
    /**
     * 处理更新词性命令
     * @param command 更新词性命令
     * @return 更新后的词性实体
     */
    PartOfSpeech handle(UpdatePartOfSpeechCommand command);
    
    /**
     * 处理删除词性命令
     * @param command 删除词性命令
     */
    void handle(DeletePartOfSpeechCommand command);
    
    /**
     * 处理更新词性用法总结命令
     * @param command 更新词性用法总结命令
     * @return 更新后的词性实体
     */
    PartOfSpeech handle(UpdatePartOfSpeechUsageSummaryCommand command);
    
    /**
     * 处理更新词性常用短语命令
     * @param command 更新词性常用短语命令
     * @return 更新后的词性实体
     */
    PartOfSpeech handle(UpdatePartOfSpeechCommonPhrasesCommand command);
}