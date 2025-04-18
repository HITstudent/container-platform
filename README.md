# 容器平台管理系统

一个基于Docker的容器管理平台，提供容器的创建、管理、监控等功能。

## 系统架构

系统由以下组件组成：
- 前端：React + Material-UI
- 后端：FastAPI + Python
- 数据库：PostgreSQL
- 监控：Prometheus + Grafana
- 容器运行时：Docker

## 系统要求

### 最低配置要求
- CPU：双核处理器
- 内存：4GB RAM
- 磁盘空间：10GB可用空间
- 操作系统：
  - Windows 10/11 专业版或企业版
  - Ubuntu 20.04 LTS或更高版本
  - macOS 11.0或更高版本

### 软件要求
- Docker 20.10.0 或更高版本
- Docker Compose 2.0.0 或更高版本

## 快速开始

### 一键部署（推荐）

1. Windows系统：
```bash
# 下载并解压项目文件
# 进入项目目录
.\install.bat
```

2. Linux/macOS系统：
```bash
# 下载并解压项目文件
# 进入项目目录
chmod +x install.sh
./install.sh
```

安装脚本会自动：
- 检查系统环境要求
- 验证Docker配置
- 创建必要的环境变量
- 启动所有服务
- 验证服务状态

### 手动部署

如果您需要更细粒度的控制，也可以选择手动部署：

1. 克隆项目：
```bash
git clone <repository-url>
cd container-platform
```

2. 配置环境变量：
创建 `.env` 文件在项目根目录：
```env
# PostgreSQL配置
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=container_platform

# 应用配置
APP_ENV=production
DEBUG=false

# Docker配置
DOCKER_HOST=tcp://host.docker.internal:2375
```

3. 启动服务：
```bash
docker-compose up -d
```

## Docker配置说明

### Windows环境
1. 打开Docker Desktop
2. 进入Settings（设置）
3. 启用"Expose daemon on tcp://localhost:2375 without TLS"选项

### Linux环境
1. 创建或编辑 `/etc/docker/daemon.json`：
```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```
2. 重启Docker服务：
```bash
sudo systemctl restart docker
```

## 访问服务

安装完成后，可以通过以下地址访问各个服务：

- 前端界面：http://localhost
- API文档：http://localhost:8000/api/v1/docs
- Prometheus：http://localhost:9090
- Grafana：http://localhost:3001 (默认账号：admin/admin)

## 数据持久化

系统使用以下卷进行数据持久化：
- `postgres_data`：数据库数据
- `prometheus_data`：监控数据
- `grafana_data`：仪表盘配置

## 系统维护

### 查看日志
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend
```

### 更新服务
```bash
# 拉取最新代码
git pull

# 重新构建并启动服务
docker-compose down
docker-compose up -d --build
```

### 备份数据
```bash
# 备份PostgreSQL数据
docker-compose exec postgres pg_dump -U postgres container_platform > backup.sql

# 还原PostgreSQL数据
cat backup.sql | docker-compose exec -T postgres psql -U postgres container_platform
```

## 故障排查

1. Docker连接问题
   - 确保Docker daemon正在运行
   - 检查Docker API端口是否可访问
   - 验证防火墙设置

2. 数据库连接问题
   - 检查PostgreSQL服务状态
   - 验证数据库凭据
   - 确认数据库端口可访问

3. 监控服务无法启动
   - 检查Prometheus配置文件
   - 确保所有被监控的服务可访问
   - 验证端口未被占用

## 安全建议

1. 生产环境部署：
   - 修改所有默认密码
   - 启用TLS/SSL
   - 限制API访问
   - 配置防火墙规则

2. Docker安全：
   - 限制Docker API访问
   - 使用TLS证书
   - 定期更新镜像
   - 扫描安全漏洞

## 技术支持

如遇到问题，请：
1. 查看详细日志：`docker-compose logs -f`
2. 检查服务状态：`docker-compose ps`
3. 提交Issue到项目仓库

## 许可证

[MIT License](LICENSE) 