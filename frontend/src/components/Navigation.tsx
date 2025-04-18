import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';

const Navigation: React.FC = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<DashboardIcon />}
        color="inherit"
      >
        仪表盘
      </Button>
      <Button
        component={RouterLink}
        to="/containers"
        startIcon={<StorageIcon />}
        color="inherit"
      >
        容器管理
      </Button>
      <Button
        component={RouterLink}
        to="/settings"
        startIcon={<SettingsIcon />}
        color="inherit"
      >
        系统设置
      </Button>
    </Stack>
  );
};

export default Navigation; 