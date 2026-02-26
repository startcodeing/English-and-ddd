# English Learning Platform - Docker Deployment Guide

## 概述

本文档提供英语学习平台（English Learning Platform）的完整Docker部署指南，支持MySQL数据库、一键部署、生产环境配置。

## 版本信息

- **应用版本**: 1.0.0-SNAPSHOT
- **Docker版本**: >= 20.10
- **Docker Compose版本**: >= 2.0
- **MySQL版本**: 8.0.33
- **Java版本**: 17
- **Spring Boot版本**: 2.7.14
- **最后更新**: 2024-02-26

---

## 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Docker Host                                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  前端       │  │  后端       │  │  MySQL       │   │
│  │  React       │  │  Spring Boot │  │  8.0         │   │
│  │  :80         │  │  :8080       │  │  :3306        │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
└─────────┼────────────┼────────────┼────────────┼─────────────┘
          │            │            │            │
          └────────────┼────────────┼────────────┘
                       │            │
               ┌────────────┴────────────┐
               │    Nginx :80           │
               └────────────┬────────────┘
                            │
               ┌────────────┴────────────┐
               │   客户端浏览器          │
               └─────────────────────────┘
```

---

## 前置要求

### 系统要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / macOS / Windows 10+
- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0
- **内存**: >= 4GB RAM
- **磁盘**: >= 20GB 可用空间
- **CPU**: >= 2 cores

### 网络要求
- **出站网络**: 稳定的互联网连接
- **防火墙**: 开放端口 80, 443, 8080, 3306, 9090
- **DNS**: 正常的DNS解析

### 依赖服务
- **MySQL**: >= 8.0（Docker镜像包含）
- **Java**: >= 17（Docker镜像包含）
- **Node.js**: >= 16（Docker镜像包含）

---

## 快速开始

### 1. 克隆代码仓库

```bash
# 克隆代码仓库
git clone https://github.com/startcodeing/English-and-ddd.git
cd English-and-ddd
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量
nano .env
```

**必须配置的环境变量**：
```bash
# MySQL数据库配置
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_PASSWORD=your_secure_application_password_here

# Spring后端配置
JVM_XMS=512m
JVM_XMX=1024m
```

### 3. 一键部署（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f
```

**预期输出**：
```
NAME                              STATUS      PORTS
english-learning-frontend         Up          0.0.0.0:80->80/tcp
english-learning-backend          Up          0.0.0.0:8080->8080/tcp
english-learning-mysql            Up          0.0.0.0:3306->3306/tcp
english-learning-mysql-admin      Up          0.0.0.0:8081->3306/tcp
```

### 4. 验证部署

```bash
# 检查前端服务
curl -f "%{http_code}\n" http://localhost/

# 预期输出: 200

# 检查后端服务
curl -f "%{http_code}\n" http://localhost/api/health

# 预期输出: 200

# 检查MySQL服务
docker exec -it english-learning-mysql mysql -uroot -pyour_root_password -e "SELECT VERSION();"

# 预期输出: MySQL 8.0.33
```

---

## 详细部署步骤

### 步骤1：准备环境

#### 检查Docker版本
```bash
docker --version
docker-compose --version
```

**预期输出**：
```
Docker version 20.10.7, build f3432b5
docker-compose version 1.29.2, build unknown
```

#### 检查系统资源
```bash
# 检查可用内存
free -h

# 检查可用磁盘
df -h

# 检查CPU核心
nproc
```

### 步骤2：配置环境变量

#### 创建.env文件
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件
nano .env
```

**关键配置项说明**：
```bash
# MySQL root密码（生产环境必须修改）
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!

# MySQL应用密码（生产环境必须修改）
MYSQL_PASSWORD=YourSecureAppPassword456!

# MySQL数据库名称（建议使用下划线）
MYSQL_DATABASE=english_learning_platform

# MySQL主机地址（Docker内部服务使用mysql）
MYSQL_HOST=mysql

# MySQL端口
MYSQL_PORT=3306

# Spring配置
SPRING_DATASOURCE_USERNAME=english_user
SPRING_DATASOURCE_PASSWORD=YourSecureAppPassword456!
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/english_learning_platform?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai

# 文件存储配置
FILE_STORAGE_ROOT=/app/uploads
FILE_UPLOAD_DIR=/app/uploads
FILE_ACCESS_URL=/files

# 日志配置
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_APP=DEBUG
LOGGING_LEVEL_SPRING_FRAMEWORK=INFO
LOGGING_LEVEL_SPRING_DATA=INFO
LOGGING_LEVEL_SPRING_JPA=INFO
LOGGING_LEVEL_SPRING_HIBERNATE=ERROR
```

### 步骤3：启动服务

#### 使用docker-compose启动所有服务
```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f
```

#### 分别启动服务（调试用）
```bash
# 1. 启动MySQL数据库
docker-compose up -d mysql

# 2. 等待MySQL启动完成
sleep 10
docker-compose logs mysql

# 3. 启动Spring后端
docker-compose up -d backend

# 4. 等待后端启动完成
sleep 20
docker-compose logs backend

# 5. 启动React前端
docker-compose up -d frontend

# 6. 查看所有服务状态
docker-compose ps
```

### 步骤4：运行数据库初始化脚本

```bash
# 运行DDL脚本（建表）
docker exec -i english-learning-mysql mysql -uroot -pyour_root_password < mysql/ddl.sql

# 运行DML脚本（插入初始数据）
docker exec -i english-learning-mysql mysql -uroot -pyour_root_password < mysql/dml.sql

# 验证数据插入
docker exec -it english-learning-mysql mysql -uroot -pyour_root_password -e "USE english_learning_platform; SELECT COUNT(*) AS part_of_speech_count FROM part_of_speech; SELECT COUNT(*) AS word_count FROM word;"
```

**预期输出**：
```
part_of_speech_count: 8
word_count: 30
```

### 步骤5：访问应用

#### 前端访问
```
URL: http://localhost
或: http://your-domain.com
```

#### 后端API访问
```
URL: http://localhost/api
或: http://localhost:8080/api
```

#### MySQL管理访问（phpMyAdmin）
```
URL: http://localhost:8081
用户名: root
密码: your_mysql_password
```

#### 健康检查
```
URL: http://localhost/health
或: http://localhost:8080/actuator/health
```

---

## 生产环境部署

### 安全配置

#### 1. 修改MySQL密码

```bash
# 编辑.env文件
nano .env

# 修改以下配置项为强密码
MYSQL_ROOT_PASSWORD=YourVeryStrongRootPassword123!@#
MYSQL_PASSWORD=YourVeryStrongAppPassword456!@#

# 重启MySQL容器
docker-compose restart mysql
```

#### 2. 配置防火墙

```bash
# 使用UFW防火墙
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 检查防火墙状态
sudo ufw status
```

#### 3. 配置HTTPS

**使用Nginx配置SSL/TLS**：
```bash
# 1. 生成自签名证书（仅用于测试）
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/privkey.pem \
  -out /etc/nginx/ssl/fullchain.pem \
  -subj "/CN=your-domain.com"

# 2. 编辑nginx.conf
nano nginx/nginx.conf

# 3. 更新SSL配置
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}

# 4. 重启Nginx容器
docker-compose restart frontend
```

**使用Let's Encrypt免费证书**：
```bash
# 1. 安装certbot
sudo apt-get install -y certbot

# 2. 生成证书
sudo certbot certonly --standalone \
  --nginx \
  -d your-domain.com \
  --agree-tos \
  --email your-email@domain.com

# 3. 配置Nginx使用证书
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem \
  /etc/nginx/ssl/fullchain.pem

sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem \
  /etc/nginx/ssl/privkey.pem

# 4. 更新nginx.conf配置
sudo nano /etc/nginx/sites-available/your-domain.com

# 5. 重启Nginx
sudo systemctl restart nginx
```

### 性能优化

#### 1. MySQL性能优化

```bash
# 1. 修改MySQL配置文件
nano mysql/my.cnf

# 2. 添加以下配置
[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 1
innodb_flush_method = O_DIRECT
max_connections = 200
query_cache_size = 64M
query_cache_type = 1
thread_cache_size = 64M
thread_cache_size = 256

[mysql]
default-character-set = utf8mb4

[client]
default-character-set = utf8mb4

# 3. 重启MySQL
docker-compose restart mysql
```

#### 2. Spring Boot性能优化

```bash
# 1. 修改JVM参数
nano .env

# 2. 添加以下配置
JVM_XMS=512m
JVM_XMX=1024m
JVM_GC_LOG_LEVEL=INFO
JVM_GC_LOG_FILE=/logs/gc.log
JVM_GC_LOG_FILE_COUNT=10
JVM_GC_LOG_FILE_SIZE=10M

# 3. 重启后端容器
docker-compose restart backend
```

#### 3. Nginx性能优化

```bash
# 1. 编辑nginx.conf
nano nginx/nginx.conf

# 2. 添加以下配置
worker_processes auto;
events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
}

# 3. 重启Nginx
docker-compose restart frontend
```

---

## 监控和维护

### 1. 查看服务状态

```bash
# 查看所有容器状态
docker-compose ps

# 查看容器资源使用
docker stats english-learning-backend
docker stats english-learning-mysql
docker stats english-learning-frontend

# 查看容器日志
docker-compose logs --tail=100 backend
docker-compose logs --tail=100 mysql
docker-compose logs --tail=100 frontend
```

### 2. 数据库维护

```bash
# 备份数据库
docker exec -it english-learning-mysql mysqldump -uroot -pyour_root_password \
  english_learning_platform > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker exec -i english-learning-mysql mysql -uroot -pyour_root_password \
  english_learning_platform < backup_20240126.sql

# 检查数据库表大小
docker exec -it english-learning-mysql mysql -uroot -pyour_root_password -e \
  "SELECT table_name AS 'Table', table_rows AS 'Rows', ROUND(((data_length + index_length) / 1024), 2) AS 'Size (KB)' FROM information_schema.TABLES WHERE table_schema = 'english_learning_platform' ORDER BY (data_length + index_length) DESC;"
```

### 3. 日志管理

```bash
# 查看后端日志
docker-compose logs backend --tail=100 -f

# 查看前端日志
docker-compose logs frontend --tail=100 -f

# 查看MySQL日志
docker-compose logs mysql --tail=100 -f

# 查看Nginx日志
docker-compose logs frontend --tail=100 -f

# 清理日志（Docker会自动处理，但可以手动清理）
docker-compose down -v
```

---

## 故障排查

### 问题1：MySQL容器无法启动

**症状**：MySQL容器反复重启

**解决方案**：
```bash
# 1. 检查MySQL日志
docker-compose logs mysql

# 2. 检查MySQL配置
docker exec -it english-learning-mysql mysql --help

# 3. 检查MySQL数据卷
docker volume ls | grep mysql

# 4. 重启MySQL
docker-compose restart mysql

# 5. 清理MySQL数据卷（如果需要）
docker-compose down -v
docker volume rm english-learning-mysql-data
docker-compose up -d mysql
```

### 问题2：Spring后端无法连接MySQL

**症状**：后端启动时报错："Could not open JDBC connection"

**解决方案**：
```bash
# 1. 检查MySQL是否启动
docker-compose ps mysql

# 2. 检查MySQL日志
docker-compose logs mysql

# 3. 检查MySQL连接
docker exec -it english-learning-mysql mysql -uroot -pyour_root_password -e "SELECT 1;"

# 4. 检查后端配置
docker-compose exec -it english-learning-backend env | grep MYSQL

# 5. 检查后端日志
docker-compose logs backend --tail=50

# 6. 重启后端
docker-compose restart backend
```

### 问题3：前端无法访问后端API

**症状**：前端报错："Network Error" 或 "502 Bad Gateway"

**解决方案**：
```bash
# 1. 检查后端是否启动
docker-compose ps backend

# 2. 检查后端日志
docker-compose logs backend --tail=50

# 3. 检查后端健康检查
curl -f "%{http_code}\n" http://localhost:8080/actuator/health

# 4. 检查Nginx配置
docker-compose logs frontend --tail=50

# 5. 重启服务
docker-compose restart backend
docker-compose restart frontend
```

### 问题4：端口冲突

**症状**：端口已被占用（80、8080、3306）

**解决方案**：
```bash
# 1. 检查端口占用
sudo netstat -tulpn | grep -E ":80|:8080|:3306"

# 2. 杀死占用端口的进程
sudo kill -9 $(sudo lsof -t -i :80 | awk 'NR!=1 {print $2}')

# 3. 修改docker-compose.yml中的端口映射
nano docker-compose.yml

# 4. 重新启动服务
docker-compose down
docker-compose up -d
```

### 问题5：内存不足

**症状**：容器因内存不足被杀掉

**解决方案**：
```bash
# 1. 检查系统内存使用
free -h

