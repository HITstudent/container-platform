import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { containerApi } from '../services/api';

interface ResourceMetric {
  timestamp: string;
  value: number;
}

interface Alarm {
  id: string;
  resource: string;
  threshold: number;
  condition: 'above' | 'below';
  status: 'active' | 'resolved';
  createdAt: string;
}

interface MetricData {
  cpu: ResourceMetric[];
  memory: ResourceMetric[];
  disk: ResourceMetric[];
  network: ResourceMetric[];
}

const Monitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData>({
    cpu: [],
    memory: [],
    disk: [],
    network: []
  });
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await containerApi.getMetrics();
      setMetrics(response);
      setError(null);
    } catch (err) {
      setError('获取指标数据失败');
      console.error('Error fetching metrics:', err);
    }
  };

  const fetchAlarms = async () => {
    try {
      const response = await containerApi.getAlarms();
      setAlarms(response);
    } catch (err) {
      console.error('Error fetching alarms:', err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchAlarms();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchAlarms();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CPU 使用率
              </Typography>
              <Box sx={{ height: 300 }}>
                <LineChart width={500} height={300} data={metrics.cpu}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip formatter={formatValue} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#1976d2" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                内存使用率
              </Typography>
              <Box sx={{ height: 300 }}>
                <LineChart width={500} height={300} data={metrics.memory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip formatter={formatValue} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#2e7d32" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                磁盘使用率
              </Typography>
              <Box sx={{ height: 300 }}>
                <LineChart width={500} height={300} data={metrics.disk}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip formatter={formatValue} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ed6c02" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                网络使用率
              </Typography>
              <Box sx={{ height: 300 }}>
                <LineChart width={500} height={300} data={metrics.network}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip formatter={formatValue} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#9c27b0" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            告警
          </Typography>
          {alarms.map(alarm => (
            <Alert
              key={alarm.id}
              severity={alarm.status === 'active' ? 'error' : 'success'}
              sx={{ mb: 1 }}
            >
              {`${alarm.resource} ${alarm.condition} ${alarm.threshold}%`}
            </Alert>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Monitoring;