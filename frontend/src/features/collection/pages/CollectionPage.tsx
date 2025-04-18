import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Divider, 
  Chip, 
  Tooltip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
  TablePagination,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
  Stack,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Album as AlbumIcon,
  OpenInNew as OpenInNewIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  CompareArrows as CompareArrowsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, compareAsc, compareDesc } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { collectionApi, CollectionItem, UpdateCollectionParams, DeleteCollectionParams } from '../../../services/collectionApi';
import { analyticsApi, PriceComparisonItem } from '../../../services/analyticsApi';
import CollectionForm, { CollectionFormData } from '../components/CollectionForm';

// 排序字段类型
type SortField = 'artist' | 'title' | 'purchase_date';

// 排序方向类型
type SortDirection = 'asc' | 'desc';

// 安全地格式化价格
const formatPrice = (price: any): string => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  
  try {
    const numPrice = parseFloat(String(price));
    if (isNaN(numPrice)) return '0.00';
    return numPrice.toFixed(2);
  } catch (e) {
    return '0.00';
  }
};

// 安全地转换价格为数字
const parsePrice = (price: any): number => {
  if (typeof price === 'number') return price;
  try {
    const numPrice = parseFloat(String(price));
    return isNaN(numPrice) ? 0 : numPrice;
  } catch (e) {
    return 0;
  }
};

const CollectionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // 当前选择的收藏项
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  
  // 对话框控制
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 分页状态
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // 排序状态
  const [sortField, setSortField] = useState<SortField>('purchase_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // 价格比较状态
  const [showPriceComparison, setShowPriceComparison] = useState(false);
  
  // 获取收藏列表
  const { data, isLoading, error } = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => collectionApi.getUserCollection(user?.id || 0),
    enabled: !!user?.id,
  });

  // 获取价格比较数据
  const { 
    data: priceComparisonData, 
    isLoading: isLoadingPriceComparison, 
    isFetching: isFetchingPriceComparison,
    isError: isPriceComparisonError,
    refetch: fetchPriceComparison
  } = useQuery({
    queryKey: ['priceComparison', user?.id],
    queryFn: () => analyticsApi.getPriceComparison(user?.id || 0),
    enabled: false, // 不自动请求，等待用户点击按钮
  });

  // 更新收藏的mutation
  const updateMutation = useMutation({
    mutationFn: (params: UpdateCollectionParams) => collectionApi.updateCollection(params),
    onSuccess: () => {
      // 更新缓存中的数据
      queryClient.invalidateQueries({ queryKey: ['collection', user?.id] });
      setEditDialogOpen(false);
    }
  });

  // 删除收藏的mutation
  const deleteMutation = useMutation({
    mutationFn: (params: DeleteCollectionParams) => collectionApi.removeFromCollection(params),
    onSuccess: () => {
      // 更新缓存中的数据
      queryClient.invalidateQueries({ queryKey: ['collection', user?.id] });
      setDeleteDialogOpen(false);
    }
  });

  // 处理价格比较按钮点击 - 添加调试日志
  const handlePriceCompareClick = () => {
    console.log("Price compare button clicked");
    setShowPriceComparison(true);
    fetchPriceComparison().then(result => {
      console.log("Price comparison data fetched:", result);
    }).catch(error => {
      console.error("Error fetching price comparison:", error);
    });
  };

  // 创建价格比较数据映射 (release_id -> price comparison item)
  const priceComparisonMap = useMemo(() => {
    // 修改这里以正确处理 API 响应结构
    if (!priceComparisonData?.data) return new Map();
    
    const map = new Map<number, PriceComparisonItem>();
    priceComparisonData.data.forEach((item: PriceComparisonItem) => {
      map.set(item.release_id, item);
    });
    
    return map;
  }, [priceComparisonData]);

  // 排序并应用分页的数据
  const sortedAndPaginatedItems = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];
    
    // 首先克隆数据以避免修改原始数据
    const items = [...data.data];
    
    // 根据所选字段和方向排序
    items.sort((a, b) => {
      switch (sortField) {
        case 'artist':
          return sortDirection === 'asc'
            ? a.release.artist.localeCompare(b.release.artist)
            : b.release.artist.localeCompare(a.release.artist);
        
        case 'title':
          return sortDirection === 'asc'
            ? a.release.title.localeCompare(b.release.title)
            : b.release.title.localeCompare(a.release.title);
        
        case 'purchase_date':
          try {
            const dateA = parseISO(a.purchase_date);
            const dateB = parseISO(b.purchase_date);
            return sortDirection === 'asc'
              ? compareAsc(dateA, dateB)
              : compareDesc(dateA, dateB);
          } catch (e) {
            return 0;
          }
        
        default:
          return 0;
      }
    });
    
    // 应用分页
    return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data?.data, sortField, sortDirection, page, rowsPerPage]);

  // 处理页面变更
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  // 处理每页行数变更
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 重置到第一页
  };

  // 处理排序字段变更
  const handleSortFieldChange = (event: SelectChangeEvent) => {
    setSortField(event.target.value as SortField);
  };

  // 处理排序方向变更
  const handleSortDirectionChange = (
    event: React.MouseEvent<HTMLElement>,
    newDirection: SortDirection,
  ) => {
    if (newDirection !== null) {
      setSortDirection(newDirection);
    }
  };

  // 处理编辑
  const handleEdit = (item: CollectionItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (item: CollectionItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (!selectedItem || !user?.id) return;
    
    deleteMutation.mutate({
      user_id: user.id,
      collection_id: selectedItem.collection_id
    });
  };

  // 处理更新表单提交
  const handleUpdateSubmit = (formData: CollectionFormData) => {
    if (!selectedItem || !user?.id) return;
    
    const updateData: UpdateCollectionParams = {
      user_id: user.id,
      collection_id: selectedItem.collection_id,
      quantity: formData.quantity,
      purchase_price: parsePrice(formData.purchase_price),
      purchase_date: format(formData.purchase_date, 'yyyy-MM-dd HH:mm:ss'),
      description: formData.description || undefined
    };
    
    updateMutation.mutate(updateData);
  };

  // 跳转到详情页
  const handleViewDetails = (releaseId: number) => {
    navigate(`/search/release/${releaseId}`);
  };

  // 跳转到添加页面
  const handleAddNew = () => {
    navigate('/search');
  };

  // 渲染价格比较指示器
  const renderPriceComparisonIndicator = (releaseId: number, purchasePrice: number) => {
    const comparisonItem = priceComparisonMap.get(releaseId);
    if (!comparisonItem) {
      console.log(`No comparison data found for release ${releaseId}`);
      return null;
    }

    console.log(`Rendering comparison for release ${releaseId}:`, comparisonItem);
    
    const marketPrice = comparisonItem.market_price_cad;
    const gainLoss = comparisonItem.gain_loss;
    const gainLossPercent = (gainLoss / purchasePrice) * 100;
    
    let color = theme.palette.info.main; // Default color
    let icon = <TrendingFlatIcon fontSize="small" />;
    
    if (gainLoss > 0) {
      color = theme.palette.success.main;
      icon = <TrendingUpIcon fontSize="small" />;
    } else if (gainLoss < 0) {
      color = theme.palette.error.main;
      icon = <TrendingDownIcon fontSize="small" />;
    }

    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        mt: 1,
        maxWidth: { xs: '120px', sm: '170px' },  // 设置最大宽度，响应式适应不同屏幕
        mr: 'auto'  // 确保靠左对齐
      }}>
        <Chip 
          label={`Market: $${formatPrice(marketPrice)}`}
          size="small"
          sx={{ 
            bgcolor: 'background.paper', 
            borderColor: color,
            color: color,
            '& .MuiChip-label': { fontWeight: 500 }
          }}
          variant="outlined"
        />
        <Chip 
          icon={icon}
          label={`${gainLoss > 0 ? '+' : ''}${formatPrice(gainLoss)} (${gainLossPercent.toFixed(1)}%)`}
          size="small"
          sx={{ 
            mt: 0.5,
            bgcolor: 'background.paper',
            borderColor: color,
            color: color
          }}
          variant="outlined"
        />
      </Box>
    );
  };

  // 加载状态
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ my: 4 }}>
          Error loading collection: {String(error)}
        </Alert>
      </Container>
    );
  }

  // 准备集合数据 - 确保数据结构正确
  const collectionItems = Array.isArray(data?.data) ? data.data : [];
  const isEmpty = collectionItems.length === 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1">
            Your Collection
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isEmpty && (
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<CompareArrowsIcon />}
                onClick={handlePriceCompareClick}
                disabled={isFetchingPriceComparison}
              >
                {isFetchingPriceComparison ? 'Loading...' : 'Price Compare'}
              </Button>
            )}
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add New Record
            </Button>
          </Box>
        </Box>

        {isPriceComparisonError && showPriceComparison && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load price comparison data. Please try again.
          </Alert>
        )}

        {isEmpty ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your collection is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start building your collection by searching for records you own.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{ mt: 2 }}
            >
              Browse Records
            </Button>
          </Paper>
        ) : (
          <Paper elevation={2}>
            {/* 排序控制区域 */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                alignItems={{ xs: 'stretch', sm: 'center' }}
              >
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="sort-field-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-field-label"
                    value={sortField}
                    label="Sort By"
                    onChange={handleSortFieldChange}
                  >
                    <MenuItem value="artist">Artist</MenuItem>
                    <MenuItem value="title">Album Title</MenuItem>
                    <MenuItem value="purchase_date">Purchase Date</MenuItem>
                  </Select>
                </FormControl>
                
                <ToggleButtonGroup
                  value={sortDirection}
                  exclusive
                  onChange={handleSortDirectionChange}
                  aria-label="sort direction"
                  size="small"
                >
                  <ToggleButton value="asc" aria-label="ascending">
                    <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Ascending
                  </ToggleButton>
                  <ToggleButton value="desc" aria-label="descending">
                    <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Descending
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  ml: 'auto', 
                  display: { xs: 'none', sm: 'block' } 
                }}>
                  {collectionItems.length} items in collection
                </Typography>
              </Stack>
            </Box>
            
            {/* 列表 */}
            <List sx={{ width: '100%' }}>
              {sortedAndPaginatedItems.map((item, index) => (
                <Box key={item.collection_id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton edge="end" onClick={() => handleEdit(item)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton edge="end" onClick={() => handleDelete(item)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton edge="end" onClick={() => handleViewDetails(item.release.id)}>
                            <OpenInNewIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded"
                        alt={item.release.title}
                        src={item.release.cover_url}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      >
                        <AlbumIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {item.release.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body1" component="span">
                            {item.release.artist}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label={`Qty: ${item.quantity}`} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`$${formatPrice(item.purchase_price)}`} 
                              size="small" 
                              color="success"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={format(parseISO(item.purchase_date), 'PP')} 
                              size="small" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                          </Box>
                          
                          {/* 显示价格比较数据 */}
                          {showPriceComparison && (
                            <Box sx={{ mt: 1, pr: { xs: 11, sm: 14 } }}> {/* 添加右侧边距，为按钮腾出空间 */}
                              {renderPriceComparisonIndicator(item.release.id, parsePrice(item.purchase_price))}
                            </Box>
                          )}
                          
                          {item.description && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mt: 1, fontSize: '0.9rem' }}
                            >
                              {item.description}
                            </Typography>
                          )}
                          
                          {item.release.genres && item.release.genres.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {item.release.genres.map((genre, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={genre} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < sortedAndPaginatedItems.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
            
            {/* 分页控件 */}
            <TablePagination
              component="div"
              count={collectionItems.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Paper>
        )}
      </Box>

      {/* 编辑对话框 */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Collection Item
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <CollectionForm
              initialData={{
                quantity: selectedItem.quantity || 1,
                purchase_price: parsePrice(selectedItem.purchase_price),
                purchase_date: selectedItem.purchase_date 
                  ? parseISO(selectedItem.purchase_date) 
                  : new Date(),
                description: selectedItem.description || '',
              }}
              releaseTitle={selectedItem.release.title}
              releaseArtist={selectedItem.release.artist}
              releaseYear={selectedItem.release.year}
              onSubmit={handleUpdateSubmit}
              onCancel={() => setEditDialogOpen(false)}
              isSubmitting={updateMutation.isPending}
              submitLabel="Update"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{' '}
            <strong>{selectedItem?.release.title}</strong> by{' '}
            <strong>{selectedItem?.release.artist}</strong>{' '}
            from your collection?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollectionPage;