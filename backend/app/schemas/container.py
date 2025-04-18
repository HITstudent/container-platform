from pydantic import BaseModel
from typing import Dict, Optional, Any, List
from datetime import datetime

class ContainerBase(BaseModel):
    name: str
    image: str
    ports: Dict[str, List[Dict[str, str]]]
    status: str
    createdAt: str

class ContainerCreate(ContainerBase):
    environment: Optional[Dict[str, str]] = None

class ContainerResponse(ContainerBase):
    id: str
    state: Optional[Dict[str, Any]] = None
    config: Optional[Dict[str, Any]] = None
    networkSettings: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True 