package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.dto.CreatePartOfSpeechDTO;
import com.englishlearning.domain.vocabulary.dto.UpdatePartOfSpeechDTO;
import com.englishlearning.domain.vocabulary.model.valueobject.CommonPhrases;
import com.englishlearning.domain.vocabulary.model.valueobject.UsageSummary;
import lombok.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 词性实体
 */
@Data
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
    public void create(CreatePartOfSpeechDTO createDto) {
        this.englishName = createDto.getEnglishName();
        this.chineseMeaning = createDto.getChineseMeaning();
        this.usageSummary = UsageSummary.of(createDto.getUsageSummary());
        this.commonPhrases = CommonPhrases.of(createDto.getCommonPhrases());
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
    public void update(UpdatePartOfSpeechDTO updateDto) {
        this.id = updateDto.getId();
        this.englishName = updateDto.getEnglishName();
        this.chineseMeaning = updateDto.getChineseMeaning();
        this.usageSummary = UsageSummary.of(updateDto.getUsageSummary());
        this.commonPhrases = CommonPhrases.of(updateDto.getCommonPhrases());
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