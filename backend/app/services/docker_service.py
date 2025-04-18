import os
import docker
from typing import List, Dict, Any, Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class DockerService:
    def __init__(self):
        try:
            logger.info(f"Initializing Docker client with DOCKER_HOST: {settings.DOCKER_HOST}")
            
            # 尝试使用环境变量中的配置
            try:
                self.client = docker.from_env()
                # 测试连接
                self.client.ping()
                logger.info("Successfully connected to Docker daemon using environment variables")
            except Exception as e:
                logger.warning(f"Failed to initialize Docker client from env: {str(e)}")
                # 尝试使用配置的 DOCKER_HOST
                docker_host = settings.DOCKER_HOST or 'tcp://docker-proxy:2375'
                logger.info(f"Trying to connect using docker host: {docker_host}")
                self.client = docker.DockerClient(base_url=docker_host)
                # 测试连接
                self.client.ping()
                logger.info("Successfully connected to Docker daemon using explicit host")
        except Exception as e:
            logger.error(f"Error initializing Docker client: {str(e)}")
            raise

    def list_containers(self) -> List[Dict[str, Any]]:
        try:
            containers = self.client.containers.list(all=True)
            container_list = []
            for container in containers:
                try:
                    # 安全地获取镜像标签
                    image_name = "<none>"
                    if hasattr(container, 'image') and container.image:
                        if hasattr(container.image, 'tags') and container.image.tags:
                            image_name = container.image.tags[0]
                    
                    # 构建基本容器信息
                    container_info = {
                        "id": container.id,
                        "name": container.name or "",
                        "image": image_name,
                        "status": container.status or "unknown",
                        "ports": container.ports or {},
                        "createdAt": container.attrs.get("Created", "")
                    }
                    container_list.append(container_info)
                except Exception as e:
                    logger.warning(f"Error getting container info for {container.id}: {str(e)}")
                    continue
            return container_list
        except Exception as e:
            logger.error(f"Error listing containers: {str(e)}")
            raise

    def create_container(self, image: str, name: str, **kwargs) -> Dict[str, Any]:
        try:
            container = self.client.containers.create(
                image=image,
                name=name,
                **kwargs
            )
            return {
                "id": container.id,
                "name": container.name,
                "status": container.status
            }
        except Exception as e:
            logger.error(f"Error creating container: {str(e)}")
            raise

    def stop_container(self, container_id: str) -> bool:
        try:
            container = self.client.containers.get(container_id)
            container.stop()
            return True
        except Exception as e:
            logger.error(f"Error stopping container {container_id}: {str(e)}")
            raise

    def start_container(self, container_id: str) -> bool:
        try:
            container = self.client.containers.get(container_id)
            container.start()
            return True
        except Exception as e:
            logger.error(f"Error starting container {container_id}: {str(e)}")
            raise

    def remove_container(self, container_id: str, force: bool = False) -> bool:
        try:
            container = self.client.containers.get(container_id)
            container.remove(force=force)
            return True
        except Exception as e:
            logger.error(f"Error removing container {container_id}: {str(e)}")
            raise

    def get_container_logs(self, container_id: str, tail: int = 100) -> str:
        try:
            container = self.client.containers.get(container_id)
            return container.logs(tail=tail).decode('utf-8')
        except Exception as e:
            logger.error(f"Error getting logs for container {container_id}: {str(e)}")
            raise

    def get_container_stats(self, container_id: str) -> Dict[str, Any]:
        try:
            container = self.client.containers.get(container_id)
            stats = container.stats(stream=False)
            return {
                "cpu_usage": stats["cpu_stats"]["cpu_usage"]["total_usage"],
                "memory_usage": stats["memory_stats"]["usage"],
                "network_rx": stats["networks"]["eth0"]["rx_bytes"],
                "network_tx": stats["networks"]["eth0"]["tx_bytes"]
            }
        except Exception as e:
            logger.error(f"Error getting stats for container {container_id}: {str(e)}")
            raise

    def get_container(self, container_id: str) -> Optional[Dict[str, Any]]:
        """获取单个容器的详细信息"""
        try:
            container = self.client.containers.get(container_id)
            if not container:
                return None
                
            # 安全地获取镜像标签
            image_name = "<none>"
            if hasattr(container, 'image') and container.image:
                if hasattr(container.image, 'tags') and container.image.tags:
                    image_name = container.image.tags[0]
            
            # 构建详细的容器信息
            container_info = {
                "id": container.id,
                "name": container.name or "",
                "image": image_name,
                "status": container.status or "unknown",
                "ports": container.ports or {},
                "createdAt": container.attrs.get("Created", ""),
                "state": container.attrs.get("State", {}),
                "config": container.attrs.get("Config", {}),
                "networkSettings": container.attrs.get("NetworkSettings", {})
            }
            return container_info
        except Exception as e:
            logger.error(f"Error getting container {container_id}: {str(e)}")
            raise 