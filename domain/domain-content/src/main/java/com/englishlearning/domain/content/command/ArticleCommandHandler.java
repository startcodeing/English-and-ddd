package com.englishlearning.domain.content.command;

import com.englishlearning.domain.content.model.entity.Article;

/**
 * 文章命令处理器接口
 */
public interface ArticleCommandHandler {
    
    /**
     * 处理创建文章命令
     * @param command 创建文章命令
     * @return 创建的文章实体
     */
    Article handle(CreateArticleCommand command);
    
    /**
     * 处理更新文章命令
     * @param command 更新文章命令
     * @return 更新后的文章实体
     */
    Article handle(UpdateArticleCommand command);
    
    /**
     * 处理删除文章命令
     * @param command 删除文章命令
     */
    void handle(DeleteArticleCommand command);
    
    /**
     * 处理添加句子到文章命令
     * @param articleId 文章ID
     * @param sentenceId 句子ID
     * @return 更新后的文章实体
     */
    Article addSentenceToArticle(String articleId, String sentenceId);
    
    /**
     * 处理从文章移除句子命令
     * @param articleId 文章ID
     * @param sentenceId 句子ID
     * @return 更新后的文章实体
     */
    Article removeSentenceFromArticle(String articleId, String sentenceId);
    
    /**
     * 处理添加陌生单词到文章命令
     * @param articleId 文章ID
     * @param wordId 单词ID
     * @return 更新后的文章实体
     */
    Article addWordToArticle(String articleId, String wordId);
    
    /**
     * 处理从文章移除陌生单词命令
     * @param articleId 文章ID
     * @param wordId 单词ID
     * @return 更新后的文章实体
     */
    Article removeWordFromArticle(String articleId, String wordId);
}