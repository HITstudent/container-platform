from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.monitoring_service import MonitoringService

router = APIRouter()
monitoring_service = MonitoringService()

@router.get("/containers/{container_id}/metrics")
def get_container_metrics(
    container_id: str,
    duration: str = "5m",
    db: Session = Depends(get_db)
):
    """获取容器的监控指标"""
    try:
        return monitoring_service.get_container_metrics(
            container_id=container_id,
            duration=duration
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/cluster/metrics")
def get_cluster_metrics(db: Session = Depends(get_db)):
    """获取集群级别的监控指标"""
    try:
        return monitoring_service.get_cluster_metrics()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    """获取当前活动的告警"""
    try:
        return monitoring_service.get_alerts()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 