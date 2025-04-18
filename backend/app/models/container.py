from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Container(Base):
    __tablename__ = "containers"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(String, unique=True, index=True)
    name = Column(String)
    image = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ports = Column(String)  # JSON string of port mappings
    environment = Column(String)  # JSON string of environment variables
    is_running = Column(Boolean, default=False)

    def __repr__(self):
        return f"<Container {self.name}>" 