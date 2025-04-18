from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.docker_service import DockerService
from ...schemas.container import ContainerCreate, ContainerResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
docker_service = DockerService()

@router.get("/", response_model=List[ContainerResponse])
def list_containers(db: Session = Depends(get_db)):
    """列出所有容器"""
    try:
        logger.info("开始获取容器列表")
        containers = docker_service.list_containers()
        logger.info(f"Docker服务返回的原始数据: {containers}")
        
        # 确保返回的数据格式符合前端期望
        formatted_containers = []
        for container in containers:
            try:
                formatted_container = ContainerResponse(
                    id=str(container.get("id", "")),
                    name=str(container.get("name", "")),
                    image=str(container.get("image", "")),
                    status=str(container.get("status", "")),
                    ports=container.get("ports", {}),
                    createdAt=str(container.get("createdAt", "")),
                    state={},
                    config={},
                    networkSettings={}
                )
                logger.info(f"格式化后的容器数据: {formatted_container}")
                formatted_containers.append(formatted_container)
            except Exception as e:
                logger.error(f"格式化单个容器数据时出错: {str(e)}, 容器数据: {container}")
                continue
                
        logger.info(f"最终返回的数据: {formatted_containers}")
        return formatted_containers
    except Exception as e:
        logger.error(f"获取容器列表时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ContainerResponse)
def create_container(
    container: ContainerCreate,
    db: Session = Depends(get_db)
):
    """创建新容器"""
    try:
        return docker_service.create_container(
            image=container.image,
            name=container.name,
            ports=container.ports,
            environment=container.environment,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{container_id}/start")
def start_container(container_id: str, db: Session = Depends(get_db)):
    """启动容器"""
    if docker_service.start_container(container_id):
        return {"message": "容器已启动"}
    raise HTTPException(status_code=404, detail="容器未找到")

@router.post("/{container_id}/stop")
def stop_container(container_id: str, db: Session = Depends(get_db)):
    """停止容器"""
    if docker_service.stop_container(container_id):
        return {"message": "容器已停止"}
    raise HTTPException(status_code=404, detail="容器未找到")

@router.delete("/{container_id}")
def remove_container(
    container_id: str, force: bool = False, db: Session = Depends(get_db)
):
    """删除容器"""
    if docker_service.remove_container(container_id, force=force):
        return {"message": "容器已删除"}
    raise HTTPException(status_code=404, detail="容器未找到")

@router.get("/{container_id}/logs")
def get_container_logs(
    container_id: str, tail: int = 100, db: Session = Depends(get_db)
):
    """获取容器日志"""
    logs = docker_service.get_container_logs(container_id, tail=tail)
    if logs:
        return {"logs": logs}
    raise HTTPException(status_code=404, detail="容器未找到")

@router.get("/{container_id}/stats")
def get_container_stats(container_id: str, db: Session = Depends(get_db)):
    """获取容器统计信息"""
    stats = docker_service.get_container_stats(container_id)
    if stats:
        return stats
    raise HTTPException(status_code=404, detail="容器未找到")

@router.get("/{container_id}", response_model=ContainerResponse)
def get_container(container_id: str, db: Session = Depends(get_db)):
    """获取容器详情"""
    try:
        container = docker_service.get_container(container_id)
        if container:
            return container
        raise HTTPException(status_code=404, detail="容器未找到")
    except Exception as e:
        logger.error(f"获取容器详情时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 