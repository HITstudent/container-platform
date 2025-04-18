from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.kubernetes_service import KubernetesService
from ...schemas.kubernetes import (
    DeploymentCreate,
    DeploymentResponse,
    ServiceCreate,
    ServiceResponse,
)

router = APIRouter()
k8s_service = KubernetesService()

@router.get("/deployments", response_model=List[DeploymentResponse])
def list_deployments(namespace: str = "default", db: Session = Depends(get_db)):
    """列出所有部署"""
    try:
        return k8s_service.list_deployments(namespace=namespace)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/deployments", response_model=DeploymentResponse)
def create_deployment(
    deployment: DeploymentCreate,
    db: Session = Depends(get_db)
):
    """创建新部署"""
    try:
        return k8s_service.create_deployment(
            name=deployment.name,
            image=deployment.image,
            namespace=deployment.namespace,
            replicas=deployment.replicas,
            labels=deployment.labels,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/deployments/{name}")
def delete_deployment(
    name: str, namespace: str = "default", db: Session = Depends(get_db)
):
    """删除部署"""
    if k8s_service.delete_deployment(name=name, namespace=namespace):
        return {"message": "部署已删除"}
    raise HTTPException(status_code=404, detail="部署未找到")

@router.put("/deployments/{name}/scale")
def scale_deployment(
    name: str,
    replicas: int,
    namespace: str = "default",
    db: Session = Depends(get_db)
):
    """扩缩容部署"""
    if k8s_service.scale_deployment(name=name, replicas=replicas, namespace=namespace):
        return {"message": f"部署已扩缩容至 {replicas} 个副本"}
    raise HTTPException(status_code=404, detail="部署未找到")

@router.get("/services", response_model=List[ServiceResponse])
def list_services(namespace: str = "default", db: Session = Depends(get_db)):
    """列出所有服务"""
    try:
        return k8s_service.list_services(namespace=namespace)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/services", response_model=ServiceResponse)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db)
):
    """创建新服务"""
    try:
        return k8s_service.create_service(
            name=service.name,
            namespace=service.namespace,
            service_type=service.service_type,
            ports=service.ports,
            selector=service.selector,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/services/{name}")
def delete_service(
    name: str, namespace: str = "default", db: Session = Depends(get_db)
):
    """删除服务"""
    if k8s_service.delete_service(name=name, namespace=namespace):
        return {"message": "服务已删除"}
    raise HTTPException(status_code=404, detail="服务未找到") 