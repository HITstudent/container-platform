from fastapi import APIRouter, HTTPException
from typing import List, Dict
from ...services.monitoring_service import MonitoringService

router = APIRouter()
monitoring_service = MonitoringService()

@router.get("/")
async def get_system_metrics():
    """获取系统级别的监控指标"""
    try:
        metrics = monitoring_service.get_system_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alarms")
async def get_system_alarms():
    """获取系统告警信息"""
    try:
        alarms = monitoring_service.get_system_alarms()
        return alarms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 