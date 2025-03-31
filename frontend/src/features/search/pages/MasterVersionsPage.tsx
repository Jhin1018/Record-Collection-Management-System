import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { discogsApi, SearchResult } from '../../../services/discogsApi';
import ReleaseCard from '../components/ReleaseCard';

const MasterVersionsPage = () => {
  const { id } = useParams<{ id: string }>();
  const masterId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  // 分页状态
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  
  // 获取主版本详情 - 用于显示标题
  const { data: masterDetails, isLoading: isMasterLoading } = useQuery({
    queryKey: ['master', masterId],
    queryFn: () => discogsApi.getMaster(masterId),
    enabled: !!masterId,
  });
  
  // 获取所有版本
  const {
    data: versionsData,
    isLoading: isVersionsLoading,
    error: versionsError,
  } = useQuery({
    queryKey: ['masterVersions', masterId],
    queryFn: () => discogsApi.getMasterVersions(masterId, 1, 100), // 获取所有版本(最多100个)
    enabled: !!masterId,
    staleTime: 1000 * 60 * 5, // 5分钟
  });
  
  // 处理返回按钮点击
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // 处理分页变化
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // 获取当前页的版本
  const versions = versionsData?.versions || [];
  const totalItems = versions.length;
  
  // 计算要显示的项目
  const displayedVersions = versions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
    
  // 加载中状态
  const isLoading = isMasterLoading || isVersionsLoading;
  
  // 准备适合ReleaseCard的数据结构
  const prepareVersionsForDisplay = (versions: any[]): SearchResult[] => {
    return versions.map(version => {
      // 处理格式数据 - 可能是字符串或数组
      let formats: string[] = [];
      if (version.format) {
        if (Array.isArray(version.format)) {
          formats = version.format;
        } else if (typeof version.format === 'string') {
          formats = version.format.split(', ');
        }
      }
      
      // 处理年份 - 可能来自 released 或 year 字段
      let yearValue = '';
      if (version.released && version.released.length >= 4) {
        yearValue = version.released.substring(0, 4);
      } else if (version.year) {
        yearValue = String(version.year);
      }
      
      // 构建一致的数据结构
      return {
        id: version.id,
        type: 'release',
        title: version.title || '',
        thumb: version.thumb || '',
        year: yearValue,
        format: formats,
        country: version.country || '',
        // 处理标签，可能是字符串或对象
        label: version.label ? 
          (typeof version.label === 'string' ? [version.label] : 
           Array.isArray(version.label) ? version.label.map(l => typeof l === 'string' ? l : l.name || '') : 
           [version.label.name || '']).filter(Boolean) : 
          [],
        genre: version.genre ? (Array.isArray(version.genre) ? version.genre : [version.genre]) : [],
        uri: version.uri || '',
        resource_url: version.resource_url || '',
      };
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 3 }}>
        {/* 导航和标题信息 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          
          {isMasterLoading ? (
            <CircularProgress size={20} sx={{ mr: 2 }} />
          ) : masterDetails ? (
            <Typography variant="h5" component="h1">
              Versions of "{masterDetails.title}"
            </Typography>
          ) : (
            <Typography variant="h5" component="h1">
              Versions
            </Typography>
          )}
        </Box>

        {/* 结果展示部分 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : versionsError ? (
          <Alert severity="error" sx={{ my: 2 }}>
            Error loading versions. Please try again.
          </Alert>
        ) : versions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">No versions found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              There are no versions available for this master release
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                {totalItems} {totalItems === 1 ? ' version' : ' versions'} found
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {prepareVersionsForDisplay(displayedVersions).map((item: SearchResult) => (
                <Grid 
                  item 
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`${item.id}-${item.type}`}
                >
                  <ReleaseCard item={item} />
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default MasterVersionsPage;