import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          欢迎使用容器平台
        </Typography>
        <Typography variant="body1" color="text.secondary">
          这是一个用于管理和部署容器的平台，提供简单易用的界面来管理您的容器化应用。
        </Typography>
      </Box>
    </Paper>
  );
};

export default Home; 