# 2. 检查容器内存使用
docker stats --no-stream | grep english-learning

# 3. 调整JVM内存参数
nano .env

# 4. 调整Docker内存限制
nano docker-compose.yml

# 5. 重启服务
docker-compose restart backend
docker-compose restart mysql
```

---

## 备份和恢复

### 数据库备份

```bash
# 完整备份（包括数据、结构、存储过程）
docker exec -it english-learning-mysql mysqldump -uroot -pyour_root_password \
  --all-databases \
  --routines \
  --events \
  english_learning_platform > backup_full_$(date +%Y%m%d).sql

# 仅数据备份（不含结构和存储过程）
docker exec -it english-learning-mysql mysqldump -uroot -pyour_root_password \
  --no-create-info \
  --no-routines \
  --no-events \
  english_learning_platform > backup_data_$(date +%Y%m%d).sql

# 仅结构备份（不含数据）
docker exec -it english-learning-mysql mysqldump -uroot -pyour_root_password \
  --no-data \
  --no-create-info \
  --no-routines \
  --no-events \
  english_learning_platform > backup_schema_$(date +%Y%m%d).sql
```

### 文件备份

```bash
# 备份上传的文件
docker run --rm -v $(pwd)/backups:/backups \
  -v $(pwd)/boot/uploads:/source:ro \
  alpine tar czf backups/uploads_$(date +%Y%m%d).tar.gz /source

# 备份所有数据（包括数据库和文件）
docker run --rm -v $(pwd)/backups:/backups \
  alpine sh -c "tar czf backups/english-learning-platform_$(date +%Y%m%d).tar.gz /data"
```

### 数据恢复

```bash
# 恢复完整备份
docker exec -i english-learning-mysql mysql -uroot -pyour_root_password \
  english_learning_platform < backup_full_20240126.sql

# 恢复仅数据
docker exec -i english-learning-mysql mysql -uroot -pyour_root_password \
  english_learning_platform < backup_data_20240126.sql

# 恢复仅结构
docker exec -i english-learning-mysql mysql -uroot -pyour_root_password \
  english_learning_platform < backup_schema_20240126.sql
```

---

## 安全检查清单

### 部署前检查

- [ ] 所有密码都已修改为强密码
- [ ] 所有配置项都已正确填写
- [ ] 防火墙已正确配置
- [ ] SSL/TLS证书已配置
- [ ] 数据库备份计划已制定
- [ ] 监控和告警已配置

### 部署后检查

- [ ] 所有服务都正常运行
- [ ] 数据库连接正常
- [ ] 文件上传功能正常
- [ ] API端点可访问
- [ ] 健康检查端点正常
- [ ] 日志正常记录
- [ ] 监控指标正常采集

---

## 更新和维护

### 升级应用

```bash
# 1. 拉取最新代码
git pull origin master

# 2. 停止服务
docker-compose down

# 3. 重新构建和启动服务
docker-compose up -d --build

# 4. 运行数据库迁移（如果有）
docker exec -it english-learning-backend java -jar /app/app.jar --spring.liquibase.enabled=true

# 5. 验证升级
curl -f "%{http_code}\n" http://localhost/health
```

### 回滚应用

```bash
# 1. 查看Docker镜像历史
docker images | grep english-learning

# 2. 停止服务
docker-compose down

# 3. 使用特定镜像启动服务
docker-compose up -d --backend.backend=english-learning-backend:previous-version

# 4. 验证回滚
curl -f "%{http_code}\n" http://localhost/health
```

---

## 技术支持

### 联系方式
- **Email**: support@english-learning-platform.com
- **GitHub Issues**: https://github.com/startcodeing/English-and-ddd/issues
- **Discord社区**: https://discord.gg/english-learning-platform

### 常见问题
- **问题**: 容器无法启动
  - **解决**: 检查Docker日志，确认环境变量配置正确，检查端口冲突

- **问题**: 数据库连接失败
  - **解决**: 确认MySQL服务已启动，检查数据库用户和密码配置正确

- **问题**: 文件上传失败
  - **解决**: 检查文件大小限制，检查文件存储目录权限，检查磁盘空间

---

**文档版本**: v1.0.0
**最后更新**: 2024-02-26
**维护者**: English Learning Platform Team
