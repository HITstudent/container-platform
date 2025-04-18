#!/bin/bash

echo "正在创建安装包..."

# 创建临时目录
mkdir -p container-platform-package
cd container-platform-package

# 复制必要文件
echo "复制必要文件..."
cp -r ../backend ./
cp -r ../frontend ./
cp -r ../docs ./
cp -r ../prometheus ./
cp ../docker-compose.yml ./
cp ../prometheus.yml ./
cp ../requirements.txt ./
cp ../package.json ./
cp ../install.bat ./
cp ../install.sh ./
cp ../README.md ./
cp ../.env.example ./.env.example

# 删除不必要的文件和目录
echo "清理不必要的文件..."
rm -rf frontend/node_modules
rm -rf backend/venv
rm -rf backend/__pycache__
rm -f frontend/package-lock.json
find . -name "*.pyc" -delete

# 创建tar.gz包
echo "创建压缩包..."
cd ..
tar -czf container-platform.tar.gz container-platform-package/

# 清理临时文件
rm -rf container-platform-package

echo "安装包已创建完成：container-platform.tar.gz" 