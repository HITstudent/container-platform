import axios from 'axios';
import { Container } from '../store/containerSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
});

export interface MetricData {
  cpu: ResourceMetric[];
  memory: ResourceMetric[];
  disk: ResourceMetric[];
  network: ResourceMetric[];
}

export interface ResourceMetric {
  timestamp: string;
  value: number;
}

export interface Alarm {
  id: string;
  resource: string;
  threshold: number;
  condition: 'above' | 'below';
  status: 'active' | 'resolved';
  createdAt: string;
}

export const containerApi = {
  // 获取容器列表
  getContainers: async () => {
    const response = await api.get<Container[]>('/containers');
    return response.data;
  },

  // 获取单个容器详情
  getContainer: async (id: string) => {
    const response = await api.get<Container>(`/containers/${id}`);
    return response.data;
  },

  // 创建容器
  createContainer: async (data: Partial<Container>) => {
    const response = await api.post<Container>('/containers', data);
    return response.data;
  },

  // 更新容器
  updateContainer: async (id: string, data: Partial<Container>) => {
    const response = await api.put<Container>(`/containers/${id}`, data);
    return response.data;
  },

  // 删除容器
  deleteContainer: async (id: string) => {
    await api.delete(`/containers/${id}`);
  },

  // 启动容器
  startContainer: async (id: string) => {
    const response = await api.post<Container>(`/containers/${id}/start`);
    return response.data;
  },

  // 停止容器
  stopContainer: async (id: string) => {
    const response = await api.post<Container>(`/containers/${id}/stop`);
    return response.data;
  },

  getMetrics: async (): Promise<MetricData> => {
    const response = await api.get('/metrics');
    return response.data;
  },

  getAlarms: async (): Promise<Alarm[]> => {
    const response = await api.get('/alarms');
    return response.data;
  },
}; 