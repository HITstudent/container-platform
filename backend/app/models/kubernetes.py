from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    namespace = Column(String, index=True)
    replicas = Column(Integer, default=1)
    image = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String)
    labels = Column(JSON)
    annotations = Column(JSON)

    def __repr__(self):
        return f"<Deployment {self.name}>"

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    namespace = Column(String, index=True)
    service_type = Column(String)  # ClusterIP, NodePort, LoadBalancer
    cluster_ip = Column(String)
    external_ip = Column(String, nullable=True)
    ports = Column(JSON)  # List of port mappings
    selector = Column(JSON)  # Service selector labels
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Service {self.name}>" 