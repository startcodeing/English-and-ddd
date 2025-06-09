package com.englishlearning.domain.vocabulary.model.valueobject;

import lombok.Builder;
import lombok.Value;

import java.util.Objects;

@Value
@Builder
public class AntonymInfo {

    /**
     * 反义词单词ID
     */
    String antonymWordId;

    /**
     * 反义词词义ID
     */
    String antonymMeaningId;

    /**
     * 构造函数
     */
    public AntonymInfo(String antonymWordId, String antonymMeaningId) {
        this.antonymWordId = Objects.requireNonNull(antonymWordId, "antonymWordId不能为空");
        this.antonymMeaningId = Objects.requireNonNull(antonymMeaningId, "antonymMeaningId不能为空");
    }

    /**
     * 验证反义词信息的有效性
     */
    public boolean isValid() {
        return antonymWordId != null && !antonymWordId.trim().isEmpty() &&
                antonymMeaningId != null && !antonymMeaningId.trim().isEmpty();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AntonymInfo that = (AntonymInfo) o;
        return Objects.equals(antonymWordId, that.antonymWordId) && Objects.equals(antonymMeaningId, that.antonymMeaningId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(antonymWordId, antonymMeaningId);
    }
}
