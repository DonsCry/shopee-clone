import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  Home,
  Category,
  Store,
  Receipt,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const totalItems = cart?.totalItems || 0;

  const menuItems = [
    { text: 'Beranda', icon: <Home />, path: '/' },
    { text: 'Produk', icon: <Category />, path: '/products' },
    { text: 'Toko', icon: <Store />, path: '/seller' },
  ];

  const drawer = (
    <Box onClick={() => setMobileMenuOpen(false)} sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="primary">
          Shopee Clone
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItem component={Link} to="/profile">
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="Profil" />
          </ListItem>
          <ListItem component={Link} to="/orders">
            <ListItemIcon><Receipt /></ListItemIcon>
            <ListItemText primary="Pesanan" />
          </ListItem>
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Keluar" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem component={Link} to="/login">
            <ListItemText primary="Masuk" />
          </ListItem>
          <ListItem component={Link} to="/register">
            <ListItemText primary="Daftar" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#ee4d2d' }}>
        <Container maxWidth="xl">
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 0,
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                mr: 3,
              }}
            >
              Shopee Clone
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{ color: 'white' }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                flexGrow: 1,
                maxWidth: 600,
                mx: 2,
                display: { xs: 'none', md: 'block' },
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  style: { backgroundColor: 'white', borderRadius: 4 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                component={Link}
                to="/cart"
                sx={{ color: 'white' }}
              >
                <Badge badgeContent={totalItems} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ color: 'white' }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'white' }}>
                      <AccountCircle sx={{ color: '#ee4d2d' }} />
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Profil
                </MenuItem>
                <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
                  Pesanan Saya
                </MenuItem>
                {user?.role === 'seller' && (
                  <MenuItem component={Link} to="/seller/dashboard" onClick={handleMenuClose}>
                    Dashboard Penjual
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Keluar</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Masuk
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{ bgcolor: 'white', color: '#ee4d2d' }}
              >
                Daftar
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </Container>
  </AppBar>

  <Drawer
    anchor="left"
    open={mobileMenuOpen}
    onClose={() => setMobileMenuOpen(false)}
  >
    {drawer}
  </Drawer>

  {/* Mobile Search Bar */}
  {isMobile && (
    <Box sx={{ p: 2, bgcolor: '#ee4d2d', position: 'fixed', top: 56, left: 0, right: 0, zIndex: 1100 }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          size="small"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            style: { backgroundColor: 'white', borderRadius: 4 },
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  )}
</>
);
};

export default Header;
