# 英语学习平台（English Learning Platform）

一个结合领域驱动设计（DDD）的英语学习与内容管理系统，采用“CRUD + 事件溯源”的混合架构，覆盖词汇与内容管理、听写与写作练习、综合测试与学习行为追踪等核心场景。项目以零警告、清晰命名、完善测试为目标，前端基于 React 18 + Vite + Ant Design，后端基于 Spring Boot 2.7.14 + JDK 17 + JPA/Hibernate，并可在 Spring Event 与 Axon Framework 两种事件机制间切换。

## 项目概述

- 背景与需求：英语学习过程需要大量的词汇与内容管理，同时需要可重复的练习与测试来巩固学习效果。本项目旨在构建一个“一站式”的学习与管理平台，既能满足后台管理，又能支持学习端的练习与进度追踪。
- 核心问题：统一管理词性/单词/句子/文章等内容；支持听力与写作练习；记录与分析学习行为；为后续 AI 辅助学习与数据分析打下基础。
- 目标用户：
  - 管理端用户：维护词汇与内容、发布练习与测试资源。
  - 学习端用户：基于管理内容进行学习、练习与测试，查看学习历史与统计。
- 主要价值：
  - 结构化的内容管理（词性、单词、句子、文章、语法分析、听力资料、写作主题）。
  - 完整练习闭环（听写、写作、综合测试）与学习行为事件记录。
  - 可插拔事件发布与处理机制（Spring/Axon），为读模型与分析扩展提供基础。

## 功能模块说明

> 下述模块均已在设计文档与代码中落地，模块之间遵循限界上下文划分与依赖倒置原则。

- 词性管理：维护英语词性的基础信息、用法总结与常用短语/搭配。
- 单词管理：维护单词的拼写、词义（含词性引用）、同/反义词与例句。
- 单词本管理：组织学习用的单词集合，支持添加/移除单词与备注。
- 句子管理：维护句子及中文释义、语法分析与变体表示方式。
- 文章管理：维护文章内容与出处，并与句子进行关联管理。
- 写作主题管理：为写作练习提供题目来源、难度、字数/时间限制等信息。
- 语法分析：维护语法专题的 Markdown 富文本内容（列表、编辑、删除）。
- 听力资料管理：维护听力音频与原文、难度、文件大小与时长，支持文件上传与本地存储（可扩展至 OSS）。
- 听写练习：选择听力资料进行听写，支持音频播放、进度条与富文本输入，保存结果并分析。
- 写作练习：选择写作主题进行写作，支持 Markdown 编辑与倒计时自动提交。
- 综合测试：从单词本/文章/句子组合生成测试，保存与统计测试结果。
- 学习行为与活动：通过事件记录用户的学习行为，支持 Spring/Axon 两种事件处理实现。

架构图与领域模型（PlantUML）：

- 限界上下文与聚合关系图：`DesignDocument/领域边界划分最终版.puml`
- 命令与聚合关系图：`DesignDocument/领域模型命令详细和领域之间的关系.puml`

使用方式：安装 PlantUML 或在线渲染，将 `.puml` 文件载入即可查看。

## 技术栈说明

后端（Java 17 / Spring Boot 2.7.14）：

- 框架与库：`Spring Boot 2.7.14`、`Spring Data JPA`、`Hibernate`、`Axon Framework 4.7.4`、`Spring Event`
- 语言与工具：`JDK 17`、`Lombok 1.18.26`、`MapStruct 1.5.3.Final`、`Maven`
- 数据库：`H2`（内置文件数据库，默认用于开发），可切换至 `PostgreSQL/MySQL`
- 其它：存在 `MyBatis 2.3.1` 依赖（部分场景可用），事件发布机制支持 Spring/Axon 可插拔切换

前端（React 18 / Vite）：

- 框架与库：`React 18.2.0`、`Vite 4.4.x`、`TypeScript 5.x`、`Ant Design 5.25.x`、`Axios 1.9.x`、`React Router 6.x`
- Markdown 编辑器：`react-markdown-editor-lite` + `markdown-it`
- 状态管理：`Redux Toolkit 2.x`（部分页面）
- 测试：`Jest` + `@testing-library/react`

版本要求与环境：

- JDK ≥ `17`
- Maven ≥ `3.8`
- Node.js ≥ `16`（推荐 `18+`）
- 现代浏览器（Chrome/Edge/Firefox 最新版）

## 部署与开发指南

### 本地开发（推荐）

后端（启动所有模块）

1. 安装 JDK 17 与 Maven。
2. 在项目根目录执行：
   ```bash
   mvn clean package -DskipTests
   ```
3. 启动应用（推荐以 boot 模块聚合启动）：
   ```bash
   mvn -pl boot -am spring-boot:run
   # 或
   mvn -f boot/pom.xml spring-boot:run
   ```
4. 默认使用本地 H2 文件数据库，端口 `8080`，可在 `application.yml/properties` 中调整。

示例（application.properties）：

