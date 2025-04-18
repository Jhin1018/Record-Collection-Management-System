import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Paper, 
  Grid, 
  Avatar, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Divider, 
  Chip, 
  IconButton, 
  Card, 
  CardMedia,
  Pagination,
  Alert,
  useTheme,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Album as AlbumIcon, 
  OpenInNew as OpenInNewIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { discogsApi } from '../../../services/discogsApi';

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // 获取艺术家基本信息
  const { data: artist, isLoading: isArtistLoading, error: artistError } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => discogsApi.getArtist(artistId),
    enabled: !!artistId,
  });

  // 获取艺术家的主发行版
  const { data: releases, isLoading: isReleasesLoading, error: releasesError } = useQuery({
    queryKey: ['artistReleases', artistId, page],
    queryFn: () => discogsApi.getArtistReleases(artistId, page, itemsPerPage, 'master'), 
    enabled: !!artistId,
  });

  // 处理返回
  const handleGoBack = () => {
    navigate(-1);
  };

  // 处理分页
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // 处理点击主版本
  const handleMasterClick = (masterId: number) => {
    navigate(`/search/master/${masterId}`);
  };

  // 获取艺术家图片
  const getArtistImage = () => {
    if (artist?.images && artist.images.length > 0) {
      return artist.images[0].uri;
    }
    return '/assets/artist-placeholder.png'; // 占位图
  };

  // 筛选只有 role 为 "main" 的发行版
  const mainReleases = releases?.releases ? 
    releases.releases.filter(release => release.role === 'Main') : [];

  // 动态调整页数
  const calculateTotalPages = () => {
    if (!releases?.pagination) return 0;
    
    // 如果当前页没有主发行版，并且不是第一页，那么上一页就是最后一页
    if (mainReleases.length === 0 && page > 1) {
      return page - 1;
    }
    
    // 如果是第一页且没有主发行版，返回0
    if (mainReleases.length === 0 && page === 1) {
      return 0;
    }
    
    // 如果当前页的主发行版数量少于itemsPerPage，并且API返回的总页数大于当前页，
    // 说明可能有更多不是Main的发行版，但Main的发行版可能到此为止
    if (mainReleases.length < itemsPerPage && 
        releases.pagination.pages > page && 
        mainReleases.length > 0) {
      return page;
    }
    
    // 如果API返回的总页数比当前页还少，则返回API的页数
    if (releases.pagination.pages < page) {
      return releases.pagination.pages;
    }
    
    // 否则至少还有下一页
    return page + 1;
  };

  const totalPages = calculateTotalPages();

  // 加载中状态
  const isLoading = isArtistLoading || isReleasesLoading;
  const error = artistError || releasesError;

  if (isLoading && !artist) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !artist) {
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
            Error loading artist details
          </Typography>
          <Typography>
            {error ? String(error) : 'Unable to load artist information'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        {/* 导航按钮 */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        {/* 艺术家名称 - 顶部 */}
        <Typography variant="h4" component="h1" gutterBottom>
          {artist.name}
        </Typography>
        
        {artist.realname && artist.realname !== artist.name && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Real Name: {artist.realname}
          </Typography>
        )}

        {/* 艺术家信息 */}
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4, mt: 2 }}>
          {/* 使用强制的 flexbox 布局而不是 Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            {/* 左侧：艺术家照片 */}
            <Box sx={{ 
              flexBasis: { md: '33%' }, 
              flexShrink: 0 
            }}>
              <Card>
                <CardMedia
                  component="img"
                  image={getArtistImage()}
                  alt={artist.name}
                  sx={{ 
                    width: '100%',          // 占据容器宽度
                    maxHeight: 450,         // 设置最大高度而不是固定高度
                    objectFit: 'contain',   // 替换为'contain'，保持原图比例不裁剪
                    bgcolor: '#000',        // 黑色背景以便显示任何形状的图片
                  }}
                />
              </Card>
            </Box>

            {/* 右侧：Profile 和其他信息 */}
            <Box sx={{ flex: 1 }}>
              {/* Profile */}
              {artist.profile ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Profile
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="div" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6
                    }}
                  >
                    {artist.profile.length > 500 
                      ? `${artist.profile.substring(0, 500)}...` 
                      : artist.profile}
                  </Typography>
                </Box>
              ) : null}

              {/* 名称变体 */}
              {artist.namevariations && artist.namevariations.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Name Variations
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {artist.namevariations.map((name, index) => (
                      <Chip 
                        key={index} 
                        label={name} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              ) : null}

              {/* 成员 */}
              {artist.members && artist.members.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Members
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {artist.members.map((member, index) => (
                      <Chip 
                        key={index}
                        label={member.name}
                        onClick={() => navigate(`/search/artist/${member.id}`)}
                        clickable
                        variant="outlined"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* 主版本列表 - 只展示 role 为 "Main" 的 */}
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Main Releases
          </Typography>
          
          {isReleasesLoading && (
            <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
              <LinearProgress />
            </Box>
          )}
          
          {releasesError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error loading releases. Please try again.
            </Alert>
          ) : mainReleases.length > 0 ? (
            <>
              <List sx={{ width: '100%' }}>
                {mainReleases.map((release, index) => (
                  <Box key={release.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleMasterClick(release.id)}
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Avatar 
                          variant="rounded"
                          alt={release.title}
                          src={release.thumb || "/assets/record-placeholder.png"}
                          sx={{ width: 56, height: 56 }}
                        >
                          <AlbumIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {release.title}
                            </Typography>
                            <IconButton 
                              size="small"
                              sx={{ ml: 'auto' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMasterClick(release.id);
                              }}
                            >
                              <NavigateNextIcon />
                            </IconButton>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              {release.year && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ mr: 2 }}
                                >
                                  {release.year}
                                </Typography>
                              )}
                              
                              {/* 类型标签 */}
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {release.format && (
                                  <Chip 
                                    label={release.format} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                                {release.genre && (
                                  <Chip 
                                    label={release.genre} 
                                    size="small" 
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                                {release.style && (
                                  <Chip 
                                    label={release.style} 
                                    size="small" 
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < mainReleases.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
              
              {/* 分页控件 */}
              {mainReleases.length > 0 && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No main releases found for this artist.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ArtistDetailPage;