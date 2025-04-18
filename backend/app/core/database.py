from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from sqlalchemy.exc import SQLAlchemyError
from contextlib import contextmanager
import logging
from typing import Generator
from .config import settings

# 配置日志
logger = logging.getLogger(__name__)

# 创建数据库引擎
engine = create_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=30,
    pool_recycle=1800,
    echo=settings.DEBUG
)

# 创建会话工厂
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

# 声明基类
Base = declarative_base()

# 数据库事件监听
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if "sqlite" in str(settings.SQLALCHEMY_DATABASE_URI):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

@event.listens_for(engine, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except:
        raise SQLAlchemyError("Database connection failed")
    finally:
        cursor.close()

# 获取数据库会话的依赖函数
@contextmanager
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {str(e)}")
        raise
    finally:
        db.close()

# 数据库初始化函数
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully")
    except SQLAlchemyError as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise 