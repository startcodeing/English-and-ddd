import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Form, message, Space, Card, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getWordById, createWord, updateWord, addWordMeaning } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, WordMeaning, PartOfSpeech } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { DifficultyLevel } from '../../../types';
import './WordDetail.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface WordDetailProps {
  mode: 'create' | 'edit';
}

const WordDetail: React.FC<WordDetailProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 状态定义
  const [word, setWord] = useState<Word | null>(null);
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingMeaningId, setEditingMeaningId] = useState<string | null>(null);
  const [showNewMeaning, setShowNewMeaning] = useState<boolean>(false);
  const [newMeaningForm] = Form.useForm();
  const [editMeaningForm] = Form.useForm();

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

  // 获取单词详情
  const fetchWordDetail = async () => {
    if (mode === 'create') return;
    
    if (!id) {
      message.error('单词ID不存在');
      navigate('/vocabulary/word');
      return;
    }

    setLoading(true);
    try {
      const response = await getWordById(id);
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
      navigate('/vocabulary/word');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartsOfSpeech();
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

  // 添加新词性
  const handleAddMeaning = async () => {
    try {
      const values = await newMeaningForm.validateFields();
      
      if (!word) {
        message.error('请先保存基本信息');
        return;
      }

      const newMeaning: Omit<WordMeaning, 'id'> = {
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        exampleSentences: values.exampleSentences ? [
          {
            id: '',
            meaningId: '',
            englishSentence: values.exampleSentences,
            chineseSentence: values.chineseTranslation || ''
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

      const meaningToUpdate: Omit<WordMeaning, 'createdAt' | 'updatedAt'> = {
        id: editingMeaningId,
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        exampleSentences: values.exampleSentences ? [
          {
            id: '',
            meaningId: editingMeaningId,
            englishSentence: values.exampleSentences,
            chineseSentence: values.chineseTranslation || ''
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

      {/* 词性列表 */}
      <div className="meanings-section">
        <div className="section-title">词性列表</div>
        
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
                  <Input placeholder="多个用逗号分隔" />
                </Form.Item>
                
                <Form.Item name="antonyms" label="反义词">
                  <Input placeholder="多个用逗号分隔" />
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
                
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="field">
                    <Text strong>近义词：</Text>
                    <div className="tag-list">
                      {meaning.synonyms.map((synonym, index) => (
                        <Tag key={index} color="blue">
                          {synonym.synonymWord?.spelling}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
                
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <div className="field">
                    <Text strong>反义词：</Text>
                    <div className="tag-list">
                      {meaning.antonyms.map((antonym, index) => (
                        <Tag key={index} color="red">
                          {antonym.antonymWord?.spelling}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
                
                {meaning.exampleSentences && meaning.exampleSentences.length > 0 && (
                  <div className="field">
                    <Text strong>例句：</Text>
                    <div className="sentence-list">
                      {meaning.exampleSentences.map((sentence, index) => (
                        <div key={index} className="sentence-item">
                          <Tag color="green">{sentence.englishSentence}</Tag>
                          {sentence.chineseSentence && (
                            <Tag color="orange">{sentence.chineseSentence}</Tag>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <Input placeholder="多个用逗号分隔" />
              </Form.Item>
              
              <Form.Item name="antonyms" label="反义词">
                <Input placeholder="多个用逗号分隔" />
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