```properties
server.port=8080

# H2 文件数据库（开发环境）
spring.datasource.url=jdbc:h2:file:./data/englishLearnPlatform.db
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update

# 事件发布与处理（可在 Spring/Axon 之间切换）
event.publisher.type=spring
spring.profiles.active=spring-event-handler

# 文件存储目录（听力资料/上传文件）
file.storage.root=./boot/uploads
```

前端（管理端 UI）

1. 切换到 `frontend/` 目录：
   ```bash
   cd frontend
   npm install
   ```
2. 配置环境变量（Vite 前缀为 `VITE_`），创建 `.env.local`：
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
4. 构建与预览：
   ```bash
   npm run build
   npm run preview
   ```

前端（用户端 Demo/客户端）

- 路径：`frontend_client/`（同样采用 React + Vite），按该目录的 `README.md` 指南进行开发/预览。

### 生产部署（参考）

后端部署

1. 选择生产数据库（推荐 `PostgreSQL/MySQL`），并在配置文件中设置：
   ```properties
   spring.datasource.url=jdbc:postgresql://<host>:<port>/<db>
   spring.datasource.username=<user>
   spring.datasource.password=<password>
   spring.jpa.hibernate.ddl-auto=none
   spring.jpa.show-sql=false
   ```
2. 事件机制选择（根据需要选择 Axon 或 Spring）：
   ```properties
   event.publisher.type=axon
   spring.profiles.active=axon-event-handler
   ```
3. 文件存储：将 `file.storage.root` 指向持久化目录或挂载到对象存储接入层。
4. 构建与运行：
   ```bash
   mvn clean package
   java -jar boot/target/boot-*.jar --spring.config.location=classpath:/,file:./application-prod.properties
   ```

前端部署

1. 在 `frontend/` 目录构建静态资源：
   ```bash
   npm ci
   npm run build
   ```
2. 将 `dist/` 上传至静态服务器（Nginx/Apache/Vercel 等）。
3. 设置环境变量（构建时）：`VITE_API_BASE_URL=https://your-domain/api`。

## 环境变量与配置文件

- 后端关键配置：
  - `event.publisher.type`：`spring` 或 `axon`（事件发布器类型）
  - `spring.profiles.active`：`spring-event-handler` 或 `axon-event-handler`（事件处理实现）
  - `file.storage.root`：文件本地存储根目录（默认 `./boot/uploads`）
  - `spring.datasource.*`：数据库连接配置（开发用 H2，生产推荐 PostgreSQL/MySQL）
- 前端：
  - `VITE_API_BASE_URL`：后端 API 基地址（示例：`http://localhost:8080`）

## 项目目录结构

```
english-learning-platform/
├── common/                 # 公共模块（常量、异常、工具、基础值对象）
├── domain/                 # 领域层（Vocabulary/Content/Activity/Practice）
├── application/            # 应用服务层（用例与协调）
├── infrastructure/         # 基础设施层（DB、事件、文件等实现）
├── interfaces/             # 接口层（REST API 控制器）
├── boot/                   # 启动聚合模块（Spring Boot 启动与统一配置）
├── frontend/               # 管理端前端（React + Vite + Ant Design）
├── frontend_client/        # 学习端前端（Demo/客户端）
├── DesignDocument/         # 架构与领域模型设计文档（含 PlantUML）
└── data/                   # H2 文件数据库（开发环境默认）
```

## 代码规范与贡献指南

- 命名与风格：
  - 统一使用 `PascalCase / camelCase`，命名语义清晰。
  - 关键模块与函数使用中文 Javadoc 风格注释。
- 质量要求：
  - TypeScript/Java/ESLint 均以零警告为目标。
  - 强调单元与集成测试覆盖率（后端 `JUnit`，前端 `Jest/RTL`）。
- 前端规范：函数式组件、职责明确、避免复杂副作用；运行 `npm run lint` 保持无警告。
- 提交流程：
  - 分支：`feature/<name>` / `fix/<name>` / `docs/<name>`。
  - 提交信息：建议遵循 Conventional Commits（如 `feat: ...` / `fix: ...`）。
  - 在 PR 中说明变更范围与影响，确保通过 CI 与测试。

## 测试

- 后端：
  ```bash
  mvn test
  ```
- 前端：
  ```bash
  cd frontend
  npm test
  ```

## 许可证

本项目暂未设置正式许可证，默认仅用于学习与内部使用。如需开源或对外分发，请在项目根目录添加 `LICENSE` 文件（推荐 `MIT` 或 `Apache-2.0`），并在本 README 中更新说明。

## 联系与反馈

- 问题反馈：请在项目 Issue 中提交（或在企业内使用对应的缺陷管理系统）。
- 技术支持与交流：可在 `DesignDocument/` 目录的相关文档中查看架构与实现细节；如需进一步支持，请联系维护者或在团队沟通渠道中 @项目负责人。

——

如需了解从 CRA 到 Vite 的迁移细节，请参考 `frontend/MIGRATION-GUIDE.md`；事件机制切换与活动记录说明参考 `infrastructure-event/README.md` 与 `infrastructure-activity/README.md`。
learn engish and ddd
