# 容器管理平台

一个基于 FastAPI 和 React 的现代化容器管理平台，提供容器监控、管理和部署功能。

## 功能特性

- 📊 实时监控：CPU、内存、磁盘和网络使用情况的实时监控
- 🔔 告警管理：自定义阈值的监控告警系统
- 🐳 容器管理：支持容器的创建、启动、停止和删除
- 🚀 简单部署：使用 Docker Compose 实现一键部署
- 📈 性能分析：详细的容器性能指标分析
- 🔒 安全可靠：支持 Docker 安全配置和访问控制

## 技术栈

### 后端
- FastAPI
- PostgreSQL
- Docker SDK
- Prometheus
- Grafana

### 前端
- React
- Material-UI
- Recharts
- TypeScript

## 快速开始

### 前置条件

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 14+
- Python 3.8+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/HITstudent/container-platform.git
cd container-platform
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置必要的环境变量
```

3. 启动服务
```bash
docker-compose up -d
```

4. 访问应用
- 前端界面：http://localhost
- API 文档：http://localhost:8000/api/v1/docs
- Grafana 监控：http://localhost:3001

## 项目结构

```
container-platform/
├── backend/             # 后端 FastAPI 应用
├── frontend/           # 前端 React 应用
├── prometheus/         # Prometheus 配置
└── docker-compose.yml  # 容器编排配置
```

## 开发指南

### 后端开发
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 前端开发
```bash
cd frontend
npm install
npm start
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License 