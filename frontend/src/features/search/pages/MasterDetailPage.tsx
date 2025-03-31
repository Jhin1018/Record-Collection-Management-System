import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { discogsApi } from '../../../services/discogsApi';

const MasterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const masterId = parseInt(id || '0', 10);

  const { data: master, isLoading, error } = useQuery({
    queryKey: ['master', masterId],
    queryFn: () => discogsApi.getMaster(masterId),
    enabled: !!masterId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !master) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">
          {master.title}
        </Typography>
        <Typography variant="body1">Master ID: {masterId}</Typography>
        <Typography variant="body2">
          This page will be implemented in the next step.
        </Typography>
      </Box>
    </Container>
  );
};

export default MasterDetailPage;