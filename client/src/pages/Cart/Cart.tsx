import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  IconButton,
  TextField,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  Grid,
  Chip,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  LocalShipping,
  Security,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Cart: React.FC = () => {
  const { cart, isLoading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (productId: string, quantity: number, variant?: { name: string; option: string }) => {
    updateCartItem(productId, quantity, variant);
  };

  const handleRemoveItem = (productId: string, variant?: { name: string; option: string }) => {
    removeFromCart(productId, variant);
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Silakan Login Terlebih Dahulu
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Anda perlu login untuk melihat keranjang belanja Anda
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ bgcolor: '#ee4d2d', mr: 2 }}
        >
          Login
        </Button>
        <Button component={Link} to="/register" variant="outlined">
          Daftar
        </Button>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6">Memuat keranjang...</Typography>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Keranjang Belanja Kosong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Belum ada produk di keranjang Anda
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          sx={{ bgcolor: '#ee4d2d' }}
        >
          Belanja Sekarang
        </Button>
      </Container>
    );
  }

  const subtotal = cart.totalAmount;
  const shippingFee = 15000;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Keranjang Belanja ({cart.totalItems} item)
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {/* Select All */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Pilih Semua" />
            <Button
              color="error"
              onClick={() => clearCart()}
              sx={{ ml: 'auto' }}
            >
              Hapus Semua
            </Button>
          </Box>

          {/* Cart Items List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cart.items.map((item, index) => (
              <Card key={`${item.product._id}-${index}`} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Checkbox */}
                  <Grid item>
                    <Checkbox defaultChecked />
                  </Grid>

                  {/* Product Image */}
                  <Grid item>
                    <CardMedia
                      component="img"
                      image={item.product.thumbnail}
                      alt={item.product.name}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </Grid>

                  {/* Product Info */}
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                      }}
                    >
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.seller.username}
                    </Typography>
                    {item.variant && (
                      <Chip
                        label={`${item.variant.name}: ${item.variant.option}`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>

                  {/* Price */}
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(item.price)}
                    </Typography>
                    {item.product.originalPrice && item.product.originalPrice > item.price && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(item.product.originalPrice)}
                      </Typography>
                    )}
                  </Grid>

                  {/* Quantity */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.variant)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.product._id, newQuantity, item.variant);
                        }}
                        inputProps={{ min: 1, max: item.product.stock }}
                        sx={{ width: 60 }}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.variant)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Stok: {item.product.stock}
                    </Typography>
                  </Grid>

                  {/* Actions */}
                  <Grid item>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.product._id, item.variant)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Ringkasan Belanja
            </Typography>

            {/* Shipping Address */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Alamat Pengiriman
              </Typography>
              <Typography variant="body2">
                John Doe
                <br />
                Jl. Sudirman No. 123
                <br />
                Jakarta Pusat, DKI Jakarta 10110
                <br />
                08123456789
              </Typography>
              <Button variant="text" size="small" sx={{ mt: 1 }}>
                Ubah Alamat
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Price Breakdown */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal ({cart.totalItems} item)
                </Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Biaya Pengiriman
                </Typography>
                <Typography variant="body2">{formatPrice(shippingFee)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Pajak (10%)
                </Typography>
                <Typography variant="body2">{formatPrice(tax)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                {formatPrice(total)}
              </Typography>
            </Box>

            {/* Promo Code */}
            <TextField
              fullWidth
              placeholder="Masukkan kode promo"
              size="small"
              sx={{ mb: 2 }}
            />

            {/* Benefits */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<LocalShipping />}
                label="Gratis Ongkir"
                size="small"
                color="success"
              />
              <Chip
                icon={<Security />}
                label="Garansi Uang Kembali"
                size="small"
                color="primary"
              />
            </Box>

            {/* Checkout Button */}
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              fullWidth
              size="large"
              sx={{ bgcolor: '#ee4d2d', py: 1.5 }}
            >
              Checkout ({formatPrice(total)})
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Dengan checkout, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi Shopee
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
