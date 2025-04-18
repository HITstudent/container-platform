import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import FolderIcon from '@mui/icons-material/Folder';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Settings {
  dockerApiUrl: string;
  dataPath: string;
  autoUpdate: boolean;
  logCollection: boolean;
  maxContainers: number;
  defaultRegistry: string;
  backupEnabled: boolean;
  backupPath: string;
  backupInterval: number;
}

const validationSchema = yup.object({
  dockerApiUrl: yup
    .string()
    .url('请输入有效的 URL')
    .required('Docker API 地址不能为空'),
  dataPath: yup
    .string()
    .required('数据存储路径不能为空'),
  maxContainers: yup
    .number()
    .min(1, '容器数量必须大于 0')
    .max(100, '容器数量不能超过 100')
    .required('最大容器数量不能为空'),
  defaultRegistry: yup
    .string()
    .required('默认镜像仓库不能为空'),
  backupPath: yup
    .string()
    .test('backup-path-required', '备份路径不能为空', function(value) {
      const { backupEnabled } = this.parent;
      return !backupEnabled || (backupEnabled && value !== undefined && value !== '');
    }),
  backupInterval: yup
    .number()
    .test('backup-interval-required', '备份间隔不能为空', function(value) {
      const { backupEnabled } = this.parent;
      return !backupEnabled || (backupEnabled && value !== undefined && value !== null);
    })
    .test('backup-interval-range', '备份间隔必须在 1-24 小时之间', function(value) {
      const { backupEnabled } = this.parent;
      return !backupEnabled || (backupEnabled && value !== undefined && value !== null && value >= 1 && value <= 24);
    }),
});

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<Settings>({
    initialValues: {
      dockerApiUrl: 'http://localhost:2375',
      dataPath: '/var/lib/docker',
      autoUpdate: true,
      logCollection: true,
      maxContainers: 10,
      defaultRegistry: 'docker.io',
      backupEnabled: false,
      backupPath: '/var/backups/docker',
      backupInterval: 12,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        // TODO: 调用 API 保存设置
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 API 调用
        setSaveSuccess(true);
      } catch (err) {
        setError('保存设置失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: 调用 API 测试连接
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 API 调用
      setSaveSuccess(true);
    } catch (err) {
      setError('连接测试失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        系统设置
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本设置
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="dockerApiUrl"
                  name="dockerApiUrl"
                  label="Docker API 地址"
                  value={formik.values.dockerApiUrl}
                  onChange={formik.handleChange}
                  error={formik.touched.dockerApiUrl && Boolean(formik.errors.dockerApiUrl)}
                  helperText={formik.touched.dockerApiUrl && formik.errors.dockerApiUrl}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="测试连接">
                          <IconButton
                            onClick={handleTestConnection}
                            disabled={loading}
                            edge="end"
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="dataPath"
                  name="dataPath"
                  label="数据存储路径"
                  value={formik.values.dataPath}
                  onChange={formik.handleChange}
                  error={formik.touched.dataPath && Boolean(formik.errors.dataPath)}
                  helperText={formik.touched.dataPath && formik.errors.dataPath}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="选择目录">
                          <IconButton edge="end">
                            <FolderIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="maxContainers"
                  name="maxContainers"
                  label="最大容器数量"
                  type="number"
                  value={formik.values.maxContainers}
                  onChange={formik.handleChange}
                  error={formik.touched.maxContainers && Boolean(formik.errors.maxContainers)}
                  helperText={formik.touched.maxContainers && formik.errors.maxContainers}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="defaultRegistry"
                  name="defaultRegistry"
                  label="默认镜像仓库"
                  value={formik.values.defaultRegistry}
                  onChange={formik.handleChange}
                  error={formik.touched.defaultRegistry && Boolean(formik.errors.defaultRegistry)}
                  helperText={formik.touched.defaultRegistry && formik.errors.defaultRegistry}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                高级设置
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.autoUpdate}
                    onChange={(e) => formik.setFieldValue('autoUpdate', e.target.checked)}
                  />
                }
                label="自动更新容器"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.logCollection}
                    onChange={(e) => formik.setFieldValue('logCollection', e.target.checked)}
                  />
                }
                label="启用容器日志收集"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                备份设置
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.backupEnabled}
                    onChange={(e) => formik.setFieldValue('backupEnabled', e.target.checked)}
                  />
                }
                label="启用自动备份"
              />
              {formik.values.backupEnabled && (
                <>
                  <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                    <TextField
                      fullWidth
                      id="backupPath"
                      name="backupPath"
                      label="备份路径"
                      value={formik.values.backupPath}
                      onChange={formik.handleChange}
                      error={formik.touched.backupPath && Boolean(formik.errors.backupPath)}
                      helperText={formik.touched.backupPath && formik.errors.backupPath}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="选择目录">
                              <IconButton edge="end">
                                <FolderIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      id="backupInterval"
                      name="backupInterval"
                      label="备份间隔（小时）"
                      type="number"
                      value={formik.values.backupInterval}
                      onChange={formik.handleChange}
                      error={formik.touched.backupInterval && Boolean(formik.errors.backupInterval)}
                      helperText={formik.touched.backupInterval && formik.errors.backupInterval}
                    />
                  </FormControl>
                </>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  保存设置
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </form>

      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        message="设置已保存"
      />
    </Box>
  );
};

export default Settings; 