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

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
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

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Social login logic here
    console.log(`Login with ${provider}`);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Masuk ke Shopee
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Link component={RouterLink} to="/forgot-password" color="primary">
              Lupa kata sandi?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ bgcolor: '#ee4d2d', py: 1.5, mb: 2 }}
          >
            {isLoading ? 'Masuk...' : 'Masuk'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Atau masuk dengan
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialLogin('google')}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Facebook />}
            onClick={() => handleSocialLogin('facebook')}
          >
            Facebook
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Twitter />}
            onClick={() => handleSocialLogin('twitter')}
          >
            Twitter
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Belum punya akun?{' '}
            <Link component={RouterLink} to="/register" color="primary">
              Daftar sekarang
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Benefits Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Mengapa Bergabung dengan Shopee?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                1
              </Box>
              <Typography variant="body2">
                <strong>Pengalaman Belanja Terbaik</strong><br />
                Nikmati kemudahan berbelanja dengan ribuan produk pilihan
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                2
              </Box>
              <Typography variant="body2">
                <strong>Promo & Diskon Menarik</strong><br />
                Dapatkan penawaran eksklusif dan cashback setiap hari
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ee4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                3
              </Box>
              <Typography variant="body2">
                <strong>Pengiriman Cepat & Aman</strong><br />
                Barang sampai tepat waktu dengan garansi uang kembali
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
