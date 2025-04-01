import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Album as AlbumIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  FavoriteBorder as WantlistIcon, // 新添加
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const AppHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Navigation link configuration
  const publicLinks = [
    { text: 'Search', icon: <SearchIcon />, path: '/' },
  ];

  const authLinks = [
    { text: 'Login', icon: <LoginIcon />, path: '/login' },
    { text: 'Register', icon: <PersonAddIcon />, path: '/register' },
  ];

  const protectedLinks = [
    { text: 'Collection', icon: <AlbumIcon />, path: '/collection' },
    { text: 'Wantlist', icon: <WantlistIcon />, path: '/wantlist' }, // 新添加
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Market', icon: <ShowChartIcon />, path: '/market' },
  ];

  const logo = (
    <Typography
      variant="h6"
      component={RouterLink}
      to="/"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      SpinArchive 🎵
    </Typography>
  );

  const navLinks = (
    <>
      {publicLinks.map((link) => (
        <Button
          key={link.path}
          component={RouterLink}
          to={link.path}
          color="inherit"
          sx={{
            mx: 1,
            fontWeight: location.pathname === link.path ? 700 : 400,
            borderBottom: location.pathname === link.path ? '2px solid' : 'none',
            borderRadius: 0,
          }}
        >
          {link.text}
        </Button>
      ))}

      {isAuthenticated ? (
        protectedLinks.map((link) => (
          <Button
            key={link.path}
            component={RouterLink}
            to={link.path}
            color="inherit"
            sx={{
              mx: 1,
              fontWeight: location.pathname === link.path ? 700 : 400,
              borderBottom: location.pathname === link.path ? '2px solid' : 'none',
              borderRadius: 0,
            }}
          >
            {link.text}
          </Button>
        ))
      ) : (
        authLinks.map((link) => (
          <Button
            key={link.path}
            component={RouterLink}
            to={link.path}
            color="inherit"
            sx={{
              mx: 1,
              fontWeight: location.pathname === link.path ? 700 : 400,
              borderBottom: location.pathname === link.path ? '2px solid' : 'none',
              borderRadius: 0,
            }}
          >
            {link.text}
          </Button>
        ))
      )}
    </>
  );

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 240 }} role="presentation">
      <Box sx={{ p: 2 }}>{logo}</Box>
      <Divider />
      <List>
        {publicLinks.map((link) => (
          <ListItem 
            button 
            key={link.path} 
            component={RouterLink} 
            to={link.path}
            selected={location.pathname === link.path}
            onClick={toggleDrawer}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            {protectedLinks.map((link) => (
              <ListItem 
                button 
                key={link.path} 
                component={RouterLink} 
                to={link.path}
                selected={location.pathname === link.path}
                onClick={toggleDrawer}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
            <ListItem 
              button 
              key="profile" 
              component={RouterLink} 
              to="/profile"
              selected={location.pathname === '/profile'}
              onClick={toggleDrawer}
            >
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => {
                toggleDrawer();
                logout();
              }}
            >
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          authLinks.map((link) => (
            <ListItem 
              button 
              key={link.path} 
              component={RouterLink} 
              to={link.path}
              selected={location.pathname === link.path}
              onClick={toggleDrawer}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              {logo}
            </Box>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            {/* Logo on the left */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {logo}
            </Box>
            
            {/* Navigation links in the center-right */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1
              }}
            >
              {navLinks}
              
              {isAuthenticated && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem 
                      component={RouterLink} 
                      to="/profile" 
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;