from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class DeploymentBase(BaseModel):
    name: str
    namespace: str = "default"
    image: str
    replicas: int = 1
    labels: Optional[Dict] = None

class DeploymentCreate(DeploymentBase):
    pass

class DeploymentResponse(DeploymentBase):
    available_replicas: Optional[int]
    created_at: datetime

    class Config:
        orm_mode = True

class ServicePort(BaseModel):
    port: int
    target_port: int

class ServiceBase(BaseModel):
    name: str
    namespace: str = "default"
    service_type: str = "ClusterIP"
    ports: List[Dict]
    selector: Dict

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    cluster_ip: str
    external_ip: Optional[str] = None

    class Config:
        orm_mode = True 