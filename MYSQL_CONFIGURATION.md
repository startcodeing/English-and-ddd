# MySQL依赖配置
# 请将以下内容添加到pom.xml中

## 1. 添加MySQL版本到properties部分
# 找到<properties>标签，在<mapstruct.version>后添加：
# <mysql.version>8.0.33</mysql.version>

## 2. 添加MySQL Connector依赖到dependencyManagement
# 找到</dependencies>标签，在最后添加：

        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>${mysql.version}</version>
        </dependency>

## 3. 修改application.yml配置
# 请将以下配置替换application.yml中的数据库配置部分

# 当前配置 (H2)：
spring:
  datasource:
    url: jdbc:h2:file:./data/englishLearnPlatform.db
    driver-class-name: org.h2.Driver
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update

# 新配置 (MySQL):
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/english_learning_platform?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_mysql_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    database-platform: org.hibernate.dialect.MySQLDialect
    hibernate:
      ddl-auto: update
      show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: false
        use_sql_comments: true
        jdbc:
          time_zone: Asia/Shanghai

# 生产环境配置（可选）：
# server.port: 8080
# spring.jpa.hibernate.ddl-auto: none
# spring.jpa.show-sql: false
# spring.jpa.properties.hibernate.format_sql: false

## 4. 数据库连接池配置（可选）
# 可以添加HikariCP连接池配置：

spring:
  datasource:
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 30000
      max-lifetime: 1800000
      connection-timeout: 30000
    jpa:
      hibernate:
        connection:
          provider_disables_autocommit: false
          autocommit: true
