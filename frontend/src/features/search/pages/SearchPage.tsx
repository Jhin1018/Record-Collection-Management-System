import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { discogsApi, SearchResult } from '../../../services/discogsApi';
import SearchForm from '../components/SearchForm';
import ReleaseCard from '../components/ReleaseCard';

const SearchPage = () => {
  const { query } = useParams<{ query: string }>();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'release';
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [searchType, setSearchType] = useState(initialType);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // 重置分页当搜索查询或类型改变时
  useEffect(() => {
    setPage(1);
  }, [searchQuery, searchType]);

  // 使用 React Query 获取搜索结果
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', searchQuery, searchType, page],
    queryFn: () => discogsApi.search(searchQuery, searchType as any, page, itemsPerPage),
    enabled: !!searchQuery, // 只在有搜索查询时执行
    staleTime: 1000 * 60 * 5, // 5分钟
  });

  // 处理搜索提交
  const handleSearch = (newQuery: string, newType: string) => {
    setSearchQuery(newQuery);
    setSearchType(newType);
  };

  // 处理分页变化
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const results = data?.results || [];
  const totalPages = data?.pagination?.pages || 0;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, mt: 2, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Search Discogs Records
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Find vinyl records, CDs, cassettes and more from the Discogs database
        </Typography>
      </Box>
      
      <SearchForm 
        initialQuery={query || ''} 
        initialType={searchType}
        onSearch={handleSearch} 
      />
      
      <Divider sx={{ my: 3 }} />

      {/* 搜索结果区域 */}
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            Error loading search results. Please try again.
          </Alert>
        ) : results.length === 0 ? (
          searchQuery ? (
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <Typography variant="h6">No results found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search terms or filter criteria
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <Typography variant="h6">Start searching</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enter a search term to find vinyl records, CDs, and more
              </Typography>
            </Box>
          )
        ) : (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {data?.pagination?.items.toLocaleString()} results
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {results.map((item: SearchResult) => (
                <Grid 
                  item 
                  xs={12}       // 小屏幕时显示1个
                  sm={6}        // 中小屏幕显示2个
                  md={4}        // 中等屏幕显示3个
                  lg={3}        // 大屏幕显示4个 (可以考虑大屏幕显示4个)
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

export default SearchPage;