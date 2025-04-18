import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// 创建一个黑白为主的主题配色，带有黑胶唱片风格
const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f5f5f5', // 接近白色的主色调
      dark: '#c2c2c2',
      light: '#ffffff',
      contrastText: '#121212',
    },
    secondary: {
      main: '#303030', // 深灰色作为次要色
      dark: '#1a1a1a',
      light: '#484848',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212', // 几乎纯黑的背景
      paper: '#1e1e1e',   // 稍浅一点的黑色，用于卡片等组件
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    // 添加特殊颜色用于唱片分类标签
    error: {
      main: '#cf6679', // 红色
    },
    warning: {
      main: '#ffb74d', // 橙色
    },
    info: {
      main: '#81d4fa', // 蓝色
    },
    success: {
      main: '#81c784', // 绿色
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '-0.00833em',
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    // 特殊样式 - 仿黑胶纹理效果
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          '&.vinyl-texture': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              opacity: 0.03,
              pointerEvents: 'none',
              backgroundImage: 'repeating-radial-gradient(circle at center, #888, #888 1px, transparent 1px, transparent 100%)',
              backgroundSize: '8px 8px',
            },
          },
        },
      },
    },
  },
});

// 使字体响应式
const theme = responsiveFontSizes(baseTheme);

export default theme;