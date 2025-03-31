import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SearchResult } from '../../../services/discogsApi';

interface ReleaseCardProps {
  item: SearchResult;
}

const ReleaseCard = ({ item }: ReleaseCardProps) => {
  const navigate = useNavigate();
  
  // 构建艺术家名称 + 标题
  const title = item.artist 
    ? `${item.artist} - ${item.title}` 
    : item.title;
  
  const handleCardClick = () => {
    // 点击卡片，查看详情
    navigate(`/search/release/${item.id}`);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: 320,
        width: '100%',
        maxWidth: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        overflow: 'hidden' // 确保内容不会溢出
      }}
    >
      <CardActionArea 
        onClick={handleCardClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch' 
        }}
      >
        <CardMedia
          component="img"
          image={item.cover_image || item.thumb || '/assets/record-placeholder.png'} // 使用本地占位符图片
          alt={title}
          onError={(e) => {
            // 图片加载失败时使用备用图片
            const target = e.target as HTMLImageElement;
            target.onerror = null; // 防止无限循环
            target.src = '/assets/record-placeholder.png';
          }}
          sx={{ 
            height: 180,
            objectFit: 'cover',
            bgcolor: 'black', 
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0 
          }}
        />
        <CardContent sx={{ 
          flexGrow: 1, 
          width: '100%', 
          padding: 2,
          "&:last-child": { paddingBottom: 2 }
        }}>
          <Typography 
            variant="subtitle1" 
            component="div" 
            title={title}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '4',
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              minHeight: '2.4em',
              maxHeight: '4.8em',
              width: 200,
              wordBreak: 'break-word',
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          
          {item.year && (
            <Typography variant="body2" color="text.secondary">
              {item.year}
            </Typography>
          )}
          
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {item.genre?.slice(0, 2).map((genre) => (
              <Chip 
                key={genre} 
                label={genre} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
            {item.format?.slice(0, 1).map((format) => (
              <Chip 
                key={format} 
                label={format} 
                size="small"
                color="primary" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ReleaseCard;