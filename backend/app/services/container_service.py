import docker
from typing import List, Dict, Any
import logging

class ContainerService:
    def __init__(self):
        try:
            self.client = docker.from_env()
            logging.info("Docker client initialized successfully")
        except Exception as e:
            logging.error(f"Failed to initialize Docker client: {str(e)}")
            raise

    def list_containers(self) -> List[Dict[str, Any]]:
        """获取所有容器列表"""
        try:
            containers = self.client.containers.list(all=True)
            return [{
                'id': container.id,
                'name': container.name,
                'status': container.status,
                'image': container.image.tags[0] if container.image.tags else 'none',
                'created': container.attrs['Created']
            } for container in containers]
        except Exception as e:
            logging.error(f"Failed to list containers: {str(e)}")
            raise

    def create_container(self, image: str, name: str) -> Dict[str, Any]:
        """创建新容器"""
        try:
            container = self.client.containers.run(
                image=image,
                name=name,
                detach=True
            )
            return {
                'id': container.id,
                'name': container.name,
                'status': container.status
            }
        except Exception as e:
            logging.error(f"Failed to create container: {str(e)}")
            raise

    def start_container(self, container_id: str) -> Dict[str, Any]:
        """启动容器"""
        try:
            container = self.client.containers.get(container_id)
            container.start()
            return {
                'id': container.id,
                'name': container.name,
                'status': container.status
            }
        except Exception as e:
            logging.error(f"Failed to start container: {str(e)}")
            raise

    def stop_container(self, container_id: str) -> Dict[str, Any]:
        """停止容器"""
        try:
            container = self.client.containers.get(container_id)
            container.stop()
            return {
                'id': container.id,
                'name': container.name,
                'status': container.status
            }
        except Exception as e:
            logging.error(f"Failed to stop container: {str(e)}")
            raise

    def remove_container(self, container_id: str) -> bool:
        """删除容器"""
        try:
            container = self.client.containers.get(container_id)
            container.remove(force=True)
            return True
        except Exception as e:
            logging.error(f"Failed to remove container: {str(e)}")
            raise
