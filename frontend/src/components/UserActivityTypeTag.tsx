import React from 'react';
import { Tag } from 'antd';

interface UserActivityTypeTagProps {
  activityType: string;
  className?: string;
}

/**
 * 用户活动类型标签组件
 * 根据活动类型显示不同颜色和文本的标签
 */
const UserActivityTypeTag: React.FC<UserActivityTypeTagProps> = ({ activityType, className }) => {
  // 根据活动类型获取标签颜色
  const getTagColor = (): string => {
    if (activityType.includes('CREATED')) {
      return 'success';
    } else if (activityType.includes('UPDATED')) {
      return 'processing';
    } else if (activityType.includes('DELETED')) {
      return 'error';
    } else if (activityType.includes('ADDED')) {
      return 'warning';
    }
    return 'default';
  };

  // 根据活动类型获取标签文本
  const getTagText = (): string => {
    if (activityType.includes('WORD_CREATED')) {
      return '创建单词';
    } else if (activityType.includes('WORD_UPDATED')) {
      return '更新单词';
    } else if (activityType.includes('WORD_DELETED')) {
      return '删除单词';
    } else if (activityType.includes('WORD_MEANING_ADDED')) {
      return '添加释义';
    } else if (activityType.includes('SENTENCE_CREATED')) {
      return '创建句子';
    } else if (activityType.includes('SENTENCE_UPDATED')) {
      return '更新句子';
    } else if (activityType.includes('SENTENCE_DELETED')) {
      return '删除句子';
    } else if (activityType.includes('ARTICLE_CREATED')) {
      return '创建文章';
    } else if (activityType.includes('ARTICLE_UPDATED')) {
      return '更新文章';
    } else if (activityType.includes('ARTICLE_DELETED')) {
      return '删除文章';
    }
    return '活动';
  };

  return (
    <Tag color={getTagColor()} className={className}>
      {getTagText()}
    </Tag>
  );
};

export default UserActivityTypeTag;