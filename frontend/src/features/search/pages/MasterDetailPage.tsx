import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Grid, 
  Paper, 
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardMedia,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  List,
  ListItem,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  ArrowBack as ArrowBackIcon,
  ViewList as ViewListIcon,
  MusicNote as MusicNoteIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { discogsApi, MasterDetails } from '../../../services/discogsApi';
import ImageCarousel from '../components/ImageCarousel';

const MasterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const masterId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const theme = useTheme();

  // 获取主版本详情
  const { data: master, isLoading, error } = useQuery({
    queryKey: ['master', masterId],
    queryFn: () => discogsApi.getMaster(masterId),
    enabled: !!masterId,
  });

  // 处理查看所有版本
  const handleViewAllVersions = () => {
    navigate(`/search/master/${masterId}/versions`);
  };

  // 处理返回
  const handleGoBack = () => {
    navigate(-1);
  };

  // 加载中状态
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 错误状态
  if (error || !master) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" color="error">
            Error loading master details
          </Typography>
          <Typography>
            {error ? String(error) : 'Unable to load master information'}
          </Typography>
        </Box>
      </Container>
    );
  }

  // 提取艺术家名称
  const artistNames = master.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist';
  
  // 获取主要图片URL
  const mainImageUrl = master.images && master.images.length > 0
    ? master.images[0].uri
    : master.thumb || '/assets/record-placeholder.png';

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        {/* 导航按钮 - 改为 "Back" */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
          {/* 标题和艺术家信息 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {master.title}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              {artistNames}
            </Typography>
          </Box>

          {/* 基本信息表格 */}
          <Box sx={{ mb: 3 }}>
            <Table size="small">
              <TableBody>
                {/* 发行年份 */}
                {master.year && (
                  <TableRow>
                    <TableCell 
                      component="th" 
                      sx={{ width: '30%', fontWeight: 'bold', py: 1 }}
                    >
                      Released Year
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {master.year}
                    </TableCell>
                  </TableRow>
                )}
                
                {/* 版本数量 */}
                {master.versions_count && (
                  <TableRow>
                    <TableCell 
                      component="th" 
                      sx={{ fontWeight: 'bold', py: 1 }}
                    >
                      Versions
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {master.versions_count}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* 流派和风格 - 现在移到轮播图上方 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Genres & Styles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {master.genres?.map(genre => (
                <Chip 
                  key={genre} 
                  label={genre} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
              {/* 删除 small 样式 */}
              {master.styles?.map(style => (
                <Chip 
                  key={style} 
                  label={style} 
                  variant="outlined" 
                />
              ))}
            </Box>
          </Box>

          {/* 图片轮播 - 占据整个页面宽度 */}
          <Box sx={{ mb: 3 }}>
            {master.images && master.images.length > 0 ? (
              <ImageCarousel images={master.images} />
            ) : (
              <Card>
                <CardMedia
                  component="img"
                  image={mainImageUrl}
                  alt={master.title}
                  sx={{ 
                    height: 400,
                    objectFit: 'contain',
                    bgcolor: 'black',
                  }}
                />
              </Card>
            )}
          </Box>

          {/* 查看所有版本按钮 */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mb: 3 
          }}>
            <Button
              variant="contained"
              startIcon={<ViewListIcon />}
              onClick={handleViewAllVersions}
              color="primary"
              sx={{ minWidth: 200 }}
            >
              View All Versions
            </Button>
          </Box>

          {/* 曲目列表 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Tracklist
            </Typography>
            <List disablePadding>
              {master.tracklist.map((track, index) => (
                <ListItem 
                  key={index}
                  disablePadding
                  sx={{ 
                    py: 0.5, 
                    borderBottom: index < master.tracklist.length - 1 ? 
                      `1px solid ${theme.palette.divider}` : 'none',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {/* 位置编号 */}
                    <Typography 
                      sx={{ 
                        width: 40, 
                        flexShrink: 0, 
                        fontWeight: 'medium',
                        color: 'text.secondary'
                      }}
                    >
                      {track.position || (index + 1)}
                    </Typography>
                    
                    {/* 曲目标题 */}
                    <Typography 
                      sx={{ 
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {track.title}
                      {track.artists && (
                        <Typography 
                          component="span" 
                          sx={{ color: 'text.secondary', ml: 1, fontSize: '0.9em' }}
                        >
                          - {track.artists.map(a => a.name).join(', ')}
                        </Typography>
                      )}
                    </Typography>
                    
                    {/* 时长 */}
                    {track.duration && (
                      <Typography 
                        sx={{ 
                          ml: 2, 
                          color: 'text.secondary',
                          flexShrink: 0
                        }}
                      >
                        {track.duration}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* 备注 */}
          {master.notes && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Notes
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  backgroundColor: 'background.paper',
                  p: 2,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                {master.notes}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default MasterDetailPage;