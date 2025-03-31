import { ThemeProvider, CssBaseline } from '@mui/material';
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

// 创建一个 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      retry: 1,
    },
  },
});

// 页面组件导入（暂时用占位符，后续会替换为实际组件）
// 公共页面
const Search = () => <div>搜索页面 (首页)</div>;

// 受保护页面
const Collection = () => <div>收藏页</div>;
const CollectionAdd = () => <div>添加新唱片</div>;
const CollectionDetail = () => <div>唱片详情</div>;
const CollectionEdit = () => <div>编辑唱片</div>;
const Analytics = () => <div>数据分析</div>;
const AnalyticsValue = () => <div>价值分析</div>;
const AnalyticsGenres = () => <div>风格分布</div>;
const AnalyticsFormat = () => <div>格式比较</div>;
const Market = () => <div>市场数据</div>;
const MarketTrends = () => <div>价格趋势</div>;
const Profile = () => <div>用户个人资料</div>;
const NotFound = () => <div>页面不存在</div>;

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
                <Route index element={<Search />} />
                <Route path="search/:query?" element={<Search />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                
                {/* 受保护路由 */}
                <Route
                  path="collection"
                  element={
                    <ProtectedRoute>
                      <Collection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="collection/add"
                  element={
                    <ProtectedRoute>
                      <CollectionAdd />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="collection/:id"
                  element={
                    <ProtectedRoute>
                      <CollectionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="collection/:id/edit"
                  element={
                    <ProtectedRoute>
                      <CollectionEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics/value"
                  element={
                    <ProtectedRoute>
                      <AnalyticsValue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics/genres"
                  element={
                    <ProtectedRoute>
                      <AnalyticsGenres />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics/format"
                  element={
                    <ProtectedRoute>
                      <AnalyticsFormat />
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
                  path="market/trends"
                  element={
                    <ProtectedRoute>
                      <MarketTrends />
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
