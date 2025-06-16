package com.englishlearning.domain.vocabulary.model.valueobject;

import lombok.*;

import java.util.Objects;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SynonymInfo {

    /**
     * 同义词单词ID
     */
    String synonymWordId;

    /**
     * 同义词词义ID
     */
    String synonymMeaningId;


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
