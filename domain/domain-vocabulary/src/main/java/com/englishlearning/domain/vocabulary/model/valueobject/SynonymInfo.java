package com.englishlearning.domain.vocabulary.model.valueobject;

import lombok.Builder;
import lombok.Value;

import java.util.Objects;

@Builder
@Value
public class SynonymInfo {

    /**
     * 同义词单词ID
     */
    String synonymWordId;

    /**
     * 同义词词义ID
     */
    String synonymMeaningId;

    /**
     * 构造函数
     */
    public SynonymInfo(String synonymWordId, String synonymMeaningId) {
        this.synonymWordId = Objects.requireNonNull(synonymWordId, "synonymWordId不能为空");
        this.synonymMeaningId = Objects.requireNonNull(synonymMeaningId, "synonymMeaningId不能为空");
    }

    /**
     * 验证同义词信息的有效性
     */
    public boolean isValid() {
        return synonymWordId != null && !synonymWordId.trim().isEmpty() &&
                synonymMeaningId != null && !synonymMeaningId.trim().isEmpty();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SynonymInfo that = (SynonymInfo) o;
        return Objects.equals(synonymWordId, that.synonymWordId) && Objects.equals(synonymMeaningId, that.synonymMeaningId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(synonymWordId, synonymMeaningId);
    }
}
