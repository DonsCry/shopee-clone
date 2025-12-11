import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Grid,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Person,
  Edit,
  LocationOn,
  Phone,
  Email,
  ShoppingBag,
  Favorite,
  Settings,
  Security,
  Help,
  Logout,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    phone: user?.profile?.phone || '',
    address: {
      street: user?.profile?.address?.street || '',
      city: user?.profile?.address?.city || '',
      state: user?.profile?.address?.state || '',
      zipCode: user?.profile?.address?.zipCode || '',
      country: user?.profile?.address?.country || '',
    },
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const menuItems = [
    { icon: <ShoppingBag />, text: 'Pesanan Saya', link: '/orders' },
    { icon: <Favorite />, text: 'Wishlist', link: '/wishlist' },
    { icon: <LocationOn />, text: 'Alamat Pengiriman', link: '/addresses' },
    { icon: <Settings />, text: 'Pengaturan', link: '/settings' },
    { icon: <Security />, text: 'Keamanan', link: '/security' },
    { icon: <Help />, text: 'Bantuan', link: '/help' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Profil Saya
      </Typography>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            {/* User Info */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Chip
                label={user?.role === 'seller' ? 'Penjual' : 'Pembeli'}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Menu Items */}
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.link}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <ListItem
              sx={{
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText primary="Keluar" sx={{ color: 'error.main' }} />
            </ListItem>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Informasi Pribadi" />
              <Tab label="Alamat" />
              <Tab label="Keamanan" />
            </Tabs>

            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Informasi Pribadi
                </Typography>
                <Button
                  variant={isEditing ? 'contained' : 'outlined'}
                  startIcon={isEditing ? null : <Edit />}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  sx={{ bgcolor: isEditing ? '#ee4d2d' : 'transparent' }}
                >
                  {isEditing ? 'Simpan' : 'Edit'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={user?.username || ''}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Nama Depan"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nama Belakang"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Nomor Telepon"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Tanggal Lahir"
                    type="date"
                    defaultValue="1990-01-01"
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    placeholder="Ceritakan tentang diri Anda..."
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Address Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Alamat Pengiriman
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nama Lengkap"
                    value={`${profileData.firstName} ${profileData.lastName}`}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Nomor Telepon"
                    value={profileData.phone}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Alamat Lengkap"
                    multiline
                    rows={2}
                    value={profileData.address.street}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address, street: e.target.value }
                    })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Kota/Kabupaten"
                    value={profileData.address.city}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address, city: e.target.value }
                    })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Provinsi"
                    value={profileData.address.state}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address, state: e.target.value }
                    })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Kode Pos"
                    value={profileData.address.zipCode}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address, zipCode: e.target.value }
                    })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Negara"
                    value={profileData.address.country}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address, country: e.target.value }
                    })}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    sx={{ bgcolor: '#ee4d2d' }}
                  >
                    Simpan Alamat
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Batal
                  </Button>
                </Box>
              )}
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Keamanan Akun
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Ubah Kata Sandi
                      </Typography>
                      <TextField
                        fullWidth
                        label="Kata Sandi Saat Ini"
                        type="password"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Kata Sandi Baru"
                        type="password"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Konfirmasi Kata Sandi Baru"
                        type="password"
                        sx={{ mb: 2 }}
                      />
                      <Button variant="contained" sx={{ bgcolor: '#ee4d2d' }}>
                        Ubah Kata Sandi
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Keamanan Tambahan
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Verifikasi Dua Faktor
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Tambahkan lapisan keamanan ekstra ke akun Anda
                          </Typography>
                          <Button variant="outlined" size="small">
                            Aktifkan
                          </Button>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Login Activity
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Terakhir login: Hari ini, 10:30 AM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Lokasi: Jakarta, Indonesia
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
