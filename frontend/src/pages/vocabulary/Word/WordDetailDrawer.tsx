import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Form, message, Space, Card, Tag, Typography, Drawer, Tabs } from 'antd';
import { SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getWordById, createWord, updateWord, deleteWordMeaning, addWordMeaning, getAllWords } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, WordMeaning, PartOfSpeech } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { DifficultyLevel } from '../../../types';
import './WordDetailDrawer.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// 新词义Tab页内容组件
interface NewMeaningTabContentProps {
  tabKey: string;
  partsOfSpeech: PartOfSpeech[];
  allWords: Word[];
  onSave: (tabKey: string, form: any) => void;
  onCancel: (tabKey: string) => void;
  isReadOnly: boolean;
}

const NewMeaningTabContent: React.FC<NewMeaningTabContentProps> = ({
  tabKey,
  partsOfSpeech,
  allWords,
  onSave,
  onCancel,
  isReadOnly
}) => {
  const [form] = Form.useForm();

  console.log('NewMeaningTabContent渲染:', { tabKey, partsOfSpeechCount: partsOfSpeech.length, allWordsCount: allWords.length });

  return (
    <div style={{ padding: '20px', minHeight: '400px' }}>
      <Card 
        title="添加新词性" 
        className="new-meaning-card"
        size="default"
        style={{ marginBottom: '16px' }}
        extra={
          <Space>
            <Button onClick={() => onSave(tabKey, form)} type="primary" size="large">保存</Button>
            <Button onClick={() => {
              onCancel(tabKey);
              form.resetFields();
            }} size="large">取消</Button>
          </Space>
        }
      >
        <Form 
          form={form} 
          layout="vertical" 
          style={{ marginTop: '20px' }}
          size="large"
        >
          <Form.Item
            name="partOfSpeechId"
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>词性</span>}
            rules={[{ required: true, message: '请选择词性' }]}
            style={{ marginBottom: '24px' }}
          >
            <Select 
              placeholder="请选择词性" 
              style={{ width: '100%', height: '40px' }}
              size="large"
            >
              {partsOfSpeech.map(pos => (
                <Option key={pos.id} value={pos.id}>{pos.englishName}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="chineseMeaning"
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>中文释义</span>}
            rules={[{ required: true, message: '请输入中文释义' }]}
            style={{ marginBottom: '24px' }}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入中文释义" 
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="synonyms" 
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>近义词</span>}
            style={{ marginBottom: '24px' }}
          >
            <WordMeaningSelect 
              allWords={allWords} 
              partsOfSpeech={partsOfSpeech}
              placeholder="选择近义词"
            />
          </Form.Item>
          
          <Form.Item 
            name="antonyms" 
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>反义词</span>}
            style={{ marginBottom: '24px' }}
          >
            <WordMeaningSelect 
              allWords={allWords} 
              partsOfSpeech={partsOfSpeech}
              placeholder="选择反义词"
            />
          </Form.Item>
          
          <Form.Item
            name="exampleSentence"
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>例句</span>}
            style={{ marginBottom: '24px' }}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入例句" 
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
          
          <Form.Item
            name="chineseTranslation"
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>例句翻译</span>}
            style={{ marginBottom: '24px' }}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入例句翻译" 
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

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

interface WordDetailDrawerProps {
  visible: boolean;
  mode: 'create' | 'edit' | 'view';
  wordId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const WordDetailDrawer: React.FC<WordDetailDrawerProps> = ({ 
  visible, 
  mode, 
  wordId, 
  onClose, 
  onSuccess 
}) => {
  const [form] = Form.useForm();
  
  // 状态定义
  const [word, setWord] = useState<Word | null>(null);
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingMeaningId, setEditingMeaningId] = useState<string | null>(null);
  const [showNewMeaning, setShowNewMeaning] = useState<boolean>(false);
  const [newMeaningForm] = Form.useForm();
  const [editMeaningForm] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState<string>('0');
  const [newTabs, setNewTabs] = useState<Array<{key: string, title: string, content: any, isNew: boolean}>>([]);

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
    if (mode === 'create' || !wordId) {
      setWord(null);
      form.resetFields();
      return;
    }

