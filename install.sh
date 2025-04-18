#!/bin/bash

# 设置颜色代码
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}开始安装Container Platform...${NC}"

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}错误: 请使用root权限运行此脚本${NC}"
    exit 1
fi

# 检查Docker是否安装
echo -e "${YELLOW}检查Docker安装状态...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker未安装。请先安装Docker。${NC}"
    exit 1
fi

# 检查Docker服务状态
if ! systemctl is-active --quiet docker; then
    echo -e "${YELLOW}Docker服务未运行，正在启动...${NC}"
    systemctl start docker
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误: 无法启动Docker服务${NC}"
        exit 1
    fi
fi

# 检查Docker Compose是否安装
echo -e "${YELLOW}检查Docker Compose安装状态...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose未安装。请安装Docker Compose。${NC}"
    exit 1
fi

# 检查端口占用
echo -e "${YELLOW}检查端口占用情况...${NC}"
ports=(80 8000 5432 9090 3001)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}错误: 端口 $port 已被占用。请确保该端口未被其他程序使用。${NC}"
        exit 1
    fi
done

# 检查并创建环境变量文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}创建环境变量配置文件...${NC}"
    if [ ! -f .env.example ]; then
        echo -e "${RED}错误: .env.example 文件不存在${NC}"
        exit 1
    fi
    cp .env.example .env
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误: 无法创建环境变量文件${NC}"
        exit 1
    fi
fi

# 设置文件权限
echo -e "${YELLOW}设置文件权限...${NC}"
chmod -R 755 .
chmod 644 .env

# 启动服务
echo -e "${YELLOW}启动Container Platform服务...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 服务启动失败。请检查日志获取详细信息。${NC}"
    exit 1
fi

# 等待服务就绪
echo -e "${YELLOW}等待服务就绪...${NC}"
sleep 10

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
docker-compose ps
if [ $? -ne 0 ]; then
    echo -e "${RED}警告: 无法获取服务状态。请手动检查服务是否正常运行。${NC}"
fi

echo -e "${GREEN}"
echo "安装完成！您可以通过以下地址访问服务："
echo "前端界面: http://localhost"
echo "API接口: http://localhost/api/v1"
echo "Grafana监控: http://localhost:3001 (默认账号/密码：admin/admin)"
echo "Prometheus: http://localhost:9090"
echo -e "${NC}"

exit 0 