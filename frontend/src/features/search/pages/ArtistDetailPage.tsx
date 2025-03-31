import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { discogsApi } from '../../../services/discogsApi';

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id || '0', 10);

  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => discogsApi.getArtist(artistId),
    enabled: !!artistId,
  });

  if (isLoading) {
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">
          {artist.name}
        </Typography>
        <Typography variant="body1">Artist ID: {artistId}</Typography>
        <Typography variant="body2">
          This page will be implemented in the next step.
        </Typography>
      </Box>
    </Container>
  );
};

export default ArtistDetailPage;