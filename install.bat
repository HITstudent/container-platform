@echo off
setlocal enabledelayedexpansion

:: 设置颜色代码
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "RESET=[0m"

echo %GREEN%开始安装Container Platform...%RESET%

:: 检查Docker是否安装
echo %YELLOW%检查Docker安装状态...%RESET%
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%错误: Docker未安装或未启动。请安装Docker并确保Docker服务正在运行。%RESET%
    exit /b 1
)

:: 检查Docker Compose是否安装
echo %YELLOW%检查Docker Compose安装状态...%RESET%
docker-compose --version > nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%错误: Docker Compose未安装。请安装Docker Compose。%RESET%
    exit /b 1
)

:: 检查端口占用
echo %YELLOW%检查端口占用情况...%RESET%
set "ports=80 8000 5432 9090 3001"
for %%p in (%ports%) do (
    netstat -ano | findstr ":%%p " > nul
    if !errorlevel! equ 0 (
        echo %RED%错误: 端口%%p已被占用。请确保该端口未被其他程序使用。%RESET%
        exit /b 1
    )
)

:: 检查并创建环境变量文件
if not exist .env (
    echo %YELLOW%创建环境变量配置文件...%RESET%
    copy .env.example .env > nul
    if !errorlevel! neq 0 (
        echo %RED%错误: 无法创建环境变量文件。%RESET%
        exit /b 1
    )
)

:: 启动服务
echo %YELLOW%启动Container Platform服务...%RESET%
docker-compose up -d
if %errorlevel% neq 0 (
    echo %RED%错误: 服务启动失败。请检查日志获取详细信息。%RESET%
    exit /b 1
)

:: 等待服务就绪
echo %YELLOW%等待服务就绪...%RESET%
timeout /t 10 /nobreak > nul

:: 检查服务状态
echo %YELLOW%检查服务状态...%RESET%
docker-compose ps
if %errorlevel% neq 0 (
    echo %RED%警告: 无法获取服务状态。请手动检查服务是否正常运行。%RESET%
)

echo %GREEN%
echo 安装完成！您可以通过以下地址访问服务：
echo 前端界面: http://localhost
echo API接口: http://localhost/api/v1
echo Grafana监控: http://localhost:3001 (默认账号/密码：admin/admin)
echo Prometheus: http://localhost:9090
echo %RESET%

exit /b 0 