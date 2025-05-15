# 英语学习系统 - 领域驱动设计结构

## 领域结构

### 核心领域

#### 1. 单词领域 (Word Domain)
- **实体**：
  - 单词 (Word)
  - 词性 (PartOfSpeech)
- **值对象**：
  - 发音 (Pronunciation)
  - 用法 (Usage)
  - 例句 (Example)
- **聚合**：
  - 单词 (根)，包含相关同义词/反义词
- **仓储**：
  - 单词仓储 (WordRepository)
  - 词性仓储 (PartOfSpeechRepository)

#### 2. 句子领域 (Sentence Domain)
- **实体**：
  - 句子 (Sentence)
  - 语法分析 (GrammaticalAnalysis)
- **值对象**：
  - 句子变体 (SentenceVariant)
  - 翻译 (Translation)
- **聚合**：
  - 句子 (根)，包含相关陌生单词
- **仓储**：
  - 句子仓储 (SentenceRepository)

#### 3. 文章领域 (Article Domain)
- **实体**：
  - 文章 (Article)
  - 来源 (Source)
- **值对象**：
  - 内容 (Content)
  - 分析 (Analysis)
- **聚合**：
  - 文章 (根)，包含相关句子和陌生单词
- **仓储**：
  - 文章仓储 (ArticleRepository)

#### 4. 词汇本领域 (Vocabulary Domain)
- **实体**：
  - 词汇本 (Vocabulary)
- **值对象**：
  - 描述 (Description)
- **聚合**：
  - 词汇本 (根)，包含的单词集合
- **仓储**：
  - 词汇本仓储 (VocabularyRepository)

### 支持领域

#### 5. 练习领域 (Practice Domain)
- **实体**：
  - 听写会话 (DictationSession)
  - 写作会话 (WritingSession)
  - 测试会话 (TestSession)
- **值对象**：
  - 听写结果 (DictationResult)
  - 测试结果 (TestResult)
  - 写作分析 (WritingAnalysis)
- **聚合**：
  - 练习会话 (根)
- **仓储**：
  - 练习会话仓储 (PracticeSessionRepository)

## 限界上下文 (Bounded Contexts)

1. **单词管理上下文**
   - 管理单词和词性
   - 服务：单词服务 (WordService)、词性服务 (PartOfSpeechService)

2. **内容管理上下文**
   - 管理句子和文章
   - 服务：句子服务 (SentenceService)、文章服务 (ArticleService)

3. **学习管理上下文**
   - 管理词汇本和练习会话
   - 服务：词汇本服务 (VocabularyService)、练习服务 (PracticeService)

4. **分析上下文**
   - 提供听写、写作和测试的分析
   - 服务：听写分析服务 (DictationAnalysisService)、写作分析服务 (WritingAnalysisService)、测试分析服务 (TestAnalysisService)

## 领域事件 (Domain Events)

- 单词添加 (WordAdded)、单词更新 (WordUpdated)、单词移除 (WordRemoved)
- 句子添加 (SentenceAdded)、句子更新 (SentenceUpdated)、句子移除 (SentenceRemoved)
- 文章添加 (ArticleAdded)、文章更新 (ArticleUpdated)、文章移除 (ArticleRemoved)
- 词汇本创建 (VocabularyCreated)、词汇本更新 (VocabularyUpdated)、词汇本移除 (VocabularyRemoved)
- 练习会话开始 (PracticeSessionStarted)、练习会话完成 (PracticeSessionCompleted)

## 系统架构层次

### 应用层 (Application Layer)

- 单词应用服务 (WordApplicationService)
- 句子应用服务 (SentenceApplicationService)
- 文章应用服务 (ArticleApplicationService)
- 词汇本应用服务 (VocabularyApplicationService)
- 练习应用服务 (PracticeApplicationService)

### 基础设施层 (Infrastructure Layer)

- 持久化：仓储实现
- 外部服务：发音API、翻译API
- 横切关注点：日志、身份验证

### 表现层 (Presentation Layer)

- API接口
- Web界面
- 移动端界面

## 代码结构示例

```
src/
├── domain/            # 领域层
│   ├── word/          # 单词领域
│   │   ├── entities/  # 实体
│   │   ├── repositories/ # 仓储接口
│   │   ├── services/  # 领域服务
│   │   └── value-objects/ # 值对象
│   ├── sentence/      # 句子领域
│   ├── article/       # 文章领域
│   ├── vocabulary/    # 词汇本领域
│   └── practice/      # 练习领域
├── application/       # 应用层
│   ├── word/          # 单词应用服务
│   ├── sentence/      # 句子应用服务
│   ├── article/       # 文章应用服务
│   ├── vocabulary/    # 词汇本应用服务
│   └── practice/      # 练习应用服务
├── infrastructure/    # 基础设施层
│   ├── persistence/   # 持久化实现
│   ├── external-services/ # 外部服务
│   └── cross-cutting/ # 横切关注点
└── presentation/      # 表现层
    ├── api/           # API接口
    ├── web/           # Web界面
    └── mobile/        # 移动端界面
``` 