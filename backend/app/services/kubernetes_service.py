from kubernetes import client, config
from typing import List, Dict, Optional
from ..core.config import settings
import os
import logging

logger = logging.getLogger(__name__)

class KubernetesService:
    def __init__(self):
        try:
            # 尝试从配置文件加载
            if hasattr(settings, 'KUBERNETES_CONFIG_PATH') and os.path.exists(settings.KUBERNETES_CONFIG_PATH):
                logger.info(f"Loading Kubernetes config from {settings.KUBERNETES_CONFIG_PATH}")
                config.load_kube_config(settings.KUBERNETES_CONFIG_PATH)
            else:
                # 尝试加载集群内配置
                try:
                    logger.info("Trying in-cluster config")
                    config.load_incluster_config()
                except Exception as e:
                    # 降级到模拟模式
                    logger.warning(f"Failed to load Kubernetes config: {str(e)}")
                    logger.info("Running in simulation mode - Kubernetes API calls will be mocked")
                    self.simulation_mode = True
                    return
            
            self.simulation_mode = False
            self.core_api = client.CoreV1Api()
            self.apps_api = client.AppsV1Api()
            logger.info("Successfully initialized Kubernetes client")
        except Exception as e:
            logger.error(f"Error initializing Kubernetes client: {str(e)}")
            logger.info("Running in simulation mode - Kubernetes API calls will be mocked")
            self.simulation_mode = True

    def list_deployments(self, namespace: str = "default") -> List[Dict]:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: listing deployments in namespace {namespace}")
            # 返回模拟数据
            return [
                {
                    "name": "sample-deployment",
                    "namespace": namespace,
                    "replicas": 3,
                    "available_replicas": 3,
                    "image": "nginx:latest",
                    "created_at": "2023-01-01T00:00:00Z",
                }
            ]
        
        # 正常模式
        deployments = self.apps_api.list_namespaced_deployment(namespace)
        return [
            {
                "name": dep.metadata.name,
                "namespace": dep.metadata.namespace,
                "replicas": dep.spec.replicas,
                "available_replicas": dep.status.available_replicas,
                "image": dep.spec.template.spec.containers[0].image,
                "created_at": dep.metadata.creation_timestamp,
            }
            for dep in deployments.items
        ]

    def create_deployment(
        self,
        name: str,
        image: str,
        namespace: str = "default",
        replicas: int = 1,
        labels: Optional[Dict] = None,
    ) -> Dict:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: creating deployment {name} in namespace {namespace}")
            return {
                "name": name,
                "namespace": namespace,
                "replicas": replicas,
            }
            
        if labels is None:
            labels = {"app": name}

        deployment = client.V1Deployment(
            metadata=client.V1ObjectMeta(name=name, labels=labels),
            spec=client.V1DeploymentSpec(
                replicas=replicas,
                selector=client.V1LabelSelector(match_labels=labels),
                template=client.V1PodTemplateSpec(
                    metadata=client.V1ObjectMeta(labels=labels),
                    spec=client.V1PodSpec(
                        containers=[
                            client.V1Container(
                                name=name,
                                image=image,
                            )
                        ]
                    ),
                ),
            ),
        )

        created_deployment = self.apps_api.create_namespaced_deployment(
            namespace=namespace,
            body=deployment,
        )

        return {
            "name": created_deployment.metadata.name,
            "namespace": created_deployment.metadata.namespace,
            "replicas": created_deployment.spec.replicas,
        }

    def delete_deployment(self, name: str, namespace: str = "default") -> bool:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: deleting deployment {name} in namespace {namespace}")
            return True
            
        try:
            self.apps_api.delete_namespaced_deployment(
                name=name,
                namespace=namespace,
            )
            return True
        except client.rest.ApiException:
            return False

    def scale_deployment(
        self, name: str, replicas: int, namespace: str = "default"
    ) -> bool:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: scaling deployment {name} to {replicas} replicas in namespace {namespace}")
            return True
            
        try:
            deployment = self.apps_api.read_namespaced_deployment(
                name=name,
                namespace=namespace,
            )
            deployment.spec.replicas = replicas
            self.apps_api.patch_namespaced_deployment(
                name=name,
                namespace=namespace,
                body=deployment,
            )
            return True
        except client.rest.ApiException:
            return False

    def list_services(self, namespace: str = "default") -> List[Dict]:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: listing services in namespace {namespace}")
            return [
                {
                    "name": "sample-service",
                    "namespace": namespace,
                    "type": "ClusterIP",
                    "cluster_ip": "10.0.0.1",
                    "external_ip": None,
                    "ports": [{"port": 80, "target_port": 80}],
                }
            ]
            
        services = self.core_api.list_namespaced_service(namespace)
        return [
            {
                "name": svc.metadata.name,
                "namespace": svc.metadata.namespace,
                "type": svc.spec.type,
                "cluster_ip": svc.spec.cluster_ip,
                "external_ip": svc.status.load_balancer.ingress[0].ip
                if svc.status.load_balancer.ingress
                else None,
                "ports": [
                    {"port": port.port, "target_port": port.target_port}
                    for port in svc.spec.ports
                ],
            }
            for svc in services.items
        ]

    def create_service(
        self,
        name: str,
        namespace: str = "default",
        service_type: str = "ClusterIP",
        ports: List[Dict] = None,
        selector: Dict = None,
    ) -> Dict:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: creating service {name} in namespace {namespace}")
            return {
                "name": name,
                "namespace": namespace,
                "type": service_type,
                "cluster_ip": "10.0.0.1",
            }
            
        if ports is None:
            ports = [{"port": 80, "target_port": 80}]
        if selector is None:
            selector = {"app": name}

        service = client.V1Service(
            metadata=client.V1ObjectMeta(name=name),
            spec=client.V1ServiceSpec(
                type=service_type,
                ports=[
                    client.V1ServicePort(
                        port=port["port"],
                        target_port=port["target_port"],
                    )
                    for port in ports
                ],
                selector=selector,
            ),
        )

        created_service = self.core_api.create_namespaced_service(
            namespace=namespace,
            body=service,
        )

        return {
            "name": created_service.metadata.name,
            "namespace": created_service.metadata.namespace,
            "type": created_service.spec.type,
            "cluster_ip": created_service.spec.cluster_ip,
        }

    def delete_service(self, name: str, namespace: str = "default") -> bool:
        if getattr(self, 'simulation_mode', True):
            logger.info(f"Simulation mode: deleting service {name} in namespace {namespace}")
            return True
            
        try:
            self.core_api.delete_namespaced_service(
                name=name,
                namespace=namespace,
            )
            return True
        except client.rest.ApiException:
            return False 