from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import containers

app = FastAPI(
    title="Container Platform API",
    description="Container Platform Management API",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 允许前端访问
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(containers.router, prefix="/api") 