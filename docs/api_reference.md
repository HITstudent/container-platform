# API参考文档

## 目录
1. [API概述](#api概述)
2. [认证方式](#认证方式)
3. [API端点](#api端点)
4. [错误处理](#错误处理)
5. [示例代码](#示例代码)

## API概述

### 基本信息
- 基础URL：`http://localhost:8000/api/v1`
- 支持格式：JSON
- 版本：v1

### 请求格式
- Content-Type: application/json
- 字符编码：UTF-8

### 响应格式
```json
{
    "code": 200,
    "message": "success",
    "data": {}
}
```

## 认证方式

### API密钥认证
在请求头中添加：
```
X-API-Key: your-api-key
```

### Bearer Token认证
在请求头中添加：
```
Authorization: Bearer <token>
```

## API端点

### 容器管理

#### 获取容器列表
```
GET /containers
```

请求参数：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 容器状态过滤 |
| limit | integer | 否 | 返回数量限制 |
| offset | integer | 否 | 分页偏移量 |

响应示例：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 10,
        "items": [
            {
                "id": "container_id",
                "name": "container_name",
                "status": "running",
                "image": "image_name",
                "created_at": "2025-04-17T14:30:00Z"
            }
        ]
    }
}
```

#### 创建容器
```
POST /containers
```

请求体：
```json
{
    "name": "container_name",
    "image": "image_name",
    "ports": {
        "80/tcp": 8080
    },
    "environment": {
        "KEY": "value"
    },
    "volumes": [
        {
            "host_path": "/path/on/host",
            "container_path": "/path/in/container"
        }
    ]
}
```

#### 获取容器详情
```
GET /containers/{container_id}
```

#### 启动容器
```
POST /containers/{container_id}/start
```

#### 停止容器
```
POST /containers/{container_id}/stop
```

#### 删除容器
```
DELETE /containers/{container_id}
```

### 镜像管理

#### 获取镜像列表
```
GET /images
```

#### 拉取镜像
```
POST /images/pull
```

请求体：
```json
{
    "name": "image_name",
    "tag": "latest"
}
```

#### 删除镜像
```
DELETE /images/{image_id}
```

### 系统监控

#### 获取资源使用情况
```
GET /metrics/resources
```

响应示例：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "cpu_usage": 45.5,
        "memory_usage": 3.2,
        "disk_usage": 65.8,
        "network": {
            "rx_bytes": 1024,
            "tx_bytes": 2048
        }
    }
}
```

#### 获取容器监控数据
```
GET /metrics/containers/{container_id}
```

### 日志管理

#### 获取容器日志
```
GET /containers/{container_id}/logs
```

请求参数：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tail | integer | 否 | 返回最后N行 |
| since | string | 否 | 开始时间 |
| until | string | 否 | 结束时间 |

## 错误处理

### 错误码说明
| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 错误响应格式
```json
{
    "code": 400,
    "message": "error message",
    "errors": [
        {
            "field": "field_name",
            "message": "error detail"
        }
    ]
}
```

## 示例代码

### Python
```python
import requests

API_KEY = "your-api-key"
BASE_URL = "http://localhost:8000/api/v1"

headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

# 获取容器列表
response = requests.get(f"{BASE_URL}/containers", headers=headers)
print(response.json())

# 创建容器
container_config = {
    "name": "test-container",
    "image": "nginx:latest",
    "ports": {"80/tcp": 8080}
}
response = requests.post(f"{BASE_URL}/containers", 
                        headers=headers,
                        json=container_config)
print(response.json())
```

### JavaScript
```javascript
const API_KEY = 'your-api-key';
const BASE_URL = 'http://localhost:8000/api/v1';

const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
};

// 获取容器列表
fetch(`${BASE_URL}/containers`, { headers })
    .then(response => response.json())
    .then(data => console.log(data));

// 创建容器
const containerConfig = {
    name: 'test-container',
    image: 'nginx:latest',
    ports: { '80/tcp': 8080 }
};

fetch(`${BASE_URL}/containers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(containerConfig)
})
    .then(response => response.json())
    .then(data => console.log(data));
```

### cURL
```bash
# 获取容器列表
curl -X GET "http://localhost:8000/api/v1/containers" \
     -H "X-API-Key: your-api-key"

# 创建容器
curl -X POST "http://localhost:8000/api/v1/containers" \
     -H "X-API-Key: your-api-key" \
     -H "Content-Type: application/json" \
     -d '{
         "name": "test-container",
         "image": "nginx:latest",
         "ports": {"80/tcp": 8080}
     }'
``` 