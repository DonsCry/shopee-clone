import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Paper,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Google,
  Twitter,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    // Social register logic here
    console.log(`Register with ${provider}`);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Daftar Akun Shopee
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nama Depan"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nama Belakang"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nomor Telepon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kata Sandi"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Konfirmasi Kata Sandi"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Saya menyetujui{' '}
                <Link href="#" color="primary">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link href="#" color="primary">
                  Kebijakan Privasi
                </Link>{' '}
                Shopee
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ bgcolor: '#ee4d2d', py: 1.5, mb: 2 }}
          >
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Atau daftar dengan
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialRegister('google')}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Facebook />}
            onClick={() => handleSocialRegister('facebook')}
          >
            Facebook
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Twitter />}
            onClick={() => handleSocialRegister('twitter')}
          >
            Twitter
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Sudah punya akun?{' '}
            <Link component={RouterLink} to="/login" color="primary">
              Masuk
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Benefits Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Keuntungan Menjadi Member Shopee
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                ✓
              </Box>
              <Typography variant="body2">
                <strong>Koin Shopee</strong><br />
                Kumpulkan koin dari setiap pembelian dan tukar dengan diskon
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                ✓
              </Box>
              <Typography variant="body2">
                <strong>Gratis Ongkir</strong><br />
                Nikmati gratis ongkir setiap hari dengan minimum pembelian
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                ✓
              </Box>
              <Typography variant="body2">
                <strong>Flash Sale Eksklusif</strong><br />
                Akses flash sale dengan diskon hingga 90% setiap hari
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                ✓
              </Box>
              <Typography variant="body2">
                <strong>Voucher Harian</strong><br />
                Dapatkan voucher dan promo eksklusif setiap hari
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
