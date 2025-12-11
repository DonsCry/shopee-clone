import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#fbfbfb',
        borderTop: '1px solid #e1e1e1',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Customer Care */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ee4d2d' }}>
              Layanan Pelanggan
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="inherit" underline="hover">
                Pusat Bantuan
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Cara Pembelian
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Pengiriman
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Cara Pengembalian
              </Link>
              <Link href="#" color="inherit" underline="hover">
                FAQ
              </Link>
            </Stack>
          </Grid>

          {/* About Shopee */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ee4d2d' }}>
              Tentang Shopee
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="inherit" underline="hover">
                Tentang Kami
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Karir
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Kebijakan Shopee
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Kebijakan Privasi
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Blog
              </Link>
            </Stack>
          </Grid>

          {/* Payment & Shipping */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ee4d2d' }}>
              Metode Pembayaran
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="inherit" underline="hover">
                ShopeePay
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Transfer Bank
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Kartu Kredit/Debit
              </Link>
              <Link href="#" color="inherit" underline="hover">
                COD (Bayar di Tempat)
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Indomaret
              </Link>
            </Stack>
          </Grid>

          {/* Follow Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ee4d2d' }}>
              Ikuti Kami
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Download Aplikasi Shopee
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Link href="#" target="_blank">
                    <img
                      src="/api/placeholder/120/40"
                      alt="Google Play"
                      style={{ height: 40 }}
                    />
                  </Link>
                  <Link href="#" target="_blank">
                    <img
                      src="/api/placeholder/120/40"
                      alt="App Store"
                      style={{ height: 40 }}
                    />
                  </Link>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Social Media
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ color: '#ee4d2d' }}>
                    <Facebook />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#ee4d2d' }}>
                    <Instagram />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#ee4d2d' }}>
                    <Twitter />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#ee4d2d' }}>
                    <YouTube />
                  </IconButton>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              © 2024 Shopee Clone. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Country/Region: Indonesia | Singapore | Philippines | Malaysia | Thailand
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" />
              <Typography variant="body2">Jakarta, Indonesia</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone fontSize="small" />
              <Typography variant="body2">1500-702</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Email fontSize="small" />
              <Typography variant="body2">support@shopee.co.id</Typography>
            </Box>
          </Box>
        </Box>

        {/* Payment Methods Icons */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Metode Pembayaran yang Tersedia
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'Permata', 'Visa', 'Mastercard'].map(
              (method) => (
                <Box
                  key={method}
                  sx={{
                    width: 60,
                    height: 40,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {method}
                </Box>
              )
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
