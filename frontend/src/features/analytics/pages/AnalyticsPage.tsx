import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { 
  Album as AlbumIcon,
  AttachMoney as MoneyIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../auth/hooks/useAuth';
import { collectionApi } from '../../../services/collectionApi';
import { analyticsApi } from '../../../services/analyticsApi';

// 注册 Chart.js 组件
ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // 获取收藏总量
  const collectionQuery = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => collectionApi.getUserCollection(user?.id || 0),
    enabled: !!user?.id,
  });

  // 获取收藏总价值
  const valueQuery = useQuery({
    queryKey: ['collection-value', user?.id],
    queryFn: () => analyticsApi.getCollectionValue(user?.id || 0),
    enabled: !!user?.id,
  });

  // 获取流派分布
  const genreQuery = useQuery({
    queryKey: ['genre-distribution', user?.id],
    queryFn: () => analyticsApi.getGenreDistribution(user?.id || 0),
    enabled: !!user?.id,
  });

  // 检查加载状态
  const isLoading = collectionQuery.isLoading || valueQuery.isLoading || genreQuery.isLoading;
  
  // 检查错误状态
  const hasError = collectionQuery.error || valueQuery.error || genreQuery.error;
  const errorMessage = (collectionQuery.error || valueQuery.error || genreQuery.error)?.toString();

  // 获取收藏总量 - 兼容不同的数据格式
  const collectionCount = (() => {
    if (Array.isArray(collectionQuery.data?.data)) {
      return collectionQuery.data.data.length;
    } else if (Array.isArray(collectionQuery.data)) {
      return collectionQuery.data.length;
    }
    return 0;
  })();

  // 获取总价值和货币单位 - 兼容不同的数据格式
  const collectionValue = (() => {
    // 如果是 { data: { total_value, currency } } 格式
    if (valueQuery.data?.data && typeof valueQuery.data.data === 'object') {
      return valueQuery.data.data;
    }
    // 如果直接是 { total_value, currency } 格式
    else if (valueQuery.data && typeof valueQuery.data === 'object') {
      return valueQuery.data;
    }
    return null;
  })();

  // 直接使用 API 返回的数据
  const genreDistribution = genreQuery.data;
  
  // 准备饼图数据
  const prepareChartData = (genreData?: any) => {
    if (!genreData) {
      return null;
    }
    
    // 安全地获取 labels 和 data
    const labels = Array.isArray(genreData.labels) ? genreData.labels : [];
    const data = Array.isArray(genreData.data) ? genreData.data : [];
    
    // 如果没有有效数据，返回 null
    if (labels.length === 0 || data.length === 0) {
      return null;
    }
    
    // 定义一系列不同颜色用于饼图
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(40, 159, 64, 0.7)',
      'rgba(210, 199, 199, 0.7)',
    ];
    
    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Records',
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData(genreDistribution);

  // 加载状态
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 错误状态
  if (hasError) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ my: 4 }}>
          Error loading analytics data: {errorMessage}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Collection Analytics
        </Typography>

        {/* 卡片区域 - 两张卡片各占一半 */}
        <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
          {/* 收藏总量卡片 */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <AlbumIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Total Records
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {collectionCount}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  records in your collection
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 收藏总价值卡片 */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.success.light,
                color: theme.palette.success.contrastText
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <MoneyIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {collectionValue ? `${collectionValue.currency} ${collectionValue.total_value}` : 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  total purchase value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 流派分布饼图 - 独立一行，居中展示 */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4,
            backgroundColor: theme.palette.background.paper  
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            Collection by Genre
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              maxWidth: '600px',
              margin: '0 auto',
              p: 3,
              borderRadius: 2,
              // 添加更浅的背景色
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.grey[800] // 暗模式下使用更浅的灰色
                : theme.palette.grey[50],  // 亮模式下使用近乎白色的灰色
            }}
          >
            {chartData ? (
              <Pie 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        boxWidth: 12,
                        font: {
                          size: 13
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = Math.round((value as number / total) * 100);
                          return `${label}: ${percentage}%`;
                        }
                      }
                    }
                  },
                }}
              />
            ) : (
              <Typography color="text.secondary">
                No genre data available
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AnalyticsPage;