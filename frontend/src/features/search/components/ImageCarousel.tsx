import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  IconButton, 
  Paper, 
  Modal,
  Fade,
  useTheme 
} from '@mui/material';
import {
  ArrowForwardIos as ArrowForwardIcon,
  ArrowBackIos as ArrowBackIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';

interface Image {
  type: string;
  uri: string;
  resource_url: string;
  uri150: string;
  width: number;
  height: number;
}

interface ImageCarouselProps {
  images: Image[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();

  // 处理点击上一张
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击
    setActiveIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // 处理点击下一张
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击
    setActiveIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // 处理打开大图模态
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // 处理关闭大图模态
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // 当前选择的图片
  const currentImage = images[activeIndex];

  return (
    <Box sx={{ position: 'relative' }}>
      <Card onClick={handleOpenModal} sx={{ cursor: 'pointer' }}>
        <CardMedia
          component="img"
          image={currentImage.uri}
          alt={`Image ${activeIndex + 1}`}
          sx={{
            height: 400, // 增加高度从300到400
            objectFit: 'contain',
            bgcolor: 'black',
          }}
        />
        
        {/* 缩放图标提示 */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)',
            },
          }}
          size="small"
          onClick={handleOpenModal}
        >
          <ZoomInIcon fontSize="small" />
        </IconButton>
      </Card>

      {/* 翻页按钮 - 仅在多于一张图片时显示 */}
      {images.length > 1 && (
        <>
          <IconButton
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
            onClick={handlePrev}
            size="small"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
            onClick={handleNext}
            size="small"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </>
      )}

      {/* 缩略图导航 */}
      {images.length > 1 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 1,
            mt: 1,
            overflowX: 'auto',
            pb: 1
          }}
        >
          {images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img.uri150}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              sx={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                cursor: 'pointer',
                border: idx === activeIndex ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                opacity: idx === activeIndex ? 1 : 0.7,
                '&:hover': {
                  opacity: 1,
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* 大图模态 */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'black',
            borderRadius: 1,
            boxShadow: 24,
            p: 1,
          }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
              
              <Box
                component="img"
                src={currentImage.uri}
                alt={`Large image ${activeIndex + 1}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '85vh', // 稍微增加高度
                  objectFit: 'contain',
                  display: 'block',
                  margin: 'auto',
                }}
              />
            </Box>

            {/* 大图模态中的翻页按钮 */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <IconButton
                  onClick={handlePrev}
                  color="primary"
                >
                  <ArrowBackIcon />
                </IconButton>
                
                <IconButton
                  onClick={handleNext}
                  color="primary"
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ImageCarousel;