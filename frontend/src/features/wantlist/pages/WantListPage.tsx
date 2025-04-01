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
  useTheme,
  Badge
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Album as AlbumIcon,
  OpenInNew as OpenInNewIcon,
  MoveToInbox as MoveToCollectionIcon,
  CalendarToday as CalendarIcon,
  Notes as NotesIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { wantlistApi, WantlistItem, DeleteWantlistParams, MoveToCollectionParams } from '../../../services/wantlistApi';
import CollectionForm, { CollectionFormData } from '../../collection/components/CollectionForm';

const WantlistPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // 当前选择的心愿单项
  const [selectedItem, setSelectedItem] = useState<WantlistItem | null>(null);
  
  // 对话框控制
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 获取心愿单列表
  const { data, isLoading, error } = useQuery({
    queryKey: ['wantlist', user?.id],
    queryFn: () => wantlistApi.getUserWantlist(user?.id || 0),
    enabled: !!user?.id,
  });

  // 移动到收藏的mutation
  const moveToCollectionMutation = useMutation({
    mutationFn: (params: MoveToCollectionParams) => wantlistApi.moveToCollection(params),
    onSuccess: () => {
      // 更新缓存中的数据
      queryClient.invalidateQueries({ queryKey: ['wantlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['collection', user?.id] });
      setMoveDialogOpen(false);
    }
  });

  // 删除心愿单的mutation
  const deleteWantlistMutation = useMutation({
    mutationFn: (params: DeleteWantlistParams) => wantlistApi.removeFromWantlist(params),
    onSuccess: () => {
      // 更新缓存中的数据
      queryClient.invalidateQueries({ queryKey: ['wantlist', user?.id] });
      setDeleteDialogOpen(false);
    }
  });

  // 处理移到收藏
  const handleMoveToCollection = (item: WantlistItem) => {
    setSelectedItem(item);
    setMoveDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (item: WantlistItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (!selectedItem || !user?.id) return;
    
    deleteWantlistMutation.mutate({
      user_id: user.id,
      wantlist_id: selectedItem.wantlist_id
    });
  };

  // 处理移动到收藏表单提交
  const handleMoveToCollectionSubmit = (formData: CollectionFormData) => {
    if (!selectedItem || !user?.id) return;
    
    const moveData: MoveToCollectionParams = {
      user_id: user.id,
      wantlist_id: selectedItem.wantlist_id,
      quantity: formData.quantity,
      purchase_price: typeof formData.purchase_price === 'string' 
        ? parseFloat(formData.purchase_price) 
        : formData.purchase_price,
      purchase_date: format(formData.purchase_date, 'yyyy-MM-dd HH:mm:ss'),
      description: formData.description || undefined
    };
    
    moveToCollectionMutation.mutate(moveData);
  };

  // 跳转到详情页
  const handleViewDetails = (releaseId: number) => {
    navigate(`/search/release/${releaseId}`);
  };

  // 跳转到搜索页
  const handleGoToSearch = () => {
    navigate('/search');
  };

  console.log("Wantlist data from API:", data);
  console.log("User ID:", user?.id);
  
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
          Error loading wantlist: {String(error)}
        </Alert>
      </Container>
    );
  }

  // 准备心愿单数据 - 兼容不同的数据格式
  const wantlistItems: WantlistItem[] = Array.isArray(data?.data) 
    ? data.data 
    : (Array.isArray(data) ? data : []);

  const isEmpty = wantlistItems.length === 0;
  
  // 按添加日期降序排序
  const sortedItems = [...wantlistItems].sort((a, b) => {
    try {
      const dateA = parseISO(a.added_date);
      const dateB = parseISO(b.added_date);
      return dateB.getTime() - dateA.getTime(); // 降序排序
    } catch (e) {
      return 0;
    }
  });

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
            Your Wantlist
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<SearchIcon />}
            onClick={handleGoToSearch}
            color="secondary"
          >
            Search Records
          </Button>
        </Box>

        {isEmpty ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your wantlist is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start building your wantlist by adding records you desire.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<SearchIcon />}
              onClick={handleGoToSearch}
              color="secondary"
              sx={{ mt: 2 }}
            >
              Search Records
            </Button>
          </Paper>
        ) : (
          <Paper elevation={2}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">
                Records you want to add to your collection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {wantlistItems.length} items in wantlist
              </Typography>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {sortedItems.map((item, index) => (
                <Box key={item.wantlist_id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Box>
                        <Tooltip title="Move to Collection">
                          <IconButton edge="end" onClick={() => handleMoveToCollection(item)} color="primary">
                            <MoveToCollectionIcon />
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
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                              icon={<CalendarIcon fontSize="small" />}
                              label={`Added ${format(parseISO(item.added_date), 'PP')}`} 
                              size="small" 
                              variant="outlined"
                            />
                            
                            {item.release.year && (
                              <Chip 
                                label={`Released ${item.release.year}`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                            
                            {item.release.format && (
                              <Chip 
                                label={item.release.format} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                          
                          {item.note && (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'flex-start' }}>
                              <NotesIcon fontSize="small" sx={{ mr: 1, mt: 0.3, color: 'text.secondary' }} />
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.9rem' }}
                              >
                                {item.note}
                              </Typography>
                            </Box>
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
                  {index < sortedItems.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* 移动到收藏对话框 */}
      <Dialog 
        open={moveDialogOpen} 
        onClose={() => setMoveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Move to Collection
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <CollectionForm
              initialData={{
                quantity: 1,
                purchase_price: '',
                purchase_date: new Date(),
                description: selectedItem.note || '',
              }}
              releaseTitle={selectedItem.release.title}
              releaseArtist={selectedItem.release.artist}
              releaseYear={selectedItem.release.year}
              onSubmit={handleMoveToCollectionSubmit}
              onCancel={() => setMoveDialogOpen(false)}
              isSubmitting={moveToCollectionMutation.isPending}
              submitLabel="Add to Collection"
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
            from your wantlist?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            disabled={deleteWantlistMutation.isPending}
          >
            {deleteWantlistMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WantlistPage;