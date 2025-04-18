from typing import List, Optional, Union, Dict, Any
from pydantic import BaseSettings, PostgresDsn, validator
from functools import lru_cache
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Container Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # 数据库配置
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "postgres")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "container_platform")
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    BACKEND_CORS_ORIGINS: Union[str, List[str]] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # 应用配置
    APP_NAME: str = os.getenv("APP_NAME", "Container Platform")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # 数据库配置
    DATABASE_URL: PostgresDsn = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/container_platform")
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "32"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "64"))

    # Kubernetes配置
    KUBERNETES_CONFIG_PATH: Optional[str] = os.getenv("KUBERNETES_CONFIG_PATH", None)
    KUBERNETES_NAMESPACE: str = os.getenv("KUBERNETES_NAMESPACE", "default")

    # Docker配置
    DOCKER_HOST: str = os.getenv("DOCKER_HOST", "tcp://localhost:2375")
    DOCKER_TLS_VERIFY: bool = os.getenv("DOCKER_TLS_VERIFY", "0") == "1"
    DOCKER_CERT_PATH: Optional[str] = os.getenv("DOCKER_CERT_PATH", None)
    DOCKER_API_VERSION: str = os.getenv("DOCKER_API_VERSION", "auto")

    # 监控配置
    PROMETHEUS_ENDPOINT: str = os.getenv("PROMETHEUS_ENDPOINT", "http://localhost:9090")
    GRAFANA_ENDPOINT: str = os.getenv("GRAFANA_ENDPOINT", "http://localhost:3000")
    METRICS_ENABLED: bool = os.getenv("METRICS_ENABLED", "True").lower() == "true"

    # 日志配置
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s")

    # 安全配置
    API_KEY_HEADER: str = os.getenv("API_KEY_HEADER", "X-API-Key")
    API_KEY: str = os.getenv("API_KEY", "your-api-key-here")
    RATE_LIMIT: int = int(os.getenv("RATE_LIMIT", "100"))

    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings() 