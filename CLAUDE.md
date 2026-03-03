# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an English Learning Platform built with Domain-Driven Design (DDD) principles, using a hybrid architecture combining traditional CRUD for content management with Event Sourcing for learning activity tracking. The backend uses Java 17 + Spring Boot 2.7.14, and the frontend uses React 18 + Vite + Ant Design.

**Key Architecture Characteristics:**
- **DDD Layered Architecture**: Domain → Application → Infrastructure → Interfaces → Boot
- **Hybrid Persistence**: CRUD mode for vocabulary/content, Event Sourcing for learning behaviors
- **Pluggable Event System**: Switch between Spring Event or Axon Framework via profiles
- **Bounded Contexts**: Vocabulary, Content, Practice, and Activity

## Common Development Commands

### Backend Development

```bash
# Build all modules (skip tests for faster iteration)
mvn clean package -DskipTests

# Run the application (from boot module, includes all dependencies)
mvn -pl boot -am spring-boot:run
# Alternative:
mvn -f boot/pom.xml spring-boot:run

# Run tests
mvn test

# Run specific module tests
mvn -pl domain-vocabulary test
```

**Backend runs on port 8080 by default.**

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 3000, proxies to backend on 8080)
npm run dev

# Build for production
npm run build

# Lint code (zero warnings goal)
npm run lint

# Run tests
npm test
```

### Docker Deployment

```bash
# Start all services (MySQL, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## Architecture & Module Structure

### Module Organization

```
english-learning-platform/
├── common/                    # Shared constants, exceptions, utilities
├── domain/                    # Core business logic (no external dependencies)
│   ├── domain-vocabulary/     # PartOfSpeech, Word, WordBook entities
│   ├── domain-content/        # Sentence, Article, ListeningMaterial, WritingTopic
│   ├── domain-practice/       # DictationPractice, WritingPractice
│   └── domain-activity/       # UserActivity tracking
├── application/               # Use cases and orchestration
│   ├── application-vocabulary/
│   ├── application-content/
│   └── application-practice/
├── infrastructure/            # Technical implementations
│   ├── infrastructure-db/     # JPA repositories, PO mappers
│   ├── infrastructure-event/  # Event publishing (Spring/Axon)
│   ├── infrastructure-activity/ # Activity persistence
│   └── infrastructure-file/   # File storage service
├── interfaces/                # REST controllers
│   ├── interfaces-vocabulary/
│   ├── interfaces-content/
│   ├── interfaces-activity/
│   └── interfaces-practice/
├── boot/                      # Spring Boot application entry point
└── frontend/                  # React admin UI
```

### Dependency Flow

**Interfaces → Application → Domain ← Infrastructure**

This enforces dependency inversion: infrastructure implements interfaces defined in the domain layer.

### Key DDD Patterns

**Aggregates & Aggregate Roots:**
- `Word` (root) contains `List<WordMeaning>`
- `WordBook` (root) contains word references
- `Sentence` and `Article` are separate aggregates with `SentenceVariant` value objects
- `DictationPractice` and `WritingPractice` for learning activities

**Domain Events:**
- Each bounded context has its own event publisher interface (e.g., `WordEventPublisher`, `SentenceEventPublisher`)
- Events are published via `DomainEventPublisher` abstraction
- Switch between implementations with `spring.profiles.active`: `spring-event-handler` (default) or `axon-event-handler`

**Repositories:**
- Interface defined in domain layer (e.g., `domain-vocabulary/src/main/java/.../repository/WordRepository.java`)
- Implementation in infrastructure layer (e.g., `infrastructure-db/src/main/java/.../repository/impl/WordRepositoryImpl.java`)
- Uses MapStruct for PO ↔ Entity mapping

## Configuration

### Event System Configuration

**application.yml:**
```yaml
spring:
  profiles:
    active: spring-event-handler  # or axon-event-handler
```

**Event Publisher Types:**
- `spring`: Uses Spring's `ApplicationEventPublisher` (simpler, in-memory)
- `axon`: Uses Axon Framework (distributed, supports event sourcing)

### Database Configuration

**Development (H2 file-based):**
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/englishLearnPlatform.db
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: update
```

**Production (MySQL):**
```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/english_learning_platform
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: none  # Use SQL migrations instead
```

### File Storage

**Local storage** (development):
```yaml
file:
  upload-dir: uploads
  access-url: /files
```

**Docker volume mount** (production):
```yaml
volumes:
  - ./boot/uploads:/app/uploads
```

## Frontend Architecture

**Key Patterns:**
- Functional components with hooks
- Ant Design for UI components
- Axios for API calls (centralized in `@api`)
- Path aliases configured: `@`, `@api`, `@components`, `@pages`, etc.
- Environment variables prefixed with `VITE_`

**API Proxy:**
The Vite dev server proxies `/api` requests to `http://localhost:8080`.

## Testing Approach

**Backend (JUnit):**
- Domain entities: Unit tests for business logic invariants
- Application services: Integration tests with mocked repositories
- Controllers: Integration tests with `@SpringBootTest` and `@AutoConfigureMockMvc`

**Frontend (Jest + RTL):**
- Component tests with `@testing-library/react`
- Test utilities and hooks in `@tests`

## Code Style & Conventions

**Java:**
- Use Lombok for boilerplate (`@Data`, `@Builder`, etc.)
- MapStruct for DTO/Entity mapping
- Repository interfaces return `Optional<T>` for single results
- Domain entities enforce invariants (e.g., `Word.addMeaning()` prevents duplicate part-of-speech)

**TypeScript/React:**
- Functional components with `useState`, `useEffect`
- Avoid class components
- Keep components focused and composable

**Naming:**
- Entities: PascalCase (e.g., `WordBook`)
- Repository methods: camelCase descriptive (e.g., `findBySpellingContaining`)
- API endpoints: kebab-case (e.g., `/api/vocabulary/words`)

## Important Notes

1. **Zero Warnings Goal**: Both Java (compiler) and TypeScript (ESLint) aim for zero warnings
2. **Event Handler Profiles**: Always check `spring.profiles.active` to understand which event mechanism is active
3. **Aggregate Boundaries**: Respect aggregate roots—don't directly modify entities from another aggregate
4. **File Uploads**: Audio files and other uploads stored locally in `boot/uploads` (dev) or `/app/uploads` (Docker)
5. **H2 Console**: Available at `http://localhost:8080/h2-console` in dev mode

## Design Documentation

See `DesignDocument/` directory for:
- `领域驱动设计分析最终版.md` - DDD analysis and bounded contexts
- `混合架构方案.md` - Hybrid CRUD + Event Sourcing architecture rationale
- PlantUML diagrams for bounded contexts and aggregate relationships
