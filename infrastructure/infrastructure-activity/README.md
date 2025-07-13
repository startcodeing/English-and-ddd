# 活动记录模块事件处理机制

本模块实现了用户活动的记录功能，支持通过不同的事件处理机制来响应系统中的领域事件。

## 架构设计

### 事件处理

活动记录模块支持两种事件处理实现方式：

- 基于Spring的事件处理：位于`domain-activity`模块中的`UserActivityEventListener`类，使用Spring的`@EventListener`注解
- 基于Axon Framework的事件处理：位于`infrastructure-activity`模块中的`AxonUserActivityEventHandler`类，使用Axon的`@EventHandler`注解

通过Spring的Profile机制来选择激活哪种实现：

- `spring-event-handler`: 激活基于Spring的事件处理器
- `axon-event-handler`: 激活基于Axon的事件处理器

## 配置说明

在`application-event.properties`文件中配置：

```properties
# 激活的事件处理器配置文件
spring.profiles.active=spring-event-handler
```

## 切换方式

### 使用Spring事件处理机制

```properties
spring.profiles.active=spring-event-handler
```

### 使用Axon Framework事件处理机制

```properties
spring.profiles.active=axon-event-handler
```

## 扩展说明

如需添加新的事件类型的处理，需要：

1. 在`UserActivityEventListener`中添加对应的`@EventListener`方法
2. 在`AxonUserActivityEventHandler`中添加对应的`@EventHandler`方法

两个处理器中的方法应保持功能一致，只是使用不同的注解和处理机制。