    setLoading(true);
    try {
      const response = await getWordById(wordId);
      setWord(response.data);
      
      // 设置基本信息表单
      form.setFieldsValue({
        spelling: response.data.spelling,
        phonetic: response.data.phonetic,
        difficultyLevel: response.data.difficultyLevel
      });
    } catch (error) {
      message.error('获取单词详情失败');
      console.error('获取单词详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      if (mode === 'create') {
        setWord(null);
        form.resetFields();
        setActiveTabKey('0');
        setNewTabs([]);
      } else if (wordId) {
        fetchWordDetail();
      }
      fetchPartsOfSpeech();
      fetchAllWords();
    }
  }, [visible, mode, wordId]);

  // 当word数据更新时，确保activeTabKey有效
  useEffect(() => {
    if (word?.meanings && word.meanings.length > 0) {
      // 计算所有有效的Tab键（包括现有词义和新添加的Tab页）
      const existingTabKeys = word.meanings.map((_, index) => index.toString());
      const newTabKeys = newTabs.map(tab => tab.key);
      const allValidKeys = [...existingTabKeys, ...newTabKeys];
      
      // 如果当前activeTabKey不在有效范围内，设置为第一个Tab
      if (!allValidKeys.includes(activeTabKey)) {
        setActiveTabKey('0');
      }
    }
  }, [word, activeTabKey, newTabs]);

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

  // 从选择的值中提取词性ID
  const extractMeaningIds = (selectedValues: string[]) => {
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
      
      return targetMeaning?.id;
    }).filter(id => id !== null) as string[];
  };

  // 添加新词义Tab
  const handleAddNewMeaningTab = () => {
    if (!word) {
      message.error('请先保存基本信息');
      return;
    }
    
    const newTabKey = `new-${Date.now()}`;
    const newTab = {
      key: newTabKey,
      title: '新添加词性',
      content: null,
      isNew: true
    };
    
    setNewTabs(prev => [...prev, newTab]);
    setActiveTabKey(newTabKey);
  };

  // 保存新词义
  const handleSaveNewMeaning = async (tabKey: string, form: any) => {
    try {
      const values = await form.validateFields();
      
      if (!word) {
        message.error('请先保存基本信息');
        return;
      }

      // 提取同义词和反义词的词性ID
      const synonymWordMeaningIds = values.synonyms ? extractMeaningIds(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractMeaningIds(values.antonyms) : [];

      const newMeaning: Omit<WordMeaning, 'id'> = {
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        exampleSentences: values.exampleSentence ? [{
          id: '',
          meaningId: '',
          englishSentence: values.exampleSentence,
          chineseSentence: values.chineseTranslation || ''
        }] : [],
        sentences: values.exampleSentence ? [{
          englishContent: values.exampleSentence,
          chineseMeaning: values.chineseTranslation || ''
        }] : [],
        synonyms: [],
        antonyms: []
      };

      const response = await addWordMeaning(newMeaning);
      setWord(response.data);
      
      // 移除已保存的新tab，因为新词义会自动添加到正常的词义列表中
      setNewTabs(prev => prev.filter(tab => tab.key !== tabKey));
      
      // 切换到第一个tab
      setActiveTabKey('0');
      
      form.resetFields();
      message.success('词性添加成功');
    } catch (error) {
      message.error('添加词性失败');
      console.error('添加词性失败:', error);
    }
  };

  // 取消新词义Tab
  const handleCancelNewMeaning = (tabKey: string) => {
    setNewTabs(prev => prev.filter(tab => tab.key !== tabKey));
    if (activeTabKey === tabKey) {
      setActiveTabKey('0');
    }
  };

  // 处理Tab的编辑操作（关闭按钮）
  const handleTabEdit = (
    targetKey: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, 
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      // 只允许关闭新添加的Tab页
      const isNewTab = newTabs.some(tab => tab.key === targetKey);
      if (isNewTab) {
        handleCancelNewMeaning(targetKey);
      }
    }
  };

  // 添加新词性（保留原有逻辑作为备用）
  const handleAddMeaning = async () => {
    try {
      const values = await newMeaningForm.validateFields();
      
      if (!word) {
        message.error('请先保存基本信息');
        return;
      }

      // 提取同义词和反义词的词性ID
      const synonymWordMeaningIds = values.synonyms ? extractMeaningIds(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractMeaningIds(values.antonyms) : [];

      const newMeaning: Omit<WordMeaning, 'id'> = {
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        exampleSentences: values.exampleSentence ? [{
          id: '',
          meaningId: '',
          englishSentence: values.exampleSentence,
          chineseSentence: values.chineseTranslation || ''
        }] : [],
        sentences: values.exampleSentence ? [{
          englishContent: values.exampleSentence,
          chineseMeaning: values.chineseTranslation || ''
        }] : [],
        synonyms: [],
        antonyms: []
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
      exampleSentence: meaning.exampleSentences?.[0]?.englishSentence || '',
      chineseTranslation: meaning.exampleSentences?.[0]?.chineseSentence || ''
    });
  };

  // 保存编辑的词性
  const handleSaveEditMeaning = async () => {
    try {
      const values = await editMeaningForm.validateFields();
      
      if (!word || !editingMeaningId) return;

      // 提取同义词和反义词的词性ID
      const synonymWordMeaningIds = values.synonyms ? extractMeaningIds(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractMeaningIds(values.antonyms) : [];

      const meaningToUpdate: Omit<WordMeaning, 'createdAt' | 'updatedAt'> = {
        id: editingMeaningId,
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        exampleSentences: values.exampleSentence ? [{
          id: '',
          meaningId: editingMeaningId,
          englishSentence: values.exampleSentence,
          chineseSentence: values.chineseTranslation || ''
        }] : [],
        sentences: values.exampleSentence ? [{
          englishContent: values.exampleSentence,
          chineseMeaning: values.chineseTranslation || ''
        }] : [],
        synonyms: [],
        antonyms: []
      };

      const response = await addWordMeaning(meaningToUpdate);
      setWord(response.data);
      setEditingMeaningId(null);
      editMeaningForm.resetFields();
      message.success('词性更新成功');
    } catch (error) {
      message.error('更新词性失败');
      console.error('更新词性失败:', error);
    }
  };

  // 删除词性
  const handleDeleteMeaning = async (meaningId: string) => {
    try {
      if (!word) return;

      const response = await deleteWordMeaning(word.id, meaningId);
      setWord(response.data);
      message.success('词性删除成功');
    } catch (error) {
      message.error('删除词性失败');
      console.error('删除词性失败:', error);
    }
  };

  const getDrawerTitle = () => {
    switch (mode) {
      case 'create': return '添加单词';
      case 'edit': return '编辑单词';
      case 'view': return '单词详情';
      default: return '单词详情';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Drawer
      title={getDrawerTitle()}
      placement="right"
      width={1200}
      open={visible}
      onClose={onClose}
      className="word-detail-drawer"
    >
      <div className="word-detail-drawer-content">
        {/* 基本信息 */}
        <Card 
          title="基本信息" 
          className="basic-info-card"
          extra={
            !isReadOnly && (
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSaveBasicInfo}
                loading={loading}
              >
                保存基本信息
              </Button>
            )
          }
        >
          <Form
            form={form}
            layout="vertical"
            disabled={isReadOnly}
          >
            <div className="word-info-row">
              <div className="word-info-field">
                <Form.Item
                  name="spelling"
                  label="拼写"
                  rules={[{ required: true, message: '请输入单词拼写' }]}
                >
                  <Input placeholder="请输入单词拼写" />
                </Form.Item>
              </div>
              
              <div className="word-info-field">
                <Form.Item
                  name="phonetic"
                  label="发音"
                  rules={[{ required: true, message: '请输入音标' }]}
                >
                  <Input placeholder="请输入音标，如：/həˈləʊ/" />
                </Form.Item>
              </div>
              
              <div className="word-info-field">
                <Form.Item
                  name="difficultyLevel"
                  label="难度级别"
                  rules={[{ required: true, message: '请选择难度级别' }]}
                >
                  <Select placeholder="请选择难度级别">
                    {difficultyLevelConfigs.map(config => (
                      <Option key={config.value} value={config.value}>
                        <span style={{ color: config.color }}>{config.label}</span>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>

        {/* 词义信息 */}
        <div className="meanings-section">
          <div className="section-header">
            <Title level={4} className="section-title">词义信息</Title>
            {!isReadOnly && (
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={handleAddNewMeaningTab}
                disabled={!word}
              >
                添加新词义
              </Button>
            )}
          </div>

          {/* Tab页展示词义信息 */}
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            type="editable-card"
            hideAdd
            onEdit={handleTabEdit}
            items={[
              // 现有词义的Tab页
              ...((word?.meanings || []).map((meaning, index) => {
                const partOfSpeech = partsOfSpeech.find(pos => pos.id === meaning.partOfSpeechId);
                const isEditing = editingMeaningId === meaning.id;
                
                return {
                  key: index.toString(),
                  label: `${partOfSpeech?.englishName || '未知词性'}-${meaning.chineseMeaning}`,
                  children: (
                    <Card 
                      className="meaning-card"
                      extra={
                        !isReadOnly && (
                          <Space>
                            {isEditing ? (
                              <>
                                <Button size="small" onClick={handleSaveEditMeaning}>保存</Button>
                                <Button size="small" onClick={() => setEditingMeaningId(null)}>取消</Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  size="small" 
                                  icon={<EditOutlined />} 
                                  onClick={() => handleEditMeaning(meaning)}
                                >
                                  编辑
                                </Button>
                                <Button 
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
                        )
                      }
                    >
                      {isEditing ? (
                        <Form form={editMeaningForm} layout="vertical">
                          <Form.Item
                            name="partOfSpeechId"
                            label="词性"
                            rules={[{ required: true, message: '请选择词性' }]}
                          >
                            <Select placeholder="请选择词性">
                              {partsOfSpeech.map(pos => (
                                <Option key={pos.id} value={pos.id}>{pos.englishName}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                          
                          <Form.Item
                            name="chineseMeaning"
                            label="中文释义"
                            rules={[{ required: true, message: '请输入中文释义' }]}
                          >
                            <TextArea rows={2} placeholder="请输入中文释义" />
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
                          
                          <Form.Item
                             name="exampleSentence"
                             label="例句"
                           >
                             <TextArea rows={2} placeholder="请输入例句" />
                           </Form.Item>
                           
                           <Form.Item
                             name="chineseTranslation"
                             label="例句翻译"
                           >
                             <TextArea rows={2} placeholder="请输入例句翻译" />
                           </Form.Item>
                         </Form>
                       ) : (
                         <div className="meaning-content">
                           <div className="meaning-item">
                             <Text strong>词性：</Text>
                             <span>{partOfSpeech?.englishName || '未知词性'}</span>
                           </div>
                           
                           <div className="meaning-item">
                             <Text strong>中文释义：</Text>
                             <span>{meaning.chineseMeaning}</span>
                           </div>
                           
                           {meaning.synonyms && meaning.synonyms.length > 0 && (
                             <div className="meaning-item">
                               <Text strong>近义词：</Text>
                               <div className="synonym-tags">
                                 {meaning.synonyms.map((synonym, idx) => (
                                   <Tag key={idx} color="blue">
                                     {synonym.synonymWord?.spelling || '未知单词'}
                                   </Tag>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {meaning.antonyms && meaning.antonyms.length > 0 && (
                             <div className="meaning-item">
                               <Text strong>反义词：</Text>
                               <div className="antonym-tags">
                                 {meaning.antonyms.map((antonym, idx) => (
                                   <Tag key={idx} color="red">
                                     {antonym.antonymWord?.spelling || '未知单词'}
                                   </Tag>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {meaning.exampleSentences && meaning.exampleSentences.length > 0 && (
                             <div className="meaning-item">
                               <Text strong>例句：</Text>
                               <div className="example-sentences">
                                 {meaning.exampleSentences.map((sentence, idx) => (
                                   <div key={idx} className="example-sentence">
                                     <div className="english-sentence">{sentence.englishSentence}</div>
                                     {sentence.chineseSentence && (
                                       <div className="chinese-sentence">{sentence.chineseSentence}</div>
                                     )}
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {meaning.sentences && meaning.sentences.length > 0 && (
                             <div className="meaning-item">
                               <Text strong>例句：</Text>
                               <div className="example-sentences">
                                 {meaning.sentences.map((sentence, idx) => (
                                   <div key={idx} className="example-sentence">
                                     <div className="english-sentence">{sentence.englishContent}</div>
                                     {sentence.chineseMeaning && (
                                       <div className="chinese-sentence">{sentence.chineseMeaning}</div>
                                     )}
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       )}
                     </Card>
                   )
                 };
               })),
               // 新添加的Tab页
               ...newTabs.map(tab => ({
                 key: tab.key,
                 label: tab.title,
                 children: (
                   <NewMeaningTabContent
                     tabKey={tab.key}
                     partsOfSpeech={partsOfSpeech}
                     allWords={allWords}
                     onSave={handleSaveNewMeaning}
                     onCancel={handleCancelNewMeaning}
                     isReadOnly={isReadOnly}
                   />
                 )
               }))
             ]}
           />


        </div>
      </div>
    </Drawer>
  );
};

export default WordDetailDrawer;