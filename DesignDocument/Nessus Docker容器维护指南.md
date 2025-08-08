# Nessus Docker容器维护指南

## 1. 概述
本指南旨在帮助测试团队快速诊断和解决Nessus Docker容器的常见问题，提供标准化的故障排查流程。

## 2. 前置条件
- 已安装Docker环境
- 具备基本的Docker命令操作权限
- 了解Nessus容器的基本配置信息

## 3. 故障排查流程

### 3.1 检查容器状态

#### 步骤1：查看所有容器状态
```bash
docker ps -a
```

#### 可能的情况及处理方式：

**情况A：容器正常运行**
- 状态显示：`Up X minutes/hours`
- 处理：容器运行正常，可进行后续检查
- 截图说明：显示Nessus容器状态为Up的完整docker ps输出

**情况B：容器已停止**
- 状态显示：`Exited (X) Y minutes/hours ago`
- 处理：需要重启容器，跳转到3.2节
- 截图说明：显示Nessus容器状态为Exited的docker ps输出

**情况C：未找到Nessus容器**
- 状态显示：列表中无Nessus相关容器
- 处理：需要创建新容器，跳转到3.3节
- 截图说明：显示docker ps输出中无Nessus容器的情况

### 3.2 重启已存在的容器

#### 适用场景：
- 容器存在但状态为停止(Exited)
- 容器运行异常需要重启

#### 操作步骤：

**步骤1：停止容器（如果正在运行）**
```bash
docker stop <nessus_container_name>
```

**步骤2：启动容器**
```bash
docker start <nessus_container_name>
```

**步骤3：验证启动状态**
```bash
docker ps
```

#### 截图要求：
- 执行stop命令的输出
- 执行start命令的输出
- 验证容器启动成功的docker ps输出

### 3.3 创建新的Nessus容器

#### 适用场景：
- 首次部署Nessus
- 原容器已删除需要重新创建

#### 操作步骤：

**步骤1：拉取Nessus镜像（如需要）**
```bash
docker pull tenable/nessus:latest
```

**步骤2：创建并启动容器**
```bash
docker run -d --name nessus -p 8834:8834 tenable/nessus:latest
```

**步骤3：验证容器创建成功**
```bash
docker ps
```

#### 截图要求：
- 镜像拉取过程（如适用）
- 容器创建命令执行结果
- 验证容器运行状态的输出

### 3.4 检查容器日志

#### 用途：
- 诊断容器启动失败原因
- 查看Nessus服务运行状态

#### 操作命令：
```bash
# 查看最近的日志
docker logs <nessus_container_name>

# 实时查看日志
docker logs -f <nessus_container_name>

# 查看最近50行日志
docker logs --tail 50 <nessus_container_name>
```

#### 截图要求：
- 正常启动日志示例
- 常见错误日志示例

### 3.5 验证Nessus服务可访问性

#### 步骤1：检查端口映射
```bash
docker port <nessus_container_name>
```

#### 步骤2：测试Web界面访问
- 浏览器访问：`https://localhost:8834`
- 或使用服务器IP：`https://<server_ip>:8834`

#### 步骤3：检查防火墙设置（如需要）
```bash
# Windows防火墙检查
netsh advfirewall firewall show rule name="Docker"

# Linux防火墙检查
sudo ufw status
```

#### 截图要求：
- 端口映射检查结果
- Nessus登录页面截图
- 防火墙状态检查结果

## 4. 常见问题及解决方案

### 4.1 容器无法启动

**可能原因：**
- 端口冲突
- 资源不足
- 镜像损坏

**解决步骤：**
1. 检查端口占用：`netstat -an | findstr 8834`
2. 检查系统资源：`docker system df`
3. 重新拉取镜像：`docker pull tenable/nessus:latest`

### 4.2 Web界面无法访问

**可能原因：**
- 容器未完全启动
- 网络配置问题
- 防火墙阻止

**解决步骤：**
1. 等待容器完全启动（通常需要2-3分钟）
2. 检查容器日志确认服务状态
3. 验证防火墙规则

### 4.3 容器频繁重启

**可能原因：**
- 内存不足
- 配置文件错误
- 许可证问题

**解决步骤：**
1. 增加容器内存限制：`docker run -m 4g ...`
2. 检查挂载的配置文件
3. 验证Nessus许可证状态

## 5. 维护最佳实践

### 5.1 定期备份
- 备份容器数据卷
- 导出容器配置
- 保存扫描结果

### 5.2 监控建议
- 设置容器健康检查
- 监控资源使用情况
- 定期检查日志

### 5.3 更新策略
- 定期更新Nessus镜像
- 测试新版本兼容性
- 制定回滚计划

## 6. 联系信息

如遇到本指南未涵盖的问题，请联系：
- 技术支持团队：[联系方式]
- 紧急联系人：[联系方式]
- 内部文档：[文档链接]

## 7. 附录

### 7.1 常用Docker命令速查
```bash
# 查看所有容器
docker ps -a

# 查看容器日志
docker logs <container_name>

# 进入容器
docker exec -it <container_name> /bin/bash

# 重启容器
docker restart <container_name>

# 删除容器
docker rm <container_name>

# 查看容器资源使用
docker stats <container_name>
```

### 7.2 Nessus默认配置信息
- 默认端口：8834
- 默认协议：HTTPS
- 初始化时间：约2-3分钟
- 默认数据目录：/opt/nessus/var/nessus

---

**文档版本：** 1.0  
**创建日期：** [当前日期]  
**最后更新：** [当前日期]  
**维护人员：** [维护人员信息]