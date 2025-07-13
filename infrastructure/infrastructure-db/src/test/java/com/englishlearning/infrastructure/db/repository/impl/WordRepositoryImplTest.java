package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.infrastructure.db.repository.jpa.WordBookWordJpaRepository;
import com.englishlearning.infrastructure.db.repository.jpa.WordJpaRepository;
import com.englishlearning.infrastructure.db.repository.jpa.WordMeaningJpaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class WordRepositoryImplTest {

    @Mock
    private WordJpaRepository wordJpaRepository;

    @Mock
    private WordMeaningJpaRepository wordMeaningJpaRepository;

    @Mock
    private WordBookWordJpaRepository wordBookWordJpaRepository;

    @InjectMocks
    private WordRepositoryImpl wordRepository;

    @Test
    public void testDeleteById_ShouldDeleteWordBookWordRelationFirst() {
        // Given
        String wordId = "test-word-id";

        // When
        wordRepository.deleteById(wordId);

        // Then
        verify(wordBookWordJpaRepository).deleteByWordId(wordId);
        verify(wordJpaRepository).deleteById(wordId);
    }
}