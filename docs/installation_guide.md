# 容器平台安装部署指南

## 目录
1. [系统要求](#系统要求)
2. [前置准备](#前置准备)
3. [安装步骤](#安装步骤)
4. [配置说明](#配置说明)
5. [验证部署](#验证部署)
6. [故障排查](#故障排查)

## 系统要求

### 硬件要求
- CPU：双核处理器或更高
- 内存：最小4GB RAM
- 磁盘空间：最小10GB可用空间

### 软件要求
- 操作系统：
  - Windows 10/11 专业版或企业版
  - Ubuntu 20.04 LTS或更高版本
  - macOS 11.0或更高版本
- Docker 20.10.0 或更高版本
- Docker Compose 2.0.0 或更高版本

### 网络要求
- 开放端口：
  - 80 (前端服务)
  - 8000 (后端API)
  - 9090 (Prometheus)
  - 3001 (Grafana)
  - 5432 (PostgreSQL，可选)

## 前置准备

### Windows环境
1. 安装Docker Desktop
2. 在Docker Desktop设置中：
   - 启用"Use the WSL 2 based engine"
   - 启用"Expose daemon on tcp://localhost:2375 without TLS"
   - 分配足够的资源（建议：2 CPU，4GB内存）

### Linux环境
1. 安装Docker：
```bash
curl -fsSL https://get.docker.com | sh
```

2. 安装Docker Compose：
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.0.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. 配置Docker daemon：
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
EOF
sudo systemctl restart docker
```

### macOS环境
1. 安装Docker Desktop for Mac
2. 在偏好设置中：
   - 启用"Enable Docker Expose daemon on tcp://localhost:2375 without TLS"
   - 分配足够的资源（建议：2 CPU，4GB内存）

## 安装步骤

### 1. 获取项目文件
下载并解压项目文件到目标目录。

### 2. 一键部署

#### Windows环境：
```powershell
.\install.bat
```

#### Linux/macOS环境：
```bash
chmod +x install.sh
./install.sh
```

### 3. 手动部署（可选）

如果需要更细粒度的控制，可以按以下步骤手动部署：

1. 创建环境配置文件：
```bash
cp .env.example .env
```

2. 编辑.env文件，配置必要的环境变量：
```env
# PostgreSQL配置
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=container_platform

# 应用配置
APP_ENV=production
DEBUG=false
SECRET_KEY=<生成的密钥>
API_KEY=<生成的API密钥>

# Docker配置
DOCKER_HOST=tcp://host.docker.internal:2375
```

3. 启动服务：
```bash
docker-compose up -d
```

## 配置说明

### 环境变量配置

#### 数据库配置
- `POSTGRES_USER`：数据库用户名
- `POSTGRES_PASSWORD`：数据库密码
- `POSTGRES_DB`：数据库名称
- `DATABASE_URL`：数据库连接URL

#### 应用配置
- `APP_ENV`：应用环境（production/development）
- `DEBUG`：调试模式开关
- `SECRET_KEY`：应用密钥
- `API_KEY`：API访问密钥

#### Docker配置
- `DOCKER_HOST`：Docker守护进程地址
- `DOCKER_API_VERSION`：Docker API版本

#### 监控配置
- `PROMETHEUS_ENDPOINT`：Prometheus访问地址
- `GRAFANA_ENDPOINT`：Grafana访问地址
- `METRICS_ENABLED`：是否启用监控

### 服务端口配置

可以在`docker-compose.yml`中修改服务端口映射：
```yaml
services:
  frontend:
    ports:
      - "80:80"  # 修改前端端口
  backend:
    ports:
      - "8000:8000"  # 修改后端端口
  # ... 其他服务
```

## 验证部署

### 1. 检查服务状态
```bash
docker-compose ps
```

### 2. 访问服务
- 前端界面：http://localhost
- API文档：http://localhost:8000/api/v1/docs
- Prometheus：http://localhost:9090
- Grafana：http://localhost:3001 (默认账号：admin/admin)

### 3. 验证API连接
```bash
curl http://localhost:8000/api/v1/health
```

## 故障排查

### 1. 服务无法启动
检查日志：
```bash
docker-compose logs [服务名]
```

### 2. 数据库连接错误
1. 检查数据库服务状态：
```bash
docker-compose ps postgres
```

2. 检查数据库日志：
```bash
docker-compose logs postgres
```

### 3. Docker连接问题
1. 确认Docker守护进程运行状态：
```bash
docker info
```

2. 检查Docker API访问：
```bash
curl http://localhost:2375/version
```

### 4. 端口冲突
检查端口占用：
```bash
# Windows
netstat -ano | findstr "80 8000 9090 3001"

# Linux/macOS
netstat -tulpn | grep -E "80|8000|9090|3001"
```

### 常见问题解决

1. Docker守护进程无法访问
   - 检查Docker Desktop设置
   - 确认防火墙配置
   - 验证daemon.json配置

2. 内存不足
   - 增加Docker Desktop的资源限制
   - 检查系统可用内存
   - 关闭不必要的应用

3. 数据持久化问题
   - 检查volume权限
   - 验证挂载路径
   - 确认存储空间充足 