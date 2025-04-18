import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

interface Container {
  id: string;
  name: string;
  status: string;
  image: string;
  created: string;
}

const TestContainer: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const fetchContainers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/containers');
      setContainers(response.data);
      setError('');
    } catch (err) {
      setError('获取容器列表失败');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleCreateContainer = async () => {
    try {
      await axios.post('http://localhost:8000/api/containers', null, {
        params: { image, name }
      });
      setImage('');
      setName('');
      fetchContainers();
      setError('');
    } catch (err) {
      setError('创建容器失败');
      console.error(err);
    }
  };

  const handleStartContainer = async (id: string) => {
    try {
      await axios.post(`http://localhost:8000/api/containers/${id}/start`);
      fetchContainers();
      setError('');
    } catch (err) {
      setError('启动容器失败');
      console.error(err);
    }
  };

  const handleStopContainer = async (id: string) => {
    try {
      await axios.post(`http://localhost:8000/api/containers/${id}/stop`);
      fetchContainers();
      setError('');
    } catch (err) {
      setError('停止容器失败');
      console.error(err);
    }
  };

  const handleRemoveContainer = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/containers/${id}`);
      fetchContainers();
      setError('');
    } catch (err) {
      setError('删除容器失败');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          容器测试页面
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="镜像名称"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="例如: nginx:latest"
            />
            <TextField
              label="容器名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如: my-nginx"
            />
            <Button
              variant="contained"
              onClick={handleCreateContainer}
              disabled={!image || !name}
            >
              创建容器
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>名称</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>镜像</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {containers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell>{container.id.slice(0, 12)}</TableCell>
                  <TableCell>{container.name}</TableCell>
                  <TableCell>{container.status}</TableCell>
                  <TableCell>{container.image}</TableCell>
                  <TableCell>
                    {new Date(container.created).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {container.status === 'exited' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleStartContainer(container.id)}
                        >
                          启动
                        </Button>
                      )}
                      {container.status === 'running' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          onClick={() => handleStopContainer(container.id)}
                        >
                          停止
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveContainer(container.id)}
                      >
                        删除
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default TestContainer; 