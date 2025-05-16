package com.englishlearning.domain.vocabulary.command;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 词性命令处理器实现类
 * 实现处理各种词性相关命令的方法
 */
@Service
@RequiredArgsConstructor
public class PartOfSpeechCommandHandlerImpl implements PartOfSpeechCommandHandler {
    
    private final PartOfSpeechRepository partOfSpeechRepository;
    
    /**
     * 处理创建词性命令
     * @param createCommand 创建词性命令
     * @return 创建的词性实体
     */
    @Override
    public PartOfSpeech handle(CreatePartOfSpeechCommand createCommand) {
        Optional<PartOfSpeech> existPartOfSpeech = partOfSpeechRepository.findByEnglishName(createCommand.getEnglishName());
        if (existPartOfSpeech.isPresent()) {
            throw new RuntimeException("Part of speech already exists");
        }
        PartOfSpeech partOfSpeech = PartOfSpeech.builder().build();
        partOfSpeech.create(createCommand);
        return partOfSpeechRepository.save(partOfSpeech);
    }
    
    /**
     * 处理更新词性命令
     * @param command 更新词性命令
     * @return 更新后的词性实体
     */
    @Override
    public PartOfSpeech handle(UpdatePartOfSpeechCommand command) {
        // 获取实体
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + command.getId()));
        // 执行更新逻辑
        partOfSpeech.update(command);
        // 保存并返回
        return partOfSpeechRepository.save(partOfSpeech);
    }
    
    /**
     * 处理删除词性命令
     * @param command 删除词性命令
     */
    @Override
    public void handle(DeletePartOfSpeechCommand command) {
        command.validate();
        partOfSpeechRepository.deleteById(command.getId());
    }
    
    /**
     * 处理更新词性用法总结命令
     * @param command 更新词性用法总结命令
     * @return 更新后的词性实体
     */
    @Override
    public PartOfSpeech handle(UpdatePartOfSpeechUsageSummaryCommand command) {
        // 验证命令
        command.validate();
        // 获取实体
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + command.getId()));
        // 更新用法总结
        partOfSpeech.updateUsageSummary(command.getUsageSummary());
        // 保存并返回
        return partOfSpeechRepository.save(partOfSpeech);
    }
    
    /**
     * 处理更新词性常用短语命令
     * @param command 更新词性常用短语命令
     * @return 更新后的词性实体
     */
    @Override
    public PartOfSpeech handle(UpdatePartOfSpeechCommonPhrasesCommand command) {
        // 验证命令
        command.validate();
        
        // 获取实体
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + command.getId()));
        
        // 更新常用短语
        partOfSpeech.updateCommonPhrases(command.getCommonPhrases());
        
        // 保存并返回
        return partOfSpeechRepository.save(partOfSpeech);
    }
}