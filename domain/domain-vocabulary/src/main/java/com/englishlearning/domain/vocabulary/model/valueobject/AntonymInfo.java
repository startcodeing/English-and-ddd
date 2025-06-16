package com.englishlearning.domain.vocabulary.model.valueobject;

import lombok.*;

import java.util.Objects;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AntonymInfo {

    /**
     * 反义词单词ID
     */
    String antonymWordId;

    /**
     * 反义词词义ID
     */
    String antonymMeaningId;


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
