import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// 懒加载组件
const Layout = React.lazy(() => import('./components/Layout'));
const Home = React.lazy(() => import('./pages/Home'));
const Containers = React.lazy(() => import('./pages/Containers'));
const ContainerDetail = React.lazy(() => import('./pages/ContainerDetail'));
const Settings = React.lazy(() => import('./pages/Settings'));
const TestContainer = React.lazy(() => import('./pages/TestContainer'));
const Monitoring = React.lazy(() => import('./pages/Monitoring'));

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 错误回退组件
const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <h2>出错了</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>重试</button>
    </Box>
  );
};

// 加载组件
const LoadingFallback = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/containers" element={<Containers />} />
                <Route path="/containers/:id" element={<ContainerDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/test" element={<TestContainer />} />
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="*" element={<div>404 - 页面未找到</div>} />
              </Routes>
            </Layout>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
