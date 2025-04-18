import requests
from typing import Dict, List
from datetime import datetime, timedelta
from ..core.config import settings

class MonitoringService:
    def __init__(self):
        self.prometheus_url = settings.PROMETHEUS_ENDPOINT

    def get_container_metrics(self, container_id: str, duration: str = "5m") -> Dict:
        """获取容器的监控指标"""
        end_time = datetime.now()
        start_time = end_time - timedelta(minutes=5)

        queries = {
            "cpu_usage": f'rate(container_cpu_usage_seconds_total{{container_id="{container_id}"}}[{duration}])',
            "memory_usage": f'container_memory_usage_bytes{{container_id="{container_id}"}}',
            "network_receive": f'rate(container_network_receive_bytes_total{{container_id="{container_id}"}}[{duration}])',
            "network_transmit": f'rate(container_network_transmit_bytes_total{{container_id="{container_id}"}}[{duration}])',
        }

        metrics = {}
        for metric_name, query in queries.items():
            try:
                response = requests.get(
                    f"{self.prometheus_url}/api/v1/query_range",
                    params={
                        "query": query,
                        "start": start_time.timestamp(),
                        "end": end_time.timestamp(),
                        "step": "15s",
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    if data["status"] == "success" and data["data"]["result"]:
                        metrics[metric_name] = data["data"]["result"][0]["values"]
                    else:
                        metrics[metric_name] = []
            except requests.exceptions.RequestException:
                metrics[metric_name] = []

        return metrics

    def get_cluster_metrics(self) -> Dict:
        """获取集群级别的监控指标"""
        queries = {
            "node_cpu_usage": 'sum(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance)',
            "node_memory_usage": 'sum(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) by (instance)',
            "node_disk_usage": 'sum(node_filesystem_size_bytes - node_filesystem_free_bytes) by (instance)',
            "node_network_receive": 'sum(rate(node_network_receive_bytes_total[5m])) by (instance)',
            "node_network_transmit": 'sum(rate(node_network_transmit_bytes_total[5m])) by (instance)',
        }

        metrics = {}
        for metric_name, query in queries.items():
            try:
                response = requests.get(
                    f"{self.prometheus_url}/api/v1/query",
                    params={"query": query},
                )
                if response.status_code == 200:
                    data = response.json()
                    if data["status"] == "success":
                        metrics[metric_name] = data["data"]["result"]
                    else:
                        metrics[metric_name] = []
            except requests.exceptions.RequestException:
                metrics[metric_name] = []

        return metrics

    def get_alerts(self) -> List[Dict]:
        """获取当前活动的告警"""
        try:
            response = requests.get(f"{self.prometheus_url}/api/v1/alerts")
            if response.status_code == 200:
                data = response.json()
                if data["status"] == "success":
                    return [
                        {
                            "name": alert["labels"]["alertname"],
                            "severity": alert["labels"].get("severity", "unknown"),
                            "status": alert["state"],
                            "description": alert["annotations"].get("description", ""),
                            "started_at": alert["startsAt"],
                        }
                        for alert in data["data"]["alerts"]
                    ]
            return []
        except requests.exceptions.RequestException:
            return []

    def get_system_metrics(self) -> Dict:
        """获取系统级别的监控指标"""
        end_time = datetime.now()
        start_time = end_time - timedelta(minutes=5)

        queries = {
            "cpu": f'avg(rate(node_cpu_seconds_total{{mode="user"}}[5m])) * 100',
            "memory": 'node_memory_MemUsed_bytes / node_memory_MemTotal_bytes * 100',
            "disk": '(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100',
            "network": 'rate(node_network_receive_bytes_total[5m])'
        }

        metrics = {}
        for metric_name, query in queries.items():
            try:
                response = requests.get(
                    f"{self.prometheus_url}/api/v1/query_range",
                    params={
                        "query": query,
                        "start": start_time.timestamp(),
                        "end": end_time.timestamp(),
                        "step": "15s",
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    if data["status"] == "success" and data["data"]["result"]:
                        # 转换数据格式以匹配前端期望
                        values = data["data"]["result"][0]["values"]
                        metrics[metric_name] = [
                            {"timestamp": str(datetime.fromtimestamp(ts)), "value": float(val)}
                            for ts, val in values
                        ]
                    else:
                        metrics[metric_name] = []
            except requests.exceptions.RequestException as e:
                metrics[metric_name] = []

        return metrics

    def get_system_alarms(self) -> List[Dict]:
        """获取系统告警信息"""
        try:
            response = requests.get(
                f"{self.prometheus_url}/api/v1/alerts"
            )
            if response.status_code == 200:
                data = response.json()
                if data["status"] == "success":
                    alerts = []
                    for alert in data["data"]["alerts"]:
                        alerts.append({
                            "id": alert["fingerprint"],
                            "resource": alert["labels"].get("instance", "unknown"),
                            "threshold": float(alert["annotations"].get("threshold", 0)),
                            "condition": "above" if alert["annotations"].get("condition") == ">" else "below",
                            "status": "active" if alert["state"] == "firing" else "resolved",
                            "createdAt": alert["startsAt"]
                        })
                    return alerts
            return []
        except requests.exceptions.RequestException:
            return [] 