import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: string;
  createdAt: string;
}

interface ContainerState {
  containers: Container[];
  loading: boolean;
  error: string | null;
}

const initialState: ContainerState = {
  containers: [],
  loading: false,
  error: null,
};

const containerSlice = createSlice({
  name: 'containers',
  initialState,
  reducers: {
    setContainers: (state, action: PayloadAction<Container[]>) => {
      state.containers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addContainer: (state, action: PayloadAction<Container>) => {
      state.containers.push(action.payload);
    },
    updateContainer: (state, action: PayloadAction<Container>) => {
      const index = state.containers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.containers[index] = action.payload;
      }
    },
    removeContainer: (state, action: PayloadAction<string>) => {
      state.containers = state.containers.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setContainers,
  setLoading,
  setError,
  addContainer,
  updateContainer,
  removeContainer,
} = containerSlice.actions;

export default containerSlice.reducer; 