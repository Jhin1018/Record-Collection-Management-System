import { Box, Container, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from '../navigation/AppHeader';

const MainLayout = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%' // 确保最外层Box占据全宽
      }}
    >
      <AppHeader />
      <Container 
        component="main" 
        maxWidth="lg" // 可以考虑使用 "xl" 或 false 来获得更大宽度
        sx={{ 
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 3 }, // 响应式内边距
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'stretch' // 修改这里，不要居中对齐而是拉伸
        }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            flexGrow: 1,
            borderRadius: 2,
            bgcolor: 'background.paper',
            width: '100%', // 确保Paper占据整个容器宽度
            mx: 'auto', // 水平居中
            maxWidth: '100%' // 确保不超过父容器
          }}
          className="vinyl-texture"
        >
          <Outlet />
        </Paper>
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          textAlign: 'center',
          bgcolor: 'background.paper',
          width: '100%'
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ opacity: 0.7 }}>
            SpinArchive © {new Date().getFullYear()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;