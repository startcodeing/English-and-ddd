# 英语学习应用的Spring Boot工程划分方案

## 1. 总体架构

采用面向DDD的多模块Spring Boot架构，基于混合架构方案(CRUD+事件溯源)进行工程划分。

```
english-learning-platform/
├── common/ (公共模块)
├── infrastructure/ (基础设施)
├── domain/ (领域模块)
├── application/ (应用服务)
├── interfaces/ (接口层)
└── boot/ (启动模块)
```

## 2. 模块划分详情

### 2.1 common (公共模块)

通用工具、共享常量、基础异常等

```
common/
├── src/main/java/com/englishlearning/common/
│   ├── constants/ (常量定义)
│   ├── enums/ (枚举定义)
│   ├── exceptions/ (异常类)
│   ├── utils/ (工具类)
│   └── types/ (基础值对象)
```

### 2.2 infrastructure (基础设施模块)

负责技术实现细节，如持久化、消息队列、事件存储等

```
infrastructure/
├── infrastructure-db/ (数据库相关)
│   ├── src/main/java/com/englishlearning/infrastructure/db/
│   │   ├── config/ (数据库配置)
│   │   ├── repository/ (存储库实现)
│   │   ├── converter/ (实体映射转换器)
│   │   ├── po/ (持久化对象)
│   │   └── mapper/ (MyBatis Mapper)
│   └── src/main/resources/
│       └── mapper/ (MyBatis XML)
│
├── infrastructure-event/ (事件相关)
│   ├── src/main/java/com/englishlearning/infrastructure/event/
│   │   ├── config/ (事件配置)
│   │   ├── store/ (事件存储)
│   │   ├── publisher/ (事件发布器)
│   │   ├── subscriber/ (事件订阅器)
│   │   └── serializer/ (事件序列化)
│
├── infrastructure-message/ (消息队列)
│   ├── src/main/java/com/englishlearning/infrastructure/message/
│   │   ├── config/ (消息队列配置)
│   │   ├── producer/ (消息生产者)
│   │   └── consumer/ (消息消费者)
│
└── infrastructure-integration/ (三方集成)
    └── src/main/java/com/englishlearning/infrastructure/integration/
        └── client/ (外部服务客户端)
```

### 2.3 domain (领域模块)

包含所有领域模型、领域服务、领域事件定义等

```
domain/
├── domain-vocabulary/ (词汇管理领域)
│   ├── src/main/java/com/englishlearning/domain/vocabulary/
│   │   ├── model/ (领域模型)
│   │   │   ├── entity/ (实体)
│   │   │   ├── valueobject/ (值对象)
│   │   │   └── aggregate/ (聚合)
│   │   ├── service/ (领域服务)
│   │   ├── event/ (领域事件定义)
│   │   └── repository/ (仓储接口)
│
├── domain-content/ (内容管理领域)
│   ├── src/main/java/com/englishlearning/domain/content/
│   │   ├── model/
│   │   ├── service/
│   │   ├── event/
│   │   └── repository/
│
├── domain-dictation/ (听写测试领域)
│   ├── src/main/java/com/englishlearning/domain/dictation/
│   │   ├── model/
│   │   ├── service/
│   │   ├── event/
│   │   ├── repository/
│   │   └── command/ (命令对象)
│
└── domain-writing/ (写作练习领域)
    └── src/main/java/com/englishlearning/domain/writing/
        ├── model/
        ├── service/
        ├── event/
        ├── repository/
        └── command/
```

### 2.4 application (应用服务模块)

包含所有应用服务、命令处理器、查询服务等

