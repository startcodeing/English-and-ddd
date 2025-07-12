import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.model.valueobject.SynonymInfo;
import com.englishlearning.domain.vocabulary.model.valueobject.AntonymInfo;
import com.englishlearning.application.vocabulary.dto.WordMeaningDetailDTO;
import com.englishlearning.application.vocabulary.dto.SynonymDetailDTO;
import com.englishlearning.application.vocabulary.dto.AntonymDetailDTO;
import com.englishlearning.application.vocabulary.dto.ExampleSentenceDetailDTO;
import com.englishlearning.application.vocabulary.mapper.impl.WordMeaningMapperImpl;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import com.englishlearning.application.vocabulary.service.SentenceProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TestSynonymAntonym {
    public static void main(String[] args) {
        // 创建一个模拟的WordRepository
        WordRepository mockRepository = new MockWordRepository();
        
        // 创建一个模拟的SentenceProvider
        SentenceProvider mockSentenceProvider = new MockSentenceProvider();
        
        // 创建WordMeaningMapperImpl实例
        WordMeaningMapperImpl mapper = new WordMeaningMapperImpl(mockRepository, mockSentenceProvider);
        
        // 创建测试数据
        WordMeaning meaning = new WordMeaning();
        meaning.setId("meaning1");
        meaning.setWordId("word1");
        
        // 添加同义词
        SynonymInfo synonymInfo = new SynonymInfo();
        synonymInfo.setSynonymWordId("word2");
        synonymInfo.setSynonymMeaningId("meaning2");
        meaning.addSynonym(synonymInfo);
        
        // 添加反义词
        AntonymInfo antonymInfo = new AntonymInfo();
        antonymInfo.setAntonymWordId("word3");
        antonymInfo.setAntonymMeaningId("meaning3");
        meaning.addAntonym(antonymInfo);
        
        // 转换为DTO
        WordMeaningDetailDTO dto = mapper.toWordMeaningDetailDTO(meaning, "test");
        
        // 打印结果
        System.out.println("同义词:");
        for (SynonymDetailDTO synonymDTO : dto.getSynonyms()) {
            System.out.println("  单词ID: " + synonymDTO.getSynonymWordId());
            System.out.println("  单词拼写: " + synonymDTO.getSynonymSpell());
            System.out.println("  意思ID: " + synonymDTO.getSynonymMeaningId());
        }
        
        System.out.println("反义词:");
        for (AntonymDetailDTO antonymDTO : dto.getAntonyms()) {
            System.out.println("  单词ID: " + antonymDTO.getAntonymWordId());
            System.out.println("  单词拼写: " + antonymDTO.getAntonymSpell());
            System.out.println("  意思ID: " + antonymDTO.getAntonymMeaningId());
        }
    }
    
    // 模拟的WordRepository实现
    static class MockWordRepository implements WordRepository {
        @Override
        public Optional<Word> findById(String id) {
            Word word = new Word();
            word.setId(id);
            
            if ("word1".equals(id)) {
                word.setSpelling("test");
            } else if ("word2".equals(id)) {
                word.setSpelling("synonym");
            } else if ("word3".equals(id)) {
                word.setSpelling("antonym");
            }
            
            return Optional.of(word);
        }
        
        // 其他方法的空实现
        @Override
        public Word save(Word entity) { return entity; }
        
        @Override
        public void deleteById(String id) {}
        
        @Override
        public boolean existsById(String id) { return true; }
        
        @Override
        public List<Word> findAll() { return new ArrayList<>(); }
    }
    
    // 模拟的SentenceProvider实现
    static class MockSentenceProvider implements SentenceProvider {
        @Override
        public List<ExampleSentenceDetailDTO> getSentenceDetail(List<String> sentenceIds) {
            return new ArrayList<>();
        }
    }
}