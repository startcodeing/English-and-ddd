import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Form, message, Space, Card, Tag, Typography, Drawer } from 'antd';
import { SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getWordById, createWord, updateWord, deleteWordMeaning, addWordMeaning } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, WordMeaning, PartOfSpeech } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { DifficultyLevel } from '../../../types';
import './WordDetailDrawer.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

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
      fetchPartsOfSpeech();
      fetchWordDetail();
    }
  }, [visible, wordId, mode]);

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
        exampleSentences: values.exampleSentence ? [{
          id: '',
          meaningId: '',
          englishSentence: values.exampleSentence,
          chineseSentence: values.chineseTranslation || ''
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

      const meaningToUpdate: Omit<WordMeaning, 'createdAt' | 'updatedAt'> = {
        id: editingMeaningId,
        wordId: word.id,
        partOfSpeechId: values.partOfSpeechId,
        chineseMeaning: values.chineseMeaning,
        exampleSentences: values.exampleSentence ? [{
          id: '',
          meaningId: editingMeaningId,
          englishSentence: values.exampleSentence,
          chineseSentence: values.chineseTranslation || ''
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
      width={800}
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

        {/* 词性信息 */}
        <div className="meanings-section">
          <div className="section-header">
            <Title level={4} className="section-title">词性信息</Title>
            {!isReadOnly && (
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => setShowNewMeaning(true)}
                disabled={!word || showNewMeaning}
              >
                添加新词性
              </Button>
            )}
          </div>

          {/* 现有词性列表 */}
          {word?.meanings?.map((meaning, index) => {
            const partOfSpeech = partsOfSpeech.find(pos => pos.id === meaning.partOfSpeechId);
            const isEditing = editingMeaningId === meaning.id;
            
            return (
              <Card 
                key={meaning.id || index} 
                className="meaning-card"
                title={
                  <div className="meaning-card-header">
                    <Tag color="blue">{partOfSpeech?.englishName || '未知词性'}</Tag>
                    <Text className="meaning-text">{meaning.chineseMeaning}</Text>
                  </div>
                }
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
                  </div>
                )}
              </Card>
            );
          })}

          {/* 添加新词性表单 */}
          {showNewMeaning && !isReadOnly && (
            <Card 
              title="添加新词性" 
              className="new-meaning-card"
              extra={
                <Space>
                  <Button onClick={handleAddMeaning} type="primary">保存</Button>
                  <Button onClick={() => {
                    setShowNewMeaning(false);
                    newMeaningForm.resetFields();
                  }}>取消</Button>
                </Space>
              }
            >
              <Form form={newMeaningForm} layout="vertical">
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
            </Card>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default WordDetailDrawer;