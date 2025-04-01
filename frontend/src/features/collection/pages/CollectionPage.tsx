import { useState } from 'react';
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
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Album as AlbumIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { collectionApi, CollectionItem, UpdateCollectionParams, DeleteCollectionParams } from '../../../services/collectionApi';
import CollectionForm, { CollectionFormData } from '../components/CollectionForm';

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
  
  // 获取收藏列表
  const { data, isLoading, error } = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => collectionApi.getUserCollection(user?.id || 0),
    enabled: !!user?.id,
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
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Add New Record
          </Button>
        </Box>

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
            <List sx={{ width: '100%' }}>
              {collectionItems.map((item, index) => (
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
                  {index < collectionItems.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
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