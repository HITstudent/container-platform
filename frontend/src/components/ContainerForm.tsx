import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { Container } from '../store/containerSlice';

interface ContainerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Container>) => void;
  container?: Container;
  title: string;
}

const ContainerForm: React.FC<ContainerFormProps> = ({
  open,
  onClose,
  onSubmit,
  container,
  title,
}) => {
  const [formData, setFormData] = useState<Partial<Container>>({
    name: '',
    image: '',
    ports: '',
  });

  useEffect(() => {
    if (container) {
      setFormData({
        name: container.name,
        image: container.image,
        ports: container.ports,
      });
    }
  }, [container]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="容器名称"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="image"
                  label="镜像"
                  value={formData.image}
                  onChange={handleChange}
                  fullWidth
                  required
                  helperText="例如: nginx:latest"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="ports"
                  label="端口映射"
                  value={formData.ports}
                  onChange={handleChange}
                  fullWidth
                  helperText="例如: 80:80, 3306:3306"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained" color="primary">
            确定
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContainerForm; 