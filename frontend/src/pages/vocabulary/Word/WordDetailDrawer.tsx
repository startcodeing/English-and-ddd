import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Form, message, Space, Card, Tag, Typography, Drawer, Tabs } from 'antd';
import { SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getWordById,
  getWordDetail,
  createWord,
  updateWord,
  deleteWordMeaning,
  addWordMeaning,
  getAllWords
} from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, WordMeaning, WordDetail, PartOfSpeech, SynonymInfo, AntonymInfo } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { DifficultyLevel } from '../../../types';
import MeaningDetailView from './MeaningDetailView';
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
    <div style={{ padding: '12px', minHeight: '300px' }}>
      <Card 
        title="添加新词性" 
        className="new-meaning-card"
        size="default"
        style={{ marginBottom: '10px' }}
        extra={
          <Space>
            <Button onClick={() => onSave(tabKey, form)} type="primary" size="middle">保存</Button>
            <Button onClick={() => {
              onCancel(tabKey);
              form.resetFields();
            }} size="middle">取消</Button>
          </Space>
        }
      >
        <Form 
          form={form} 
          layout="vertical" 
          style={{ marginTop: '10px' }}
          size="middle"
        >
          <Form.Item
            name="partOfSpeechId"
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>词性</span>}
            rules={[{ required: true, message: '请选择词性' }]}
            style={{ marginBottom: '12px' }}
          >
            <Select 
              placeholder="请选择词性" 
              style={{ width: '100%', height: '32px' }}
              size="middle"
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
            style={{ marginBottom: '12px' }}
          >
            <TextArea 
              rows={2} 
              placeholder="请输入中文释义" 
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="synonyms" 
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>近义词</span>}
            style={{ marginBottom: '12px' }}
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
            style={{ marginBottom: '12px' }}
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
            style={{ marginBottom: '12px' }}
          >
            <TextArea 
              rows={2} 
              placeholder="请输入例句" 
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
          
          <Form.Item
            name="chineseTranslation"
            label={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>例句翻译</span>}
            style={{ marginBottom: '12px' }}
          >
            <TextArea 
              rows={2} 
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
      const response = await getWordDetail(wordId);
      console.log("API Response:", JSON.stringify(response.data, null, 2));
      
      // 使用通用的转换函数将WordDetail转换为Word
      const wordData = convertWordDetailToWord(response.data);
      
      setWord(wordData);
      
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
    // 在查看模式下不允许保存
    if (mode === 'view') return;
    
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
        // 调用onSuccess回调刷新单词列表，但不关闭抽屉
        // 使用自定义事件通知父组件刷新列表
        // 创建一个自定义事件，表示只需要刷新列表，不需要关闭抽屉
        const event = new CustomEvent('refreshWordList', { detail: { closeDrawer: false } });
        window.dispatchEvent(event);
      } else if (word) {
        const response = await updateWord(word.id, wordData);
        setWord(response.data);
        message.success('基本信息保存成功');
        // 调用onSuccess回调刷新单词列表，但不关闭抽屉
        // 使用自定义事件通知父组件刷新列表
        // 创建一个自定义事件，表示只需要刷新列表，不需要关闭抽屉
        const event = new CustomEvent('refreshWordList', { detail: { closeDrawer: false } });
        window.dispatchEvent(event);
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

  // 添加新词义Tab
  const handleAddNewMeaningTab = () => {
    // 在查看模式下不允许添加新词义
    if (mode === 'view') {
      return;
    }
    
    if (!word) {
      message.error('请先保存基本信息');
      return;
    }
    
    const newTabKey = `new-${Date.now()}`;
    const newTab = {
      key: newTabKey,
      title: '新添加词义',
      content: null,
      isNew: true
    };
    
    setNewTabs(prev => [...prev, newTab]);
    setActiveTabKey(newTabKey);
  };

  // 将WordDetail转换为Word的辅助函数
  const convertWordDetailToWord = (wordDetail: WordDetail): Word => {
    return {
      id: wordDetail.id,
      spelling: wordDetail.spelling,
      phonetic: wordDetail.phonetic,
      difficultyLevel: wordDetail.difficultyLevel,
      meanings: wordDetail.meanings.map(detailedMeaning => {
        return {
          id: detailedMeaning.id,
          wordId: detailedMeaning.wordId,
          partOfSpeechId: detailedMeaning.partOfSpeechId,
          chineseMeaning: detailedMeaning.chineseMeaning,
          synonyms: detailedMeaning.synonyms.map(syn => ({
            id: syn.synonymMeaningId, // 使用synonymMeaningId作为ID
            meaningId: detailedMeaning.id,
            synonymWordId: syn.synonymWordId,
            synonymMeaningId: syn.synonymMeaningId,
            synonymWord: {
              id: syn.synonymWordId,
              spelling: syn.synonymSpell,
              partOfSpeechId: detailedMeaning.partOfSpeechId,
              meanings: []
            }
          })),
          antonyms: detailedMeaning.antonyms.map(ant => ({
            id: ant.antonymMeaningId, // 使用antonymMeaningId作为ID
            meaningId: detailedMeaning.id,
            antonymWordId: ant.antonymWordId,
            antonymMeaningId: ant.antonymMeaningId,
            antonymWord: {
              id: ant.antonymWordId,
              spelling: ant.antonymSpell,
              partOfSpeechId: detailedMeaning.partOfSpeechId,
              meanings: []
            }
          })),
          sentences: detailedMeaning.exampleSentences.map(es => ({
            englishContent: es.englishContent,
            chineseMeaning: es.chineseMeaning
          }))
        };
      })
    };
  };

  // 保存新词义
  const handleSaveNewMeaning = async (tabKey: string, form: any) => {
    // 在查看模式下不允许保存
    if (mode === 'view') return;
    
    try {
      const values = await form.validateFields();
      
      if (!word) {
        message.error('请先保存基本信息');
        return;
      }

      // 提取同义词和反义词信息
      const synonymWordMeaningIds = values.synonyms ? extractSynonymInfos(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractAntonymInfos(values.antonyms) : [];

      // 构建同义词数据
      const synonyms = synonymWordMeaningIds.map(info => {
        const synonymWord = allWords.find(w => w.id === info.synonymWordId);
        return {
          id: '',
          meaningId: '',
          synonymWordId: info.synonymWordId,
          synonymMeaningId: info.synonymMeaningId,
          synonymWord: synonymWord
        };
      });

      // 构建反义词数据
      const antonyms = antonymWordMeaningIds.map(info => {
        const antonymWord = allWords.find(w => w.id === info.antonymWordId);
        return {
          id: '',
          meaningId: '',
          antonymWordId: info.antonymWordId,
          antonymMeaningId: info.antonymMeaningId,
          antonymWord: antonymWord
        };
      });

      const newMeaning: Omit<WordMeaning, 'id'> = {
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        sentences: values.exampleSentence ? [{
          englishContent: values.exampleSentence,
          chineseMeaning: values.chineseTranslation || ''
        }] : []
      };

      // 先调用添加词义接口
      await addWordMeaning(newMeaning);
      
      // 然后调用获取单词详情接口，获取完整的单词信息（包括同义词、反义词和例句）
      if (word.id) {
        const detailResponse = await getWordDetail(word.id);
        // 将WordDetail转换为Word
        const convertedWord = convertWordDetailToWord(detailResponse.data);
        setWord(convertedWord);
        
        // 找到新添加的词义，以便后续设置activeTabKey
        const newMeaningIndex = convertedWord.meanings.findIndex(
          m => m.partOfSpeechId === values.partOfSpeechId && m.chineseMeaning === values.chineseMeaning
        );
        
        // 移除已保存的新tab，因为新词义会自动添加到正常的词义列表中
        setNewTabs(prev => prev.filter(tab => tab.key !== tabKey));
        
        // 切换到新添加的词义对应的tab
        if (newMeaningIndex !== -1) {
          setActiveTabKey(newMeaningIndex.toString());
        } else {
          setActiveTabKey('0'); // 如果找不到，默认切换到第一个tab
        }
        
        // 使用自定义事件通知父组件刷新列表，但不关闭抽屉
        const event = new CustomEvent('refreshWordList', { detail: { closeDrawer: false } });
        window.dispatchEvent(event);
      }
      
      form.resetFields();
      message.success('词性添加成功');
    } catch (error) {
      message.error('添加词性失败');
      console.error('添加词性失败:', error);
    }
  };

  // 取消新词义Tab
  const handleCancelNewMeaning = (tabKey: string) => {
    // 在查看模式下不允许取消
    if (mode === 'view') return;
    
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
    // 在查看模式下不允许编辑Tab
    if (mode === 'view') return;
    
    if (action === 'remove' && typeof targetKey === 'string') {
      // 只允许关闭新添加的Tab页
      const isNewTab = newTabs.some(tab => tab.key === targetKey);
      if (isNewTab) {
        handleCancelNewMeaning(targetKey);
      }
    }
  };

  // 编辑词性
  const handleEditMeaning = (meaning: WordMeaning) => {
    // 在查看模式下不允许编辑
    if (mode === 'view') return;
    
    setEditingMeaningId(meaning.id);
    
    // 将同义词转换为Select组件需要的格式："单词-词性"
    const synonymValues = meaning.synonyms?.map(synonym => {
      const synonymWord = synonym.synonymWord;
      if (!synonymWord) return null;
      
      // 查找同义词的词性
      const synonymWordObj = allWords.find(w => w.id === synonym.synonymWordId);
      if (!synonymWordObj) return null;
      
      // 使用synonymMeaningId查找对应的词义
      const synonymMeaningId = synonym.synonymMeaningId || synonym.id; // 兼容两种数据结构
      console.log('同义词处理:', { synonymId: synonym.id, synonymMeaningId: synonym.synonymMeaningId, fallbackId: synonym.id });
      const synonymMeaning = synonymWordObj.meanings?.find(m => m.id === synonymMeaningId);
      if (!synonymMeaning) {
        // 如果找不到对应的词义，尝试使用词性来匹配
        const meaningWithSamePos = synonymWordObj.meanings?.find(m => {
          const pos = partsOfSpeech.find(p => p.id === m.partOfSpeechId);
          const meaningPos = partsOfSpeech.find(p => p.id === meaning.partOfSpeechId);
          return pos?.englishName === meaningPos?.englishName;
        });
        if (!meaningWithSamePos) return null;
        
        const pos = partsOfSpeech.find(p => p.id === meaningWithSamePos.partOfSpeechId);
        if (!pos) return null;
        
        return `${synonymWord.spelling}-${pos.englishName}`;
      }
      
      const pos = partsOfSpeech.find(p => p.id === synonymMeaning.partOfSpeechId);
      if (!pos) return null;
      
      return `${synonymWord.spelling}-${pos.englishName}`;
    }).filter(Boolean) || [];
    
    // 将反义词转换为Select组件需要的格式："单词-词性"
    const antonymValues = meaning.antonyms?.map(antonym => {
      const antonymWord = antonym.antonymWord;
      if (!antonymWord) return null;
      
      // 查找反义词的词性
      const antonymWordObj = allWords.find(w => w.id === antonym.antonymWordId);
      if (!antonymWordObj) return null;
      
      // 使用antonymMeaningId查找对应的词义
      const antonymMeaningId = antonym.antonymMeaningId || antonym.id; // 兼容两种数据结构
      console.log('反义词处理:', { antonymId: antonym.id, antonymMeaningId: antonym.antonymMeaningId, fallbackId: antonym.id });
      const antonymMeaning = antonymWordObj.meanings?.find(m => m.id === antonymMeaningId);
      if (!antonymMeaning) {
        // 如果找不到对应的词义，尝试使用词性来匹配
        const meaningWithSamePos = antonymWordObj.meanings?.find(m => {
          const pos = partsOfSpeech.find(p => p.id === m.partOfSpeechId);
          const meaningPos = partsOfSpeech.find(p => p.id === meaning.partOfSpeechId);
          return pos?.englishName === meaningPos?.englishName;
        });
        if (!meaningWithSamePos) return null;
        
        const pos = partsOfSpeech.find(p => p.id === meaningWithSamePos.partOfSpeechId);
        if (!pos) return null;
        
        return `${antonymWord.spelling}-${pos.englishName}`;
      }
      
      const pos = partsOfSpeech.find(p => p.id === antonymMeaning.partOfSpeechId);
      if (!pos) return null;
      
      return `${antonymWord.spelling}-${pos.englishName}`;
    }).filter(Boolean) || [];
    
    console.log('设置编辑表单值:', {
      synonymValues,
      antonymValues
    });
    
    editMeaningForm.setFieldsValue({
      partOfSpeechId: meaning.partOfSpeechId,
      chineseMeaning: meaning.chineseMeaning,
      synonyms: synonymValues,
      antonyms: antonymValues,
      exampleSentence: meaning.sentences?.[0]?.englishContent || '',
      chineseTranslation: meaning.sentences?.[0]?.chineseMeaning || ''
    });
  };

  // 保存编辑的词性
  const handleSaveEditMeaning = async () => {
    // 在查看模式下不允许保存
    if (mode === 'view') return;
    
    try {
      const values = await editMeaningForm.validateFields();
      
      if (!word || !editingMeaningId) return;

      // 保存当前正在编辑的词义ID，用于后续找到对应的tab
      const currentEditingMeaningId = editingMeaningId;

      // 提取同义词和反义词的词性ID
      const synonymWordMeaningIds = values.synonyms ? extractSynonymInfos(values.synonyms) : [];
      const antonymWordMeaningIds = values.antonyms ? extractAntonymInfos(values.antonyms) : [];

      // 构建同义词数据
      const synonyms = synonymWordMeaningIds.map(info => {
        const synonymWord = allWords.find(w => w.id === info.synonymWordId);
        return {
          id: '',
          meaningId: currentEditingMeaningId,
          synonymWordId: info.synonymWordId,
          synonymMeaningId: info.synonymMeaningId,
          synonymWord: synonymWord
        };
      });

      // 构建反义词数据
      const antonyms = antonymWordMeaningIds.map(info => {
        const antonymWord = allWords.find(w => w.id === info.antonymWordId);
        return {
          id: '',
          meaningId: currentEditingMeaningId,
          antonymWordId: info.antonymWordId,
          antonymMeaningId: info.antonymMeaningId,
          antonymWord: antonymWord
        };
      });

      const meaningToUpdate: Omit<WordMeaning, 'createdAt' | 'updatedAt'> = {
        id: currentEditingMeaningId,
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        synonymWordMeaningIds,
        antonymWordMeaningIds,
        sentences: values.exampleSentence ? [{
          englishContent: values.exampleSentence,
          chineseMeaning: values.chineseTranslation || ''
        }] : []
      };

      // 先调用更新词义接口
      await addWordMeaning(meaningToUpdate);
      
      // 然后调用获取单词详情接口，获取完整的单词信息（包括同义词、反义词和例句）
      if (word.id) {
        const detailResponse = await getWordDetail(word.id);
        // 将WordDetail转换为Word
        const convertedWord = convertWordDetailToWord(detailResponse.data);
        setWord(convertedWord);
        
        // 找到刚才编辑的词义对应的索引
        const editedMeaningIndex = convertedWord.meanings.findIndex(m => m.id === currentEditingMeaningId);
        
        // 切换到编辑的词义对应的tab
        if (editedMeaningIndex !== -1) {
          setActiveTabKey(editedMeaningIndex.toString());
        }
        
        // 使用自定义事件通知父组件刷新列表，但不关闭抽屉
        const event = new CustomEvent('refreshWordList', { detail: { closeDrawer: false } });
        window.dispatchEvent(event);
      }
      
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
    // 在查看模式下不允许删除
    if (mode === 'view') return;
    
    try {
      if (!word) return;

      // 先调用删除词义接口
      await deleteWordMeaning(word.id, meaningId);
      
      // 然后调用获取单词详情接口，获取完整的单词信息（包括同义词、反义词和例句）
      const detailResponse = await getWordDetail(word.id);
      // 将WordDetail转换为Word
      const convertedWord = convertWordDetailToWord(detailResponse.data);
      setWord(convertedWord);
      
      // 如果当前没有词义了，或者当前激活的Tab对应的词义被删除了，切换到第一个Tab
      if (convertedWord.meanings.length === 0 || !convertedWord.meanings[parseInt(activeTabKey)]) {
        setActiveTabKey('0');
      }
      
      // 使用自定义事件通知父组件刷新列表，但不关闭抽屉
      const event = new CustomEvent('refreshWordList', { detail: { closeDrawer: false } });
      window.dispatchEvent(event);
      
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
      width={1000}
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
            size="small"
            style={{ margin: '0 -8px' }}
          >
            <div className="word-info-row">
              <div className="word-info-field">
                <Form.Item
                  name="spelling"
                  label="拼写"
                  rules={[{ required: true, message: '请输入单词拼写' }]}
                  style={{ padding: '0 8px', marginBottom: '8px' }}
                >
                  <Input placeholder="请输入单词拼写" size="small" />
                </Form.Item>
              </div>
              
              <div className="word-info-field">
                <Form.Item
                  name="phonetic"
                  label="发音"
                  rules={[{ required: true, message: '请输入音标' }]}
                  style={{ padding: '0 8px', marginBottom: '8px' }}
                >
                  <Input placeholder="请输入音标，如：/həˈləʊ/" size="small" />
                </Form.Item>
              </div>
              
              <div className="word-info-field">
                <Form.Item
                  name="difficultyLevel"
                  label="难度级别"
                  rules={[{ required: true, message: '请选择难度级别' }]}
                  style={{ padding: '0 8px', marginBottom: '8px' }}
                >
                  <Select placeholder="请选择难度级别" size="small">
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
            <Title level={5} className="section-title">词义信息</Title>
            {!isReadOnly && (
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={handleAddNewMeaningTab}
                disabled={!word}
                size="small"
              >
                添加新词义
              </Button>
            )}
          </div>

          {/* Tab页展示词义信息 */}
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            type={isReadOnly ? "card" : "editable-card"}
            hideAdd
            onEdit={handleTabEdit}
            items={[
              // 现有词义的Tab页
              ...((word?.meanings || []).map((meaning, index) => {
                const partOfSpeech = partsOfSpeech.find(pos => pos.id === meaning.partOfSpeechId);
                // 只有在编辑模式下才允许编辑词义
                const isEditing = mode !== 'view' && editingMeaningId === meaning.id;
                
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
                                <Button size="small" type="primary" onClick={handleSaveEditMeaning}>保存</Button>
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
                        <Form form={editMeaningForm} layout="vertical" size="small">
                          <Form.Item
                            name="partOfSpeechId"
                            label="词性"
                            rules={[{ required: true, message: '请选择词性' }]}
                            style={{ marginBottom: '8px' }}
                          >
                            <Select placeholder="请选择词性" size="small">
                              {partsOfSpeech.map(pos => (
                                <Option key={pos.id} value={pos.id}>{pos.englishName}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                          
                          <Form.Item
                            name="chineseMeaning"
                            label="中文释义"
                            rules={[{ required: true, message: '请输入中文释义' }]}
                            style={{ marginBottom: '8px' }}
                          >
                            <TextArea rows={2} placeholder="请输入中文释义" />
                          </Form.Item>
                          
                          <Form.Item name="synonyms" label="近义词" style={{ marginBottom: '8px' }}>
                            <WordMeaningSelect 
                              allWords={allWords} 
                              partsOfSpeech={partsOfSpeech}
                              placeholder="选择近义词"
                            />
                          </Form.Item>
                          
                          <Form.Item name="antonyms" label="反义词" style={{ marginBottom: '8px' }}>
                            <WordMeaningSelect 
                              allWords={allWords} 
                              partsOfSpeech={partsOfSpeech}
                              placeholder="选择反义词"
                            />
                          </Form.Item>
                          
                          <Form.Item
                             name="exampleSentence"
                             label="例句"
                             style={{ marginBottom: '8px' }}
                           >
                             <TextArea rows={2} placeholder="请输入例句" />
                           </Form.Item>
                           
                           <Form.Item
                             name="chineseTranslation"
                             label="例句翻译"
                             style={{ marginBottom: '8px' }}
                           >
                             <TextArea rows={2} placeholder="请输入例句翻译" />
                           </Form.Item>
                         </Form>
                       ) : (
                         <MeaningDetailView meaning={meaning} partOfSpeech={partOfSpeech} />
                       )}
                     </Card>
                   )
                 };
               })),
               // 新添加的Tab页 - 只在非查看模式下显示
               ...(isReadOnly ? [] : newTabs.map(tab => ({
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
               })))
             ]}
           />


        </div>
      </div>
    </Drawer>
  );
};

export default WordDetailDrawer;