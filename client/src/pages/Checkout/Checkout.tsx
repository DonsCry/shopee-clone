import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Paper,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  Add,
  Remove,
  Delete,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Checkout: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Indonesia',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();

  const steps = ['Alamat Pengiriman', 'Metode Pembayaran', 'Konfirmasi Pesanan'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = () => {
    // Place order logic here
    console.log('Placing order:', {
      items: cart?.items,
      shippingAddress,
      paymentMethod,
      notes,
    });
    navigate('/orders');
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Keranjang Belanja Kosong
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
  const shippingFee = paymentMethod === 'cash_on_delivery' ? 15000 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Alamat Pengiriman
                </Typography>

                {/* Saved Address */}
                {user?.profile?.address && (
                  <Card sx={{ mb: 3, border: '2px solid #ee4d2d' }}>
                    <CardContent>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Alamat Utama
                      </Typography>
                      <Typography variant="body2">
                        {user.profile.firstName} {user.profile.lastName}
                        <br />
                        {user.profile.address.street}
                        <br />
                        {user.profile.address.city}, {user.profile.address.state} {user.profile.address.zipCode}
                        <br />
                        {user.profile.address.country}
                        <br />
                        {user.profile.phone}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Atau tambah alamat baru:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nama Lengkap"
                      defaultValue={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nomor Telepon"
                      defaultValue={user?.profile?.phone || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Alamat Lengkap"
                      multiline
                      rows={2}
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Kota/Kabupaten"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Provinsi"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Kode Pos"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Negara"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Ringkasan Pesanan
                </Typography>
                {cart.items.map((item, index) => (
                  <Box key={`${item.product._id}-${index}`} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.quantity} x {formatPrice(item.price)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Total: {formatPrice(total)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Metode Pembayaran
                </Typography>

                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Paper sx={{ p: 2, mb: 2, border: paymentMethod === 'cash_on_delivery' ? '2px solid #ee4d2d' : '1px solid #e0e0e0' }}>
                    <FormControlLabel
                      value="cash_on_delivery"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Cash on Delivery (COD)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bayar saat barang sampai
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper sx={{ p: 2, mb: 2, border: paymentMethod === 'bank_transfer' ? '2px solid #ee4d2d' : '1px solid #e0e0e0' }}>
                    <FormControlLabel
                      value="bank_transfer"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Transfer Bank
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            BCA, Mandiri, BNI, BRI
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper sx={{ p: 2, mb: 2, border: paymentMethod === 'credit_card' ? '2px solid #ee4d2d' : '1px solid #e0e0e0' }}>
                    <FormControlLabel
                      value="credit_card"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Kartu Kredit/Debit
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Visa, Mastercard
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper sx={{ p: 2, mb: 2, border: paymentMethod === 'paypal' ? '2px solid #ee4d2d' : '1px solid #e0e0e0' }}>
                    <FormControlLabel
                      value="paypal"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            PayPal
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pembayaran online aman
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>

                {/* Payment Details */}
                {paymentMethod === 'credit_card' && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Detail Kartu Kredit
                    </Typography>
                    <TextField
                      fullWidth
                      label="Nomor Kartu"
                      placeholder="1234 5678 9012 3456"
                      sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="MM/YY"
                          placeholder="12/25"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          placeholder="123"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Notes */}
                <TextField
                  fullWidth
                  label="Catatan untuk Penjual (Opsional)"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mt: 3 }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Detail Pembayaran
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total Pembayaran
                  </Typography>
                  <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(total)}
                  </Typography>
                </Box>

                {paymentMethod === 'cash_on_delivery' && (
                  <Chip
                    label="Bayar saat barang sampai"
                    color="success"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Konfirmasi Pesanan
                </Typography>

                {/* Order Items */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Detail Produk
                  </Typography>
                  {cart.items.map((item, index) => (
                    <Card key={`${item.product._id}-${index}`} sx={{ mb: 2 }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={2}>
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }}
                            />
                          </Grid>
                          <Grid item xs={7}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
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
                          <Grid item xs={3} textAlign="right">
                            <Typography variant="body2">
                              {item.quantity} x {formatPrice(item.price)}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#ee4d2d' }}>
                              {formatPrice(item.price * item.quantity)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Shipping Address */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Alamat Pengiriman
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="body2">
                        {user?.profile?.firstName} {user?.profile?.lastName}
                        <br />
                        {shippingAddress.street || user?.profile?.address?.street}
                        <br />
                        {shippingAddress.city || user?.profile?.address?.city}, {shippingAddress.state || user?.profile?.address?.state} {shippingAddress.zipCode || user?.profile?.address?.zipCode}
                        <br />
                        {shippingAddress.country || user?.profile?.address?.country}
                        <br />
                        {user?.profile?.phone}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* Payment Method */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Metode Pembayaran
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="body2">
                        {paymentMethod === 'cash_on_delivery' && 'Cash on Delivery (COD)'}
                        {paymentMethod === 'bank_transfer' && 'Transfer Bank'}
                        {paymentMethod === 'credit_card' && 'Kartu Kredit/Debit'}
                        {paymentMethod === 'paypal' && 'PayPal'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* Notes */}
                {notes && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Catatan
                    </Typography>
                    <Card>
                      <CardContent>
                        <Typography variant="body2">{notes}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Ringkasan Pembayaran
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(total)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePlaceOrder}
                  sx={{ bgcolor: '#ee4d2d', py: 1.5 }}
                >
                  Buat Pesanan
                </Button>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Dengan membuat pesanan, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi Shopee
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Kembali
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ bgcolor: '#ee4d2d' }}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 1 ? 'Selesai' : 'Lanjutkan'}
        </Button>
      </Box>
    </Container>
  );
};

export default Checkout;
