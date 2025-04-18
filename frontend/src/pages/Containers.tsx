import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '../store/containerSlice';
import { containerApi } from '../services/api';
import ContainerForm from '../components/ContainerForm';

const Containers: React.FC = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await containerApi.getContainers();
      if (!Array.isArray(data)) {
        console.error('API返回的数据不是数组:', data);
        setError('获取容器列表失败：数据格式错误');
        setContainers([]);
        return;
      }
      setContainers(data);
    } catch (err) {
      setError('获取容器列表失败');
      console.error(err);
      setContainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleCreateContainer = async (data: Partial<Container>) => {
    try {
      setActionLoading('create');
      await containerApi.createContainer(data);
      setIsFormOpen(false);
      fetchContainers();
    } catch (err) {
      console.error('创建容器失败:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartContainer = async (id: string) => {
    try {
      setActionLoading(`start-${id}`);
      await containerApi.startContainer(id);
      fetchContainers();
    } catch (err) {
      console.error('启动容器失败:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStopContainer = async (id: string) => {
    try {
      setActionLoading(`stop-${id}`);
      await containerApi.stopContainer(id);
      fetchContainers();
    } catch (err) {
      console.error('停止容器失败:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContainer = async (id: string) => {
    if (window.confirm('确定要删除此容器吗？')) {
      try {
        setActionLoading(`delete-${id}`);
        await containerApi.deleteContainer(id);
        fetchContainers();
      } catch (err) {
        console.error('删除容器失败:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredContainers = Array.isArray(containers) ? containers.filter(container =>
    container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.image.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const paginatedContainers = filteredContainers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && containers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" component="h1">
          容器列表
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchContainers}
            disabled={loading}
          >
            刷新
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            disabled={!!actionLoading}
          >
            创建容器
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索容器名称或镜像..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>镜像</TableCell>
              <TableCell>端口映射</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContainers.map((container) => (
              <TableRow key={container.id}>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/containers/${container.id}`)}
                    sx={{ textTransform: 'none' }}
                  >
                    {container.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <Chip
                    label={container.status}
                    color={container.status === '运行中' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{container.image}</TableCell>
                <TableCell>{container.ports || '无'}</TableCell>
                <TableCell>{container.createdAt}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="启动">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleStartContainer(container.id)}
                        disabled={container.status === '运行中' || !!actionLoading}
                      >
                        {actionLoading === `start-${container.id}` ? (
                          <CircularProgress size={20} />
                        ) : (
                          <PlayArrowIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="停止">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleStopContainer(container.id)}
                        disabled={container.status !== '运行中' || !!actionLoading}
                      >
                        {actionLoading === `stop-${container.id}` ? (
                          <CircularProgress size={20} />
                        ) : (
                          <StopIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteContainer(container.id)}
                        disabled={!!actionLoading}
                      >
                        {actionLoading === `delete-${container.id}` ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginatedContainers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    {searchTerm ? '没有找到匹配的容器' : '暂无容器'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredContainers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每页行数"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
        />
      </TableContainer>

      <ContainerForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateContainer}
        title="创建容器"
      />
    </Box>
  );
};

export default Containers; 