```
application/
├── application-vocabulary/ (词汇应用服务)
│   ├── src/main/java/com/englishlearning/application/vocabulary/
│   │   ├── service/ (应用服务)
│   │   ├── assembler/ (DTO转换器)
│   │   └── dto/ (数据传输对象)
│
├── application-content/ (内容应用服务)
│   ├── src/main/java/com/englishlearning/application/content/
│   │   ├── service/
│   │   ├── assembler/
│   │   └── dto/
│
├── application-dictation/ (听写应用服务)
│   ├── src/main/java/com/englishlearning/application/dictation/
│   │   ├── service/
│   │   ├── commandhandler/ (命令处理器)
│   │   ├── assembler/
│   │   ├── dto/
│   │   └── query/ (查询服务)
│
└── application-writing/ (写作应用服务)
    └── src/main/java/com/englishlearning/application/writing/
        ├── service/
        ├── commandhandler/
        ├── assembler/
        ├── dto/
        └── query/
```

### 2.5 interfaces (接口层模块)

Web API、消息处理、计划任务等

```
interfaces/
├── interfaces-api/ (REST API接口)
│   ├── src/main/java/com/englishlearning/interfaces/api/
│   │   ├── vocabulary/ (词汇管理API)
│   │   │   ├── controller/
│   │   │   ├── request/
│   │   │   ├── response/
│   │   │   └── assembler/
│   │   ├── content/ (内容管理API)
│   │   ├── dictation/ (听写测试API)
│   │   ├── writing/ (写作练习API)
│   │   ├── config/ (Web配置)
│   │   ├── advice/ (异常处理)
│   │   └── security/ (安全配置)
│
├── interfaces-message/ (消息处理接口)
│   └── src/main/java/com/englishlearning/interfaces/message/
│       ├── handler/ (消息处理器)
│       └── listener/ (消息监听器)
│
└── interfaces-scheduler/ (计划任务)
    └── src/main/java/com/englishlearning/interfaces/scheduler/
        └── job/ (定时任务)
```

### 2.6 boot (启动模块)

应用程序启动、配置集成等

```
boot/
├── src/main/java/com/englishlearning/
│   ├── EnglishLearningApplication.java (启动类)
│   └── config/ (应用配置)
│
└── src/main/resources/
    ├── application.yml (主配置文件)
    ├── application-dev.yml (开发环境配置)
    ├── application-test.yml (测试环境配置)
    └── application-prod.yml (生产环境配置)
```

## 3. 架构切分策略

### 3.1 CRUD部分设计

针对基础管理功能(词性、单词基础信息等)，采用经典的Spring Data JPA方式实现：

1. **领域层**:
   - 定义实体、值对象和仓储接口
   - 不包含持久化细节

2. **基础设施层**:
   - 实现领域仓储接口
   - 使用JPA/MyBatis进行ORM映射

3. **应用层**:
   - 提供应用服务
   - 事务控制
   - 协调领域对象

### 3.2 事件溯源部分设计

针对学习行为追踪功能，采用命令-事件模式，结合CQRS实现：

1. **命令处理**:
   - 定义命令对象
   - 实现命令处理器
   - 命令验证

2. **事件处理**:
   - 定义事件模型
   - 实现事件处理器
   - 更新读模型

3. **查询服务**:
   - 实现专用查询服务
   - 读模型优化

## 4. 项目依赖关系

遵循依赖倒置原则，确保核心业务逻辑不依赖技术实现细节。

```
interfaces → application → domain ← infrastructure
                         ↘           ↗
                           common ←
```

- domain不依赖其他模块(除common外)
- application依赖domain
- interfaces依赖application
- infrastructure实现domain中定义的接口

## 5. Spring Boot配置建议

### 5.1 CRUD部分

```java
@Configuration
@EnableJpaRepositories(basePackages = {
    "com.englishlearning.infrastructure.db.repository.crud"
})
@EntityScan(basePackages = {
    "com.englishlearning.infrastructure.db.po.crud"
})
public class CrudDbConfig {
    // 配置数据源、事务管理器等
}
```

### 5.2 事件溯源部分

```java
@Configuration
public class EventSourcingConfig {
    @Bean
    public EventStore eventStore() {
        // 配置事件存储
    }
    
    @Bean
    public EventBus eventBus() {
        // 配置事件总线
    }
    
    @Bean
    public SnapshotRepository snapshotRepository() {
        // 配置快照存储
    }
}
```

## 6. 特殊技术点实现

### 6.1 CRUD与事件溯源的集成

