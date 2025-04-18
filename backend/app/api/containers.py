from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..services.container_service import ContainerService

router = APIRouter()
container_service = ContainerService()

@router.get("/containers", response_model=List[Dict[str, Any]])
async def list_containers():
    """获取所有容器列表"""
    try:
        return container_service.list_containers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/containers", response_model=Dict[str, Any])
async def create_container(image: str, name: str):
    """创建新容器"""
    try:
        return container_service.create_container(image, name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/containers/{container_id}/start")
async def start_container(container_id: str):
    """启动容器"""
    try:
        success = container_service.start_container(container_id)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/containers/{container_id}/stop")
async def stop_container(container_id: str):
    """停止容器"""
    try:
        success = container_service.stop_container(container_id)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/containers/{container_id}")
async def remove_container(container_id: str):
    """删除容器"""
    try:
        success = container_service.remove_container(container_id)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 