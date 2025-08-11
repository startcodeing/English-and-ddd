package com.englishlearning.infrastructure.db.po;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "grammar_analysis")
@EntityListeners(AuditingEntityListener.class)
public class GrammarAnalysisPo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    private String originContent;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @CreatedDate
    private LocalDateTime createTime;

    @LastModifiedDate
    private LocalDateTime updateTime;
}