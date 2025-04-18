import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '../store/containerSlice';
import { containerApi } from '../services/api';

const ContainerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchContainer = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await containerApi.getContainer(id);
          setContainer(data);
        }
      } catch (err) {
        setError('获取容器详情失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContainer();
  }, [id]);

  const handleStart = async () => {
    if (container) {
      try {
        setActionLoading('start');
        const updatedContainer = await containerApi.startContainer(container.id);
        setContainer(updatedContainer);
      } catch (err) {
        console.error('启动容器失败:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleStop = async () => {
    if (container) {
      try {
        setActionLoading('stop');
        const updatedContainer = await containerApi.stopContainer(container.id);
        setContainer(updatedContainer);
      } catch (err) {
        console.error('停止容器失败:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDelete = async () => {
    if (container && window.confirm('确定要删除此容器吗？')) {
      try {
        setActionLoading('delete');
        await containerApi.deleteContainer(container.id);
        navigate('/containers');
      } catch (err) {
        console.error('删除容器失败:', err);
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !container) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error || '容器不存在'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/containers')}
          sx={{ mr: 2 }}
        >
          返回
        </Button>
        <Typography variant="h5" component="h1">
          容器详情
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6">{container.name}</Typography>
              <Chip
                label={container.status}
                color={container.status === '运行中' ? 'success' : 'default'}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              镜像
            </Typography>
            <Typography variant="body1">{container.image}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              端口映射
            </Typography>
            <Typography variant="body1">{container.ports || '无'}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              创建时间
            </Typography>
            <Typography variant="body1">{container.createdAt}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              '& .MuiButton-root': {
                minWidth: '120px'
              }
            }}>
              <Button
                variant="contained"
                startIcon={actionLoading === 'start' ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                onClick={handleStart}
                disabled={container.status === '运行中' || !!actionLoading}
              >
                启动
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={actionLoading === 'stop' ? <CircularProgress size={20} /> : <StopIcon />}
                onClick={handleStop}
                disabled={container.status !== '运行中' || !!actionLoading}
              >
                停止
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={actionLoading === 'delete' ? <CircularProgress size={20} /> : <DeleteIcon />}
                onClick={handleDelete}
                disabled={!!actionLoading}
              >
                删除
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ContainerDetail; 