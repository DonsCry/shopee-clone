import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Breadcrumbs,
  Link,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Replay,
  Star,
  Message,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

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

const Orders: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: ordersData, isLoading, refetch } = useQuery(
    ['userOrders', { status: statusFilter === 'all' ? undefined : statusFilter }],
    () => orderService.getUserOrders({ status: statusFilter === 'all' ? undefined : statusFilter }),
    {
      keepPreviousData: true,
    }
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      refetch();
      setDetailDialogOpen(false);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleReviewProduct = (productId: string) => {
    navigate(`/product/${productId}#review`);
  };

  const handleContactSeller = (orderId: string) => {
    navigate(`/messages/${orderId}`);
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'returned':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'processing':
        return 'Diproses';
      case 'shipped':
        return 'Dikirim';
      case 'delivered':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'returned':
        return 'Dikembalikan';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ShoppingBag />;
      case 'processing':
        return <Refresh />;
      case 'shipped':
        return <LocalShipping />;
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      case 'returned':
        return <Replay />;
      default:
        return <ShoppingBag />;
    }
  };

  const tabs = [
    { label: 'Semua Pesanan', value: 'all' },
    { label: 'Menunggu Pembayaran', value: 'pending' },
    { label: 'Diproses', value: 'processing' },
    { label: 'Dikirim', value: 'shipped' },
    { label: 'Selesai', value: 'delivered' },
    { label: 'Dibatalkan', value: 'cancelled' },
  ];

  const filteredOrders = ordersData?.data?.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Beranda
        </Link>
        <Link component={RouterLink} to="/profile" color="inherit">
          Profil
        </Link>
        <Typography color="text.primary">Pesanan Saya</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Pesanan Saya
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Cari pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {tabs.map((tab) => (
                  <MenuItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => refetch()}>
                <Refresh />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Memuat pesanan...</Typography>
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Belum Ada Pesanan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Anda belum memiliki pesanan. Mulai belanja sekarang!
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            sx={{ bgcolor: '#ee4d2d' }}
          >
            Belanja Sekarang
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredOrders.map((order: Order) => (
            <Card key={order._id}>
              <CardContent>
                {/* Order Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(order.orderStatus)}
                    label={getStatusText(order.orderStatus)}
                    color={getStatusColor(order.orderStatus)}
                    variant="outlined"
                  />
                </Box>

                {/* Order Items */}
                <Box sx={{ mb: 2 }}>
                  {order.items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} x {formatPrice(item.price)}
                          {item.variant && ` (${item.variant.name}: ${item.variant.option})`}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Order Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Total Pembayaran:
                  </Typography>
                  <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => handleViewOrder(order)}
                  >
                    Lihat Detail
                  </Button>
                  
                  {order.orderStatus === 'pending' && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: '#ee4d2d' }}
                      onClick={() => navigate(`/checkout?order=${order._id}`)}
                    >
                      Bayar Sekarang
                    </Button>
                  )}

                  {order.orderStatus === 'processing' && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Batalkan Pesanan
                    </Button>
                  )}

                  {order.orderStatus === 'shipped' && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LocalShipping />}
                    >
                      Lacak Pengiriman
                    </Button>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Star />}
                        onClick={() => handleReviewProduct(order.items[0].product)}
                      >
                        Beri Ulasan
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Replay />}
                      >
                        Beli Lagi
                      </Button>
                    </>
                  )}

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Message />}
                    onClick={() => handleContactSeller(order._id)}
                  >
                    Hubungi Penjual
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detail Pesanan</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedOrder.orderNumber}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status Pesanan
                  </Typography>
                  <Chip
                    label={getStatusText(selectedOrder.orderStatus)}
                    color={getStatusColor(selectedOrder.orderStatus)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Metode Pembayaran
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.paymentMethod === 'cash_on_delivery' && 'COD'}
                    {selectedOrder.paymentMethod === 'bank_transfer' && 'Transfer Bank'}
                    {selectedOrder.paymentMethod === 'credit_card' && 'Kartu Kredit'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Alamat Pengiriman
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.street}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                    <br />
                    {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estimasi Pengiriman
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.estimatedDelivery && 
                      new Date(selectedOrder.estimatedDelivery).toLocaleDateString('id-ID')
                    }
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Detail Produk
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.quantity} x {formatPrice(item.price)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(selectedOrder.totalAmount)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Tutup</Button>
          {selectedOrder?.orderStatus === 'pending' && (
            <Button
              variant="contained"
              sx={{ bgcolor: '#ee4d2d' }}
              onClick={() => handleCancelOrder(selectedOrder._id)}
            >
              Batalkan Pesanan
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
