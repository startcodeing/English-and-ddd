# 事件发布与处理机制

本项目实现了可插拔的事件发布与处理机制，支持在Spring和Axon Framework之间进行切换。

## 架构设计

### 事件发布

事件发布采用了策略模式，通过`DomainEventPublisher`接口定义统一的事件发布行为：

- `SpringEventPublisher`: 基于Spring的`ApplicationEventPublisher`实现
- `AxonEventPublisher`: 基于Axon Framework的`EventBus`实现

通过`EventPublisherConfig`配置类和配置属性`event.publisher.type`来选择使用哪种实现。

### 事件处理

事件处理同样支持两种实现方式：

- `UserActivityEventListener`: 基于Spring的`@EventListener`注解实现，使用`@Profile("spring-event-handler")`标记
- `AxonUserActivityEventHandler`: 基于Axon Framework的`@EventHandler`注解实现，使用`@Profile("axon-event-handler")`标记

通过Spring的Profile机制来选择激活哪种实现。

## 配置说明

在`application-event.properties`文件中配置：

```properties
# 事件发布器类型: spring 或 axon
event.publisher.type=spring

# 激活的事件处理器配置文件
spring.profiles.active=spring-event-handler
```

## 切换方式

### 使用Spring事件机制

```properties
event.publisher.type=spring
spring.profiles.active=spring-event-handler
```

### 使用Axon Framework事件机制

```properties
event.publisher.type=axon
spring.profiles.active=axon-event-handler
```

## 扩展说明

如需添加新的事件类型，需要：

1. 在领域模块中定义事件类
2. 在领域模块中定义事件发布器接口
3. 在基础设施模块中实现事件发布器接口
4. 在`UserActivityEventListener`和`AxonUserActivityEventHandler`中添加对应的事件处理方法