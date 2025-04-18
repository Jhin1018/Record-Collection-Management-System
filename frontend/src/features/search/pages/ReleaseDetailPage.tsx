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
  Alert,
  Snackbar,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Favorite as FavoriteIcon,
  OpenInNew as OpenInNewIcon,
  Album as AlbumIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discogsApi, ReleaseDetails } from '../../../services/discogsApi';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import ImageCarousel from '../components/ImageCarousel';
import { format } from 'date-fns';
import { collectionApi, AddToCollectionParams } from '../../../services/collectionApi';
import CollectionForm, { CollectionFormData } from '../../collection/components/CollectionForm';
import { wantlistApi, AddToWantlistParams } from '../../../services/wantlistApi';

const ReleaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const releaseId = parseInt(id || '0', 10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'info' | 'success' | 'error' });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useAuth();
  
  const [collectionDialog, setCollectionDialog] = useState(false);
  const [wantlistDialog, setWantlistDialog] = useState(false);
  const [wantlistNote, setWantlistNote] = useState('');

  const queryClient = useQueryClient();

  const { data: release, isLoading, error } = useQuery({
    queryKey: ['release', releaseId],
    queryFn: () => discogsApi.getRelease(releaseId),
    enabled: !!releaseId,
  });

  const addToCollectionMutation = useMutation({
    mutationFn: (params: AddToCollectionParams) => collectionApi.addToCollection(params),
    onSuccess: (data) => {
      setCollectionDialog(false);
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['collection', user.id] });
      }
      
      setSnackbar({
        open: true,
        message: 'Added to collection successfully',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error.error || 'Failed to add to collection',
        severity: 'error'
      });
    }
  });

  const addToWantlistMutation = useMutation({
    mutationFn: (params: AddToWantlistParams) => wantlistApi.addToWantlist(params),
    onSuccess: (data) => {
      setWantlistDialog(false);
      setWantlistNote('');
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['wantlist', user.id] });
      }
      
      setSnackbar({
        open: true,
        message: 'Added to wantlist successfully',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error.error || 'Failed to add to wantlist',
        severity: 'error'
      });
    }
  });

  const handleAddToCollection = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to your collection',
        severity: 'info'
      });
      return;
    }
    
    setCollectionDialog(true);
  };

  const handleAddToWantlist = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to your wantlist',
        severity: 'info'
      });
      return;
    }
    
    setWantlistDialog(true);
  };

  const handleCloseCollectionDialog = () => {
    setCollectionDialog(false);
  };

  const handleCloseWantlistDialog = () => {
    setWantlistDialog(false);
    setWantlistNote('');
  };

  const handleSubmitWantlist = () => {
    if (!user?.id) {
      setSnackbar({
        open: true,
        message: 'User information not available',
        severity: 'error'
      });
      return;
    }

    const wantlistData: AddToWantlistParams = {
      release_id: releaseId,
      user_id: user.id,
      note: wantlistNote || undefined
    };

    addToWantlistMutation.mutate(wantlistData);
  };

  const handleGoToMaster = () => {
    if (release?.master_id) {
      navigate(`/search/master/${release.master_id}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !release) {
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
            Error loading release details
          </Typography>
          <Typography>
            {error ? String(error) : 'Unable to load release information'}
          </Typography>
        </Box>
      </Container>
    );
  }

  const artistNames = release.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist';
  
  const mainImageUrl = release.images && release.images.length > 0
    ? release.images[0].uri
    : release.thumb || '/assets/record-placeholder.png';

  const formatInfo = release.formats?.map(format => {
    const desc = format.descriptions?.join(', ') || '';
    return `${format.name} ${format.qty && format.qty !== '1' ? `(${format.qty}x)` : ''} ${desc ? `- ${desc}` : ''}`;
  }).join(', ') || 'Unknown Format';

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back to Search
        </Button>

        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {release.title}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              {artistNames}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Table size="small">
              <TableBody>
                {(release.released || release.year) && (
                  <TableRow>
                    <TableCell 
                      component="th" 
                      sx={{ width: '30%', fontWeight: 'bold', py: 1 }}
                    >
                      Released Date
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {release.released ? 
                        (() => {
                          try {
                            const date = new Date(release.released);
                            if (!isNaN(date.getTime())) {
                              return date.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              });
                            }
                            return release.released;
                          } catch (e) {
                            return release.released;
                          }
                        })() 
                        : release.year
                      }
                    </TableCell>
                  </TableRow>
                )}
                
                {release.country && (
                  <TableRow>
                    <TableCell 
                      component="th" 
                      sx={{ fontWeight: 'bold', py: 1 }}
                    >
                      Country
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>{release.country}</TableCell>
                  </TableRow>
                )}
                
                <TableRow>
                  <TableCell 
                    component="th" 
                    sx={{ fontWeight: 'bold', py: 1 }}
                  >
                    Format
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>{formatInfo}</TableCell>
                </TableRow>
                
                {release.labels && release.labels.length > 0 && (
                  <TableRow>
                    <TableCell 
                      component="th" 
                      sx={{ fontWeight: 'bold', py: 1 }}
                    >
                      Label
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {release.labels.map((label, index) => (
                        <span key={index}>
                          {label.name}{label.catno ? ` - ${label.catno}` : ''}
                          {index < release.labels.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </TableCell>
                  </TableRow>
                )}
                
                <TableRow>
                  <TableCell 
                    component="th" 
                    sx={{ fontWeight: 'bold', py: 1 }}
                  >
                    Discogs ID
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {release.id}
                    <Tooltip title="View on Discogs">
                      <IconButton 
                        size="small" 
                        href={`https://www.discogs.com/release/${release.id}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ ml: 1 }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box sx={{ mb: 3 }}>
            {release.images && release.images.length > 0 ? (
              <ImageCarousel images={release.images} />
            ) : (
              <Card>
                <CardMedia
                  component="img"
                  image={mainImageUrl}
                  alt={release.title}
                  sx={{ 
                    height: 400,
                    objectFit: 'contain',
                    bgcolor: 'black',
                  }}
                />
              </Card>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            mb: 3
          }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddToCollection}
              color="primary"
              sx={{ minWidth: 180 }}
            >
              Add to Collection
            </Button>
            <Button
              variant="contained"
              startIcon={<FavoriteIcon />}
              onClick={handleAddToWantlist}
              color="secondary"
              sx={{ minWidth: 180 }}
            >
              Add to Wantlist
            </Button>
          </Box>

          {release.master_id && (
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mb: 3 
            }}>
              <Button
                variant="outlined"
                startIcon={<AlbumIcon />}
                onClick={handleGoToMaster}
                sx={{ minWidth: 180 }}
              >
                View Master Release
              </Button>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Genres & Styles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {release.genres?.map(genre => (
                <Chip 
                  key={genre} 
                  label={genre} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
              {release.styles?.map(style => (
                <Chip 
                  key={style} 
                  label={style} 
                  color="primary"
                  variant="outlined" 
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Tracklist
            </Typography>
            <List disablePadding>
              {release.tracklist.map((track, index) => (
                <ListItem 
                  key={index}
                  disablePadding
                  sx={{ 
                    py: 0.5, 
                    borderBottom: index < release.tracklist.length - 1 ? 
                      `1px solid ${theme.palette.divider}` : 'none',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
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

          {release.notes && (
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
                {release.notes}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Dialog 
        open={collectionDialog} 
        onClose={handleCloseCollectionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add to Collection
          <IconButton
            aria-label="close"
            onClick={handleCloseCollectionDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <CollectionForm
            initialData={{
              quantity: 1,
              purchase_price: '',
              purchase_date: new Date(),
              description: '',
            }}
            releaseTitle={release.title}
            releaseArtist={artistNames}
            releaseYear={release.year}
            onSubmit={(formData: CollectionFormData) => {
              if (!user?.id) {
                setSnackbar({
                  open: true,
                  message: 'User information not available',
                  severity: 'error'
                });
                return;
              }

              const collectionData: AddToCollectionParams = {
                release_id: releaseId,
                user_id: user.id,
                quantity: formData.quantity,
                purchase_price: typeof formData.purchase_price === 'string' 
                  ? parseFloat(formData.purchase_price) 
                  : formData.purchase_price,
                purchase_date: format(formData.purchase_date, 'yyyy-MM-dd HH:mm:ss'),
                description: formData.description || undefined,
              };

              addToCollectionMutation.mutate(collectionData);
            }}
            onCancel={handleCloseCollectionDialog}
            isSubmitting={addToCollectionMutation.isPending}
            submitLabel="Save to Collection"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={wantlistDialog}
        onClose={handleCloseWantlistDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add to Wantlist
          <IconButton
            aria-label="close"
            onClick={handleCloseWantlistDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {release.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {artistNames}
              {release.year ? ` (${release.year})` : ''}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Add a note about why you want this record (optional)
          </Typography>
          
          <TextField
            label="Note"
            multiline
            rows={4}
            fullWidth
            value={wantlistNote}
            onChange={(e) => setWantlistNote(e.target.value)}
            placeholder="E.g., Looking for original pressing, Needed to complete collection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWantlistDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FavoriteIcon />}
            onClick={handleSubmitWantlist}
            disabled={addToWantlistMutation.isPending}
          >
            {addToWantlistMutation.isPending ? 'Adding...' : 'Add to Wantlist'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReleaseDetailPage;