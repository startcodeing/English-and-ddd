import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Form, message, Space, Card, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getWordDetail, createWord, updateWord, addWordMeaning, getAllWords } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, WordMeaning, WordDetail as WordDetailType, PartOfSpeech, SynonymInfo, AntonymInfo } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { DifficultyLevel } from '../../../types';
import './WordDetail.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// 同义词/反义词选择组件
interface WordMeaningSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  allWords: Word[];
  partsOfSpeech: PartOfSpeech[];
}

const WordMeaningSelect: React.FC<WordMeaningSelectProps> = ({ 
  value = [], 
  onChange, 
  placeholder, 
  allWords, 
  partsOfSpeech 
}) => {
  const getPartOfSpeechName = (partOfSpeechId: string) => {
    const pos = partsOfSpeech.find(p => p.id === partOfSpeechId);
    return pos ? `${pos.englishName}` : partOfSpeechId;
  };
  
  // 构建所有可选项
  const options = allWords.flatMap(word => 
    word.meanings?.map(meaning => ({
      value: `${word.spelling}-${getPartOfSpeechName(meaning.partOfSpeechId)}`,
      label: `${word.spelling} (${getPartOfSpeechName(meaning.partOfSpeechId)}) - ${meaning.chineseMeaning}`,
      word: word.spelling,
      partOfSpeech: getPartOfSpeechName(meaning.partOfSpeechId)
    })) || []
  );
  
  const handleChange = (selectedValues: string[]) => {
    onChange?.(selectedValues);
  };
  
  return (
    <Select
      mode="multiple"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      showSearch
      filterOption={(input, option) =>
        option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
      }
      style={{ width: '100%' }}
      maxTagCount={3}
      maxTagTextLength={20}
    >
      {options.map((option, index) => (
        <Option key={`${option.value}-${index}`} value={option.value} label={option.label}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

interface WordDetailProps {
  mode: 'create' | 'edit';
}

const WordDetail: React.FC<WordDetailProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 状态定义
  const [word, setWord] = useState<Word | null>(null);
  const [wordDetail, setWordDetail] = useState<WordDetailType | null>(null);
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingMeaningId, setEditingMeaningId] = useState<string | null>(null);
  const [showNewMeaning, setShowNewMeaning] = useState<boolean>(false);
  const [newMeaningForm] = Form.useForm();
  const [editMeaningForm] = Form.useForm();

  // 辅助函数：根据词性ID获取词性名称
  const getPartOfSpeechNameById = (partOfSpeechId: string): string => {
    const pos = partsOfSpeech.find(p => p.id === partOfSpeechId);
    return pos ? pos.englishName : '';
  };

  // 辅助函数：获取同义词的含义
  const getSynonymMeaning = (wordId: string, meaningId: string): string => {
    const targetWord = allWords.find(w => w.id === wordId);
    if (!targetWord) return '';
    const targetMeaning = targetWord.meanings?.find(m => m.id === meaningId);
    return targetMeaning ? targetMeaning.chineseMeaning : '';
  };

  // 辅助函数：获取反义词的含义
  const getAntonymMeaning = (wordId: string, meaningId: string): string => {
    const targetWord = allWords.find(w => w.id === wordId);
    if (!targetWord) return '';
    const targetMeaning = targetWord.meanings?.find(m => m.id === meaningId);
    return targetMeaning ? targetMeaning.chineseMeaning : '';
  };

  // 获取词性列表
  const fetchPartsOfSpeech = async () => {
    try {
      const response = await getAllPartOfSpeech();
      setPartsOfSpeech(response.data);
    } catch (error) {
      message.error('获取词性列表失败');
      console.error('获取词性列表失败:', error);
    }
  };

  // 获取所有单词
  const fetchAllWords = async () => {
    try {
      const response = await getAllWords();
      setAllWords(response.data);
    } catch (error) {
      message.error('获取单词列表失败');
      console.error('获取单词列表失败:', error);
    }
  };

  // 获取单词详情
  const fetchWordDetail = async () => {
    if (mode === 'create') return;
    
    if (!id) {
      message.error('单词ID不存在');
      navigate('/vocabulary/detail/word');
      return;
    }

    setLoading(true);
    try {
      // 获取详细单词信息（包含完整的同义词、反义词、例句以及基本信息）
      const detailResponse = await getWordDetail(id);
      
      // 将后端返回的数据映射为前端期望的WordDetail格式
      const mappedWordDetail: WordDetailType = {
        id: detailResponse.data.id,
        spelling: detailResponse.data.spelling,
        phonetic: detailResponse.data.phonetic,
        difficultyLevel: detailResponse.data.difficultyLevel,
        meanings: detailResponse.data.meanings.map((meaning: any) => ({
          id: meaning.id,
          partOfSpeech: meaning.partOfSpeechId,
          chineseMeaning: meaning.chineseMeaning,
          synonyms: meaning.synonyms?.map((s: any) => ({
            id: s.synonymWordId,
            word: s.synonymSpell,
            partOfSpeech: getPartOfSpeechNameById(s.synonymPartOfSpeechId) || '未知',
            meaning: s.synonymMeaning || '暂无释义'
          })) || [],
          antonyms: meaning.antonyms?.map((a: any) => ({
            id: a.antonymWordId,
            word: a.antonymSpell,
            partOfSpeech: getPartOfSpeechNameById(a.antonymPartOfSpeechId) || '未知',
            meaning: a.antonymMeaning || '暂无释义'
          })) || [],
          exampleSentences: meaning.exampleSentences?.map((e: any) => ({
            id: e.id,
            englishSentence: e.englishContent,
            chineseSentence: e.chineseMeaning
          })) || []
        }))
      };
      setWordDetail(mappedWordDetail);
      
      // 从详细信息中提取基本信息设置到word状态和表单
      const basicWordInfo: Word = {
        id: detailResponse.data.id,
        spelling: detailResponse.data.spelling,
        phonetic: detailResponse.data.phonetic,
        difficultyLevel: detailResponse.data.difficultyLevel,
        meanings: detailResponse.data.meanings.map((meaning: any) => ({
          id: meaning.id,
          wordId: detailResponse.data.id,
          partOfSpeechId: meaning.partOfSpeechId,
          chineseMeaning: meaning.chineseMeaning,
          synonyms: meaning.synonyms?.map((s: any) => ({
             id: s.synonymWordId,
             meaningId: meaning.id,
             synonymWordId: s.synonymWordId
           })) || [],
           antonyms: meaning.antonyms?.map((a: any) => ({
             id: a.antonymWordId,
             meaningId: meaning.id,
             antonymWordId: a.antonymWordId
           })) || [],
           exampleSentences: meaning.exampleSentenceIds?.map((e: any) => ({
             id: e.id,
             meaningId: meaning.id,
             englishSentence: e.englishContent,
             chineseSentence: e.chineseMeaning
           })) || []
        }))
      };
      setWord(basicWordInfo);
      
      // 设置基本信息表单
      form.setFieldsValue({
        spelling: detailResponse.data.spelling,
        phonetic: detailResponse.data.phonetic,
        difficultyLevel: detailResponse.data.difficultyLevel
      });
    } catch (error) {
      message.error('获取单词详情失败');
      console.error('获取单词详情失败:', error);
      navigate('/vocabulary/word');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartsOfSpeech();
    fetchAllWords();
    fetchWordDetail();
  }, [id, mode]);

  // 保存基本信息
  const handleSaveBasicInfo = async () => {
    try {
      const values = await form.validateFields();
      
      const wordData = {
        spelling: values.spelling,
        phonetic: values.phonetic,
        difficultyLevel: values.difficultyLevel,
        meanings: word?.meanings || []
      };

      if (mode === 'create') {
        const response = await createWord(wordData);
        setWord(response.data);
        message.success('单词创建成功');
        navigate(`/vocabulary/word/edit/${response.data.id}`);
      } else if (word) {
        const response = await updateWord(word.id, wordData);
        setWord(response.data);
        message.success('基本信息保存成功');
      }
    } catch (error) {
      message.error('保存失败');
      console.error('保存失败:', error);
    }
  };

  // 从选择的值中提取同义词信息
  const extractSynonymInfos = (selectedValues: string[]): SynonymInfo[] => {
    return selectedValues.map(value => {
      // 解析格式: "单词-词性"
      const [wordSpelling, partOfSpeechName] = value.split('-');
      
      // 找到对应的单词和词性
      const targetWord = allWords.find(w => w.spelling === wordSpelling);
      if (!targetWord) return null;
      
      const targetMeaning = targetWord.meanings?.find(m => {
        const pos = partsOfSpeech.find(p => p.id === m.partOfSpeechId);
        return pos?.englishName === partOfSpeechName;
      });
      
      return targetMeaning ? {
        synonymWordId: targetWord.id,
        synonymMeaningId: targetMeaning.id
      } : null;
    }).filter((info): info is SynonymInfo => info !== null);
  };

  // 从选择的值中提取反义词信息
  const extractAntonymInfos = (selectedValues: string[]): AntonymInfo[] => {
    return selectedValues.map(value => {
      // 解析格式: "单词-词性"
      const [wordSpelling, partOfSpeechName] = value.split('-');
      
      // 找到对应的单词和词性
      const targetWord = allWords.find(w => w.spelling === wordSpelling);
      if (!targetWord) return null;
      
      const targetMeaning = targetWord.meanings?.find(m => {
        const pos = partsOfSpeech.find(p => p.id === m.partOfSpeechId);
        return pos?.englishName === partOfSpeechName;
      });
      
      return targetMeaning ? {
        antonymWordId: targetWord.id,
        antonymMeaningId: targetMeaning.id
      } : null;
    }).filter((info): info is AntonymInfo => info !== null);
  };

  // 添加新词性
  const handleAddMeaning = async () => {
    try {
      const values = await newMeaningForm.validateFields();
      
      if (!word) {
        message.error('请先保存基本信息');
        return;
      }

      // 提取同义词和反义词信息
      const synonymWordMeaningIds = values.synonyms ? extractSynonymInfos(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractAntonymInfos(values.antonyms) : [];

      const newMeaning: Omit<WordMeaning, 'id'> = {
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        exampleSentences: values.exampleSentences ? [
          {
            id: '',
            meaningId: '',
            englishSentence: values.exampleSentences,
            chineseSentence: values.chineseTranslation || ''
          }
        ] : [],
        sentences: values.exampleSentences ? [
          {
            englishContent: values.exampleSentences,
            chineseMeaning: values.chineseTranslation || ''
          }
        ] : [],
        synonyms: values.synonyms ? values.synonyms.split(',').map((syn: string) => ({
          id: '',
          meaningId: '',
          synonymWordId: '',
          synonymWord: { id: '', spelling: syn.trim(), meanings: [] }
        })) : [],
        antonyms: values.antonyms ? values.antonyms.split(',').map((ant: string) => ({
          id: '',
          meaningId: '',
          antonymWordId: '',
          antonymWord: { id: '', spelling: ant.trim(), meanings: [] }
        })) : []
      };

      const response = await addWordMeaning(newMeaning);
      setWord(response.data);
      setShowNewMeaning(false);
      newMeaningForm.resetFields();
      message.success('词性添加成功');
    } catch (error) {
      message.error('添加词性失败');
      console.error('添加词性失败:', error);
    }
  };

  // 编辑词性
  const handleEditMeaning = (meaning: WordMeaning) => {
    setEditingMeaningId(meaning.id);
    editMeaningForm.setFieldsValue({
      partOfSpeechId: meaning.partOfSpeechId,
      chineseMeaning: meaning.chineseMeaning,
      exampleSentences: meaning.exampleSentences?.[0]?.englishSentence || '',
      chineseTranslation: meaning.exampleSentences?.[0]?.chineseSentence || '',
      synonyms: meaning.synonyms?.map(s => s.synonymWord?.spelling).join(', ') || '',
      antonyms: meaning.antonyms?.map(a => a.antonymWord?.spelling).join(', ') || ''
    });
  };

  // 保存编辑的词性
  const handleSaveEditMeaning = async () => {
    try {
      const values = await editMeaningForm.validateFields();
      
      if (!word || !editingMeaningId) return;

      // 提取同义词和反义词的词性ID
      const synonymWordMeaningIds = values.synonyms ? extractSynonymInfos(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractAntonymInfos(values.antonyms) : [];

      const meaningToUpdate: Omit<WordMeaning, 'createdAt' | 'updatedAt'> = {
        id: editingMeaningId,
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        exampleSentences: values.exampleSentences ? [
          {
            id: '',
            meaningId: editingMeaningId,
            englishSentence: values.exampleSentences,
            chineseSentence: values.chineseTranslation || ''
          }
        ] : [],
        sentences: values.exampleSentences ? [
          {
            englishContent: values.exampleSentences,
            chineseMeaning: values.chineseTranslation || ''
          }
        ] : [],
        synonyms: values.synonyms ? values.synonyms.split(',').map((syn: string) => ({
          id: '',
          meaningId: editingMeaningId,
          synonymWordId: '',
          synonymWord: { id: '', spelling: syn.trim(), meanings: [] }
        })) : [],
        antonyms: values.antonyms ? values.antonyms.split(',').map((ant: string) => ({
          id: '',
          meaningId: editingMeaningId,
          antonymWordId: '',
          antonymWord: { id: '', spelling: ant.trim(), meanings: [] }
        })) : []
      };

      const response = await addWordMeaning(meaningToUpdate);
      setWord(response.data);
      setEditingMeaningId(null);
      message.success('词性更新成功');
    } catch (error) {
      message.error('更新词性失败');
      console.error('更新词性失败:', error);
    }
  };

  // 删除词性
  const handleDeleteMeaning = async (meaningId: string) => {
    if (!word) return;
    
    const updatedMeanings = word.meanings.filter(meaning => meaning.id !== meaningId);
    const updatedWord = { ...word, meanings: updatedMeanings };
    
    try {
      const response = await updateWord(word.id, updatedWord);
      setWord(response.data);
      message.success('词性删除成功');
    } catch (error) {
      message.error('删除词性失败');
      console.error('删除词性失败:', error);
    }
  };

  // 获取词性显示名称
  const getPartOfSpeechName = (partOfSpeechId: string) => {
    const pos = partsOfSpeech.find(p => p.id === partOfSpeechId);
    return pos ? `${pos.englishName} (${pos.chineseMeaning})` : '未知词性';
  };

  // 点击词性拼写显示详情
  const handlePartOfSpeechClick = (partOfSpeechId: string) => {
    const pos = partsOfSpeech.find(p => p.id === partOfSpeechId);
    if (pos) {
      message.info(`词性详情: ${pos.englishName} - ${pos.chineseMeaning}${pos.usageSummary ? '\n用法: ' + pos.usageSummary : ''}`);
    }
  };

  return (
    <div className="word-detail-container">
      <div className="word-detail-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/vocabulary/word')}
        >
          返回单词列表
        </Button>
        <Title level={2}>{mode === 'create' ? '添加单词' : '单词详情'}</Title>
      </div>

      {/* 基本信息 */}
      <Card className="basic-info-card" title="基本信息">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }}>
          <div className="word-info-row">
            <Form.Item
              name="spelling"
              label="拼写"
              rules={[{ required: true, message: '请输入单词拼写' }]}
              className="word-info-field"
            >
              <Input placeholder="请输入单词拼写" />
            </Form.Item>
            
            <Form.Item
              name="phonetic"
              label="音标"
              rules={[{ required: true, message: '请输入音标' }]}
              className="word-info-field"
            >
              <Input placeholder="如: /ˈhæpi/" />
            </Form.Item>
            
            <Form.Item
              name="difficultyLevel"
              label="难度"
              rules={[{ required: true, message: '请选择难度' }]}
              className="word-info-field"
            >
              <Select placeholder="请选择难度">
                {difficultyLevelConfigs.map(config => (
                  <Option key={config.value} value={config.value}>
                    <span style={{ color: config.color }}>{config.label}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
        
        <div className="basic-info-actions">
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSaveBasicInfo}
            loading={loading}
          >
            保存基本信息
          </Button>
        </div>
      </Card>

      {/* 词义信息 */}
      <div className="meanings-section">
        <div className="section-title">词义信息</div>
        
        {word?.meanings.map((meaning) => (
          <Card key={meaning.id} className={`pos-card ${editingMeaningId === meaning.id ? 'editing' : ''}`}>
            <div className="pos-header">
              <Title level={4} className="pos-title">
                <span 
                  className="pos-name-clickable"
                  onClick={() => handlePartOfSpeechClick(meaning.partOfSpeechId)}
                >
                  {getPartOfSpeechName(meaning.partOfSpeechId)}
                </span>
              </Title>
              <Space>
                {editingMeaningId === meaning.id ? (
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<SaveOutlined />}
                    onClick={handleSaveEditMeaning}
                  >
                    保存
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<EditOutlined />}
                      onClick={() => handleEditMeaning(meaning)}
                    >
                      编辑
                    </Button>
                    <Button 
                      type="link" 
                      size="small" 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteMeaning(meaning.id)}
                    >
                      删除
                    </Button>
                  </>
                )}
              </Space>
            </div>
            
            {editingMeaningId === meaning.id ? (
              <Form form={editMeaningForm} layout="vertical">
                <Form.Item name="partOfSpeechId" label="词性" rules={[{ required: true }]}>
                  <Select placeholder="请选择词性">
                    {partsOfSpeech.map(pos => (
                      <Option key={pos.id} value={pos.id}>
                        {pos.englishName} ({pos.chineseMeaning})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item name="chineseMeaning" label="中文含义" rules={[{ required: true }]}>
                  <Input placeholder="请输入中文释义" />
                </Form.Item>
                
                <Form.Item name="synonyms" label="近义词">
                  <WordMeaningSelect 
                    allWords={allWords} 
                    partsOfSpeech={partsOfSpeech}
                    placeholder="选择近义词"
                  />
                </Form.Item>
                
                <Form.Item name="antonyms" label="反义词">
                  <WordMeaningSelect 
                    allWords={allWords} 
                    partsOfSpeech={partsOfSpeech}
                    placeholder="选择反义词"
                  />
                </Form.Item>
                
                <Form.Item name="exampleSentences" label="例句">
                  <TextArea rows={3} placeholder="请输入例句" />
                </Form.Item>
                
                <Form.Item name="chineseTranslation" label="例句翻译">
                  <TextArea rows={2} placeholder="请输入例句翻译" />
                </Form.Item>
              </Form>
            ) : (
              <div className="pos-content">
                <div className="field">
                  <Text strong>中文含义：</Text>
                  <Text>{meaning.chineseMeaning}</Text>
                </div>
                
                {/* 使用详细数据显示同义词 */}
                {(() => {
                  const detailMeaning = wordDetail?.meanings.find(dm => dm.id === meaning.id);
                  return detailMeaning?.synonyms && detailMeaning.synonyms.length > 0 && (
                    <div className="field">
                      <Text strong>近义词：</Text>
                      <div className="synonym-list">
                        {detailMeaning.synonyms.map((synonym, index) => (
                          <div key={index} className="synonym-item">
                            <Tag color="blue" className="word-tag">{synonym.word}</Tag>
                            <Tag color="geekblue" className="pos-tag">{synonym.partOfSpeech}</Tag>
                            <span className="meaning-text">{synonym.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                
                {/* 使用详细数据显示反义词 */}
                {(() => {
                  const detailMeaning = wordDetail?.meanings.find(dm => dm.id === meaning.id);
                  return detailMeaning?.antonyms && detailMeaning.antonyms.length > 0 && (
                    <div className="field">
                      <Text strong>反义词：</Text>
                      <div className="antonym-list">
                        {detailMeaning.antonyms.map((antonym, index) => (
                          <div key={index} className="antonym-item">
                            <Tag color="red" className="word-tag">{antonym.word}</Tag>
                            <Tag color="volcano" className="pos-tag">{antonym.partOfSpeech}</Tag>
                            <span className="meaning-text">{antonym.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                
                {/* 使用详细数据显示例句 */}
                {(() => {
                  const detailMeaning = wordDetail?.meanings.find(dm => dm.id === meaning.id);
                  return detailMeaning?.exampleSentences && detailMeaning.exampleSentences.length > 0 && (
                    <div className="field">
                      <Text strong>例句：</Text>
                      <div className="sentence-list">
                        {detailMeaning.exampleSentences.map((sentence, index) => (
                          <div key={index} className="sentence-item">
                            <div className="english-sentence">
                              <Text className="sentence-text">{sentence.englishSentence}</Text>
                            </div>
                            {sentence.chineseSentence && (
                              <div className="chinese-sentence">
                                <Text type="secondary" className="translation-text">{sentence.chineseSentence}</Text>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </Card>
        ))}
        
        {/* 新增词性表单 */}
        {showNewMeaning && (
          <Card className="pos-card new">
            <div className="pos-header">
              <Title level={4}>新增词性</Title>
              <Button 
                type="primary" 
                size="small" 
                icon={<SaveOutlined />}
                onClick={handleAddMeaning}
              >
                保存
              </Button>
            </div>
            
            <Form form={newMeaningForm} layout="vertical">
              <Form.Item name="partOfSpeechId" label="词性" rules={[{ required: true }]}>
                <Select placeholder="请选择词性">
                  {partsOfSpeech.map(pos => (
                    <Option key={pos.id} value={pos.id}>
                      {pos.englishName} ({pos.chineseMeaning})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item name="chineseMeaning" label="中文含义" rules={[{ required: true }]}>
                <Input placeholder="请输入中文释义" />
              </Form.Item>
              
              <Form.Item name="synonyms" label="近义词">
                <WordMeaningSelect 
                  allWords={allWords} 
                  partsOfSpeech={partsOfSpeech}
                  placeholder="选择近义词"
                />
              </Form.Item>
              
              <Form.Item name="antonyms" label="反义词">
                <WordMeaningSelect 
                  allWords={allWords} 
                  partsOfSpeech={partsOfSpeech}
                  placeholder="选择反义词"
                />
              </Form.Item>
              
              <Form.Item name="exampleSentences" label="例句">
                <TextArea rows={3} placeholder="请输入例句" />
              </Form.Item>
              
              <Form.Item name="chineseTranslation" label="例句翻译">
                <TextArea rows={2} placeholder="请输入例句翻译" />
              </Form.Item>
            </Form>
          </Card>
        )}
        
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={() => setShowNewMeaning(true)}
          className="add-meaning-btn"
          disabled={!word || showNewMeaning}
        >
          添加新词性
        </Button>
      </div>
    </div>
  );
};

export default WordDetail;