1. **领域事件发布**
   
```java
@Service
public class WordServiceImpl implements WordService {
    
    private final WordRepository wordRepository;
    private final DomainEventPublisher eventPublisher;
    
    @Transactional
    public Word createWord(Word word) {
        Word savedWord = wordRepository.save(word);
        // 发布领域事件
        eventPublisher.publish(new WordCreatedEvent(savedWord.getId(), savedWord.getSpelling()));
        return savedWord;
    }
}
```

2. **事件订阅**

```java
@Component
public class WordEventSubscriber {
    
    private final LearningProgressService learningProgressService;
    
    @EventListener
    public void handleWordCreatedEvent(WordCreatedEvent event) {
        // 处理事件逻辑
        learningProgressService.initializeWordLearningStatus(event.getWordId());
    }
}
```

### 6.2 事件溯源实现示例

```java
@Service
public class DictationCommandHandler {
    
    private final EventStore eventStore;
    
    public void handle(StartDictationTestCommand command) {
        // 创建聚合根或加载现有聚合根
        DictationTest test = new DictationTest(command.getTestId());
        
        // 执行命令
        test.start(command.getUserId(), command.getContentType(), command.getContentId());
        
        // 保存事件
        eventStore.saveEvents(command.getTestId(), test.getUncommittedEvents());
    }
}

// 聚合根
public class DictationTest extends AggregateRoot {
    
    private String id;
    private String userId;
    private DictationStatus status;
    
    public void start(String userId, String contentType, String contentId) {
        // 业务逻辑验证
        
        // 应用事件
        applyEvent(new DictationTestStartedEvent(id, userId, contentType, contentId));
    }
    
    public void apply(DictationTestStartedEvent event) {
        this.id = event.getTestId();
        this.userId = event.getUserId();
        this.status = DictationStatus.STARTED;
    }
}
```

## 7. 模块间通信

### 7.1 同步调用

使用应用服务接口进行模块间的同步调用:

```java
@Service
public class DictationServiceImpl implements DictationService {
    
    private final WordService wordService; // 来自vocabulary模块
    
    public void startDictation(StartDictationRequest request) {
        // 从词汇模块获取单词信息
        WordDTO word = wordService.getWordById(request.getWordId());
        // 处理听写逻辑
    }
}
```

### 7.2 异步通信

使用事件总线进行模块间的异步通信:

```java
// 发布者
@Component
public class DictationEventPublisher {
    
    private final EventBus eventBus;
    
    public void publishDictationCompletedEvent(DictationCompletedEvent event) {
        eventBus.publish(event);
    }
}

// 订阅者
@Component
public class LearningProgressEventHandler {
    
    @EventListener
    public void onDictationCompleted(DictationCompletedEvent event) {
        // 更新学习进度
    }
}
```

## 8. 部署与扩展

### 8.1 单体应用部署

初期可以将所有模块打包为单体应用部署:

```
boot模块依赖所有其他模块，构建单一JAR包
```

### 8.2 微服务演进

随着业务增长，可以将模块拆分为独立微服务:

```
词汇管理服务: domain-vocabulary + application-vocabulary + interfaces-api(vocabulary部分)
内容管理服务: domain-content + application-content + interfaces-api(content部分)
听写测试服务: domain-dictation + application-dictation + interfaces-api(dictation部分)
写作练习服务: domain-writing + application-writing + interfaces-api(writing部分)
```

## 9. 开发流程建议

根据混合架构的实施路线图，建议以下开发流程:

1. **第一阶段**: 实现基础CRUD功能
   - 开发词性、单词、单词本等基础管理模块
   - 采用标准Spring Boot + JPA开发

2. **第二阶段**: 设计和实现事件机制
   - 开发事件发布/订阅基础设施
   - 为CRUD操作添加事件发布

3. **第三阶段**: 实现核心事件溯源功能
   - 开发听写测试和学习状态追踪
   - 采用完整的命令-事件-查询分离模式

4. **第四阶段**: 实现高级功能
   - 开发写作和综合测试模块
   - 完善事件溯源架构 