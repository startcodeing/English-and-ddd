package com.englishlearning.domain.content.service;

import com.englishlearning.common.types.Result;
import com.englishlearning.domain.content.model.Article;

public interface ArticleService {
    Result<Article> createArticle(Article article);
    Result<Article> updateArticle(Article article);
    Result<Void> deleteArticle(String articleId);
} 