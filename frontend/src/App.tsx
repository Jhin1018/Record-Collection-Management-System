import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import { RouterProvider, createBrowserRouter, Outlet, BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './styles/theme';
import './styles/global.css';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';

// 页面导入
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import SearchPage from './features/search/pages/SearchPage';
import ReleaseDetailPage from './features/search/pages/ReleaseDetailPage';
import MasterDetailPage from './features/search/pages/MasterDetailPage';
import ArtistDetailPage from './features/search/pages/ArtistDetailPage';
import MasterVersionsPage from './features/search/pages/MasterVersionsPage';
import CollectionPage from './features/collection/pages/CollectionPage';
import WantlistPage from './features/wantlist/pages/WantListPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';

// 创建一个 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      retry: 1,
    },
  },
});

// 更新为英文的占位符组件，附带"working on it"提示
const Market = () => (
  <Container maxWidth="lg">
    <Box sx={{ my: 6, textAlign: 'center' }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Market Data
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          We're working on this feature. Stay tuned for market insights and price trends!
        </Typography>
      </Paper>
    </Box>
  </Container>
);

const Profile = () => (
  <Container maxWidth="lg">
    <Box sx={{ my: 6, textAlign: 'center' }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          We're working on this feature. Soon you'll be able to manage your profile settings here!
        </Typography>
      </Paper>
    </Box>
  </Container>
);

const NotFound = () => (
  <Container maxWidth="lg">
    <Box sx={{ my: 6, textAlign: 'center' }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Typography variant="body2" sx={{ mt: 3 }}>
          Please check the URL or navigate back to the home page.
        </Typography>
      </Paper>
    </Box>
  </Container>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* 公共路由 */}
                <Route index element={<SearchPage />} />
                <Route path="search/:query?" element={<SearchPage />} />
                
                {/* 详情页路由 - 公共可访问 */}
                <Route path="search/release/:id" element={<ReleaseDetailPage />} />
                <Route path="search/master/:id" element={<MasterDetailPage />} />
                <Route path="search/master/:id/versions" element={<MasterVersionsPage />} />
                <Route path="search/artist/:id" element={<ArtistDetailPage />} />
                
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                
                {/* 受保护路由 */}
                <Route
                  path="collection"
                  element={
                    <ProtectedRoute>
                      <CollectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="market"
                  element={
                    <ProtectedRoute>
                      <Market />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wantlist"
                  element={
                    <ProtectedRoute>
                      <WantlistPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 路由 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
