import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography, Tag, Divider, Space, message } from 'antd';
import { WordDetail, PartOfSpeech } from '../../../types/models';
import { getPartOfSpeechById } from '../../../api/partOfSpeech';
import './WordDetailView.css';

const { Title, Text } = Typography;

interface WordDetailViewProps {
  wordDetail: WordDetail;
}

const WordDetailView: React.FC<WordDetailViewProps> = ({ wordDetail }) => {
  // 存储词性信息的状态
  const [partOfSpeechMap, setPartOfSpeechMap] = useState<Record<string, PartOfSpeech>>({});
  const [loadingPartOfSpeech, setLoadingPartOfSpeech] = useState<boolean>(false);
  const [partOfSpeechError, setPartOfSpeechError] = useState<boolean>(false);
  
  // 获取难度级别标签颜色
  const getDifficultyColor = (level: number) => {
    const colors = ['#52c41a', '#1890ff', '#faad14', '#f5222d', '#722ed1'];
    return level >= 1 && level <= 5 ? colors[level - 1] : '#1890ff';
  };
  
  // 使用 useMemo 缓存词性名称映射，避免不必要的重新计算
  const partOfSpeechNameMap = useMemo(() => {
    const nameMap: Record<string, string> = {};
    
    if (!loadingPartOfSpeech && !partOfSpeechError) {
      Object.entries(partOfSpeechMap).forEach(([id, pos]) => {
        nameMap[id] = pos.chineseMeaning || pos.englishName || '词性';
      });
    }
    
    return nameMap;
  }, [partOfSpeechMap, loadingPartOfSpeech, partOfSpeechError]);
  
  // 获取词性名称
  const getPartOfSpeechName = (partOfSpeechId: string) => {
    if (loadingPartOfSpeech) {
      return '加载中...';
    }
    
    if (partOfSpeechError) {
      return '词性';
    }
    
    return partOfSpeechNameMap[partOfSpeechId] || '词性';
  };
  
  // 加载词性信息
  useEffect(() => {
    console.log('WordDetailView 组件渲染，单词详情:', wordDetail);
    
    if (!wordDetail) {
      console.error('WordDetailView: 单词详情为空');
      return;
    }
    
    // 收集所有需要获取的词性ID
    const partOfSpeechIds = new Set<string>();
    if (wordDetail.meanings && wordDetail.meanings.length > 0) {
      wordDetail.meanings.forEach(meaning => {
        if (meaning.partOfSpeechId) {
          partOfSpeechIds.add(meaning.partOfSpeechId);
        }
      });
    }
    
    // 获取所有词性信息
      const fetchPartOfSpeech = async () => {
        setLoadingPartOfSpeech(true);
        setPartOfSpeechError(false);
        
        try {
          // 将 Set 转换为数组后使用 Promise.all 并行处理所有请求
          const idArray = Array.from(partOfSpeechIds);
          
          if (idArray.length === 0) {
            setLoadingPartOfSpeech(false);
            return;
          }
          
          const promises = idArray.map(id => 
            getPartOfSpeechById(id)
              .then(response => {
                if (response.data) {
                  return { id, data: response.data.data };
                }
                return null;
              })
              .catch(error => {
                console.error(`获取词性信息失败，ID: ${id}`, error);
                return null;
              })
          );
          
          const results = await Promise.all(promises);
          
          // 构建词性映射对象
          const partOfSpeechData: Record<string, PartOfSpeech> = {};
          let hasValidData = false;
          
          results.forEach(result => {
            if (result && result.data) {
              partOfSpeechData[result.id] = result.data;
              hasValidData = true;
            }
          });
          
          // 更新状态
          setPartOfSpeechMap(partOfSpeechData);
          setPartOfSpeechError(!hasValidData && idArray.length > 0);
        } catch (error) {
          console.error('获取词性信息失败:', error);
          setPartOfSpeechError(true);
        } finally {
          setLoadingPartOfSpeech(false);
        }
      };
    
    if (partOfSpeechIds.size > 0) {
      fetchPartOfSpeech();
    }
  }, [wordDetail]);

  // 检查 wordDetail 是否为空
  if (!wordDetail) {
    console.error('WordDetailView: wordDetail 为 null 或 undefined');
    return (
      <div className="word-detail-view">
        <Card className="word-card" variant="borderless">
          <div className="word-header">
            <Title level={3} className="word-spelling">加载失败</Title>
          </div>
          <Text type="danger">单词详情加载失败，请重试</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="word-detail-view">
      {/* 单词基本信息 */}
      <Card className="word-card" variant="borderless">
        <div className="word-header">
          <Title level={3} className="word-spelling">{wordDetail.spelling || '未知单词'}</Title>
          {wordDetail.phonetic && (
            <Text className="word-phonetic">[{wordDetail.phonetic}]</Text>
          )}
        </div>
        
        {wordDetail.difficultyLevel && (
          <Tag color={getDifficultyColor(wordDetail.difficultyLevel)} className="difficulty-tag">
            难度 {wordDetail.difficultyLevel}
          </Tag>
        )}
      </Card>

      <Divider style={{ margin: '12px 0' }} />

      {/* 单词释义列表 */}
      <div className="meanings-container">
        <Title level={4} className="section-title">词义</Title>
        
        {wordDetail.meanings && wordDetail.meanings.length > 0 ? (
          wordDetail.meanings.map((meaning, index) => (
            <Card key={meaning.id || index} className="meaning-card" variant="borderless">
              <div className="meaning-header">
                <Tag color="blue" title={process.env.NODE_ENV === 'development' ? `ID: ${meaning.partOfSpeechId}` : undefined}>
                  {getPartOfSpeechName(meaning.partOfSpeechId)}
                </Tag>
                <Text strong>{meaning.chineseMeaning || '暂无中文释义'}</Text>
              </div>
              
              {/* 例句 */}
              {meaning.exampleSentences && meaning.exampleSentences.length > 0 && (
                <div className="example-sentences">
                  <Text strong>例句：</Text>
                  {meaning.exampleSentences.map((sentence, idx) => (
                    <div key={idx} className="example-sentence">
                      <Text>{sentence.englishContent || ''}</Text>
                      <br />
                      <Text type="secondary">{sentence.chineseMeaning || ''}</Text>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 同义词 */}
              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <div className="synonyms">
                  <Text strong>同义词：</Text>
                  <Space size={[0, 8]} wrap>
                    {meaning.synonyms.map((synonym, idx) => (
                      <Tag key={idx} color="green">{synonym.synonymSpell || ''}</Tag>
                    ))}
                  </Space>
                </div>
              )}
              
              {/* 反义词 */}
              {meaning.antonyms && meaning.antonyms.length > 0 && (
                <div className="antonyms">
                  <Text strong>反义词：</Text>
                  <Space size={[0, 8]} wrap>
                    {meaning.antonyms.map((antonym, idx) => (
                      <Tag key={idx} color="volcano">{antonym.antonymSpell || ''}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>
          ))
        ) : (
          <Text>暂无词义信息</Text>
        )}
      </div>
    </div>
  );
};

export default WordDetailView;