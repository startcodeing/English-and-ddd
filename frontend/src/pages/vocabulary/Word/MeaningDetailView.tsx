import React from 'react';
import { Tag, Typography } from 'antd';
import { WordMeaning, PartOfSpeech } from '../../../types';
import './MeaningDetailView.css';

const { Text } = Typography;

interface MeaningDetailViewProps {
  meaning: WordMeaning;
  partOfSpeech?: PartOfSpeech;
}

const MeaningDetailView: React.FC<MeaningDetailViewProps> = ({ meaning, partOfSpeech }) => {
  return (
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
      
      {(meaning.exampleSentences && meaning.exampleSentences.length > 0) ? (
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
      ) : meaning.sentences && meaning.sentences.length > 0 ? (
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
      ) : null}
    </div>
  );
};

export default MeaningDetailView;