package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.command.CreatePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.model.valueobject.CommonPhrases;
import com.englishlearning.domain.vocabulary.model.valueobject.UsageSummary;
import lombok.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 词性实体
 */
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Component
public class PartOfSpeech {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 英文名称
     */
    private String englishName;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 用法总结
     */
    private UsageSummary usageSummary;
    
    /**
     * 常用短语/搭配
     */
    private CommonPhrases commonPhrases;

    
    /**
     * 创建新的词性
     */
    public void create(CreatePartOfSpeechCommand createCommand) {
        createCommand.validate();
        this.englishName = createCommand.getEnglishName();
        this.chineseMeaning = createCommand.getChineseMeaning();
        this.usageSummary = UsageSummary.of(createCommand.getUsageSummary());
        this.commonPhrases = CommonPhrases.of(createCommand.getCommonPhrases());
    }
    
    /**
     * 使用现有ID创建词性（用于从存储中重建实体）
     */
    public static PartOfSpeech reconstitute(String id, String englishName, String chineseMeaning,
                                           String usageSummary, List<String> commonPhrases) {
        return new PartOfSpeech(
                id,
                englishName,
                chineseMeaning,
                UsageSummary.of(usageSummary),
                CommonPhrases.of(commonPhrases)
        );
    }
    
    /**
     * 更新词性信息
     */
    public void update(UpdatePartOfSpeechCommand updateCommand) {
        updateCommand.validate();
        this.id = updateCommand.getId();
        this.englishName = updateCommand.getEnglishName();
        this.chineseMeaning = updateCommand.getChineseMeaning();
        this.usageSummary = UsageSummary.of(updateCommand.getUsageSummary());
        this.commonPhrases = CommonPhrases.of(updateCommand.getCommonPhrases());
    }
    
    /**
     * 更新用法总结
     */
    public void updateUsageSummary(String usageSummary) {
        this.usageSummary = this.usageSummary.update(usageSummary);
    }
    
    /**
     * 添加常用短语
     */
    public void addCommonPhrase(String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            return;
        }
        this.commonPhrases = this.commonPhrases.addPhrase(phrase);
    }
    
    /**
     * 移除常用短语
     */
    public void removeCommonPhrase(String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            return;
        }
        this.commonPhrases = this.commonPhrases.removePhrase(phrase);
    }
    
    /**
     * 更新常用短语列表
     */
    public void updateCommonPhrases(List<String> phrases) {
        this.commonPhrases = this.commonPhrases.update(phrases);
    }
    
    /**
     * 获取常用短语列表
     */
    public List<String> getCommonPhrasesList() {
        return this.commonPhrases.getPhrases();
    }
    
    /**
     * 获取用法总结内容
     */
    public String getUsageSummaryContent() {
        return this.usageSummary.getContent();
    }

}