@echo off
echo 正在创建安装包...

REM 创建临时目录
mkdir container-platform-package
cd container-platform-package

REM 复制必要文件
echo 复制必要文件...
xcopy ..\backend backend\ /E /I /Y
xcopy ..\frontend frontend\ /E /I /Y
xcopy ..\docs docs\ /E /I /Y
xcopy ..\prometheus prometheus\ /E /I /Y
copy ..\docker-compose.yml .
copy ..\prometheus.yml .
copy ..\requirements.txt .
copy ..\package.json .
copy ..\install.bat .
copy ..\install.sh .
copy ..\README.md .
copy ..\.env.example .env.example

REM 删除不必要的文件和目录
echo 清理不必要的文件...
rmdir /S /Q frontend\node_modules 2>nul
rmdir /S /Q backend\venv 2>nul
rmdir /S /Q backend\__pycache__ 2>nul
del /F /Q frontend\package-lock.json 2>nul
del /F /Q backend\*.pyc 2>nul

REM 创建zip包
echo 创建ZIP包...
powershell Compress-Archive -Path * -DestinationPath ..\container-platform.zip -Force

REM 清理临时文件
cd ..
rmdir /S /Q container-platform-package

echo 安装包已创建完成：container-platform.zip 