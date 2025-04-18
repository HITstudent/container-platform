from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.api.v1 import containers, kubernetes, monitoring, metrics
from app.core.config import settings
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="容器管理平台API",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 错误处理
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# 健康检查
@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "healthy"}

# 包含API路由
app.include_router(containers.router, prefix=f"{settings.API_V1_STR}/containers", tags=["containers"])
app.include_router(kubernetes.router, prefix=f"{settings.API_V1_STR}/kubernetes", tags=["kubernetes"])
app.include_router(monitoring.router, prefix=f"{settings.API_V1_STR}/monitoring", tags=["monitoring"])
app.include_router(metrics.router, prefix=f"{settings.API_V1_STR}/metrics", tags=["metrics"])

@app.get("/")
async def root():
    return {
        "message": "欢迎使用容器管理平台API",
        "version": settings.APP_VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs",
        "redoc_url": f"{settings.API_V1_STR}/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 