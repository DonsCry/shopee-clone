import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link,
  Divider,
  Tab,
  Tabs,
  Paper,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Refresh,
  Star,
  ExpandMore,
  Store,
  Message,
} from '@mui/icons-material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productService } from '../../services/productService';
import { Product } from '../../types';

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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{ name: string; option: string } | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productService.getProductById(id!),
    {
      enabled: !!id,
    }
  );

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', { productId: id, quantity, variant: selectedVariant });
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log('Buy now:', { productId: id, quantity, variant: selectedVariant });
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          Produk tidak ditemukan
        </Typography>
      </Container>
    );
  }

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Beranda
        </Link>
        <Link component={RouterLink} to="/products" color="inherit">
          Produk
        </Link>
        <Link component={RouterLink} to={`/products?category=${product.category._id}`} color="inherit">
          {product.category.name}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Main Image */}
            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                image={product.images[selectedImage]}
                alt={product.name}
                sx={{ height: 400, objectFit: 'contain' }}
              />
            </Card>

            {/* Thumbnail Images */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
              {product.images.map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    minWidth: 80,
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #ee4d2d' : '1px solid #e0e0e0',
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Product ${index + 1}`}
                    sx={{ height: 80, width: 80, objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Product Title */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              {product.name}
            </Typography>

            {/* Rating and Sold */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={product.rating.average} precision={0.1} size="small" readOnly />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {product.rating.average} ({product.rating.count} rating)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Terjual {product.sold}
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(product.price)}
                </Typography>
                {discountPercentage > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(product.originalPrice!)}
                    </Typography>
                    <Chip label={`${discountPercentage}% OFF`} color="error" size="small" />
                  </>
                )}
              </Box>
            </Box>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Pilih Variasi
                </Typography>
                {product.variants.map((variant) => (
                  <Box key={variant.name} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {variant.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {variant.options.map((option) => (
                        <Button
                          key={option}
                          variant={selectedVariant?.option === option ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setSelectedVariant({ name: variant.name, option })}
                        >
                          {option}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Quantity */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Jumlah
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 100 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Stok: {product.stock}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                sx={{ flex: 1, bgcolor: '#ee4d2d' }}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleBuyNow}
                sx={{ flex: 1 }}
                disabled={product.stock === 0}
              >
                Beli Sekarang
              </Button>
              <IconButton size="large">
                <FavoriteBorder />
              </IconButton>
              <IconButton size="large">
                <Share />
              </IconButton>
            </Box>

            {/* Seller Info */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>
                    <Store />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{product.seller.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Online • 99% respon
                    </Typography>
                  </Box>
                </Box>
                <Button variant="outlined" startIcon={<Message />}>
                  Chat
                </Button>
              </Box>
            </Paper>

            {/* Shipping Info */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                icon={<LocalShipping />}
                label={product.shipping.freeShipping ? 'Gratis Ongkir' : 'Ongkir Rp 15.000'}
                color={product.shipping.freeShipping ? 'success' : 'default'}
              />
              <Chip icon={<Security />} label="Garansi 7 Hari" />
              <Chip icon={<Refresh />} label="Bisa Retur" />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Paper>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Deskripsi" />
            <Tab label="Spesifikasi" />
            <Tab label="Ulasan" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {product.description}
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informasi Dasar</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Kondisi</Typography>
                    <Typography variant="body2">
                      {product.condition === 'new' ? 'Baru' : 'Bekas'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Berat</Typography>
                    <Typography variant="body2">{product.shipping.weight || 1} kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Kategori</Typography>
                    <Typography variant="body2">{product.category.name}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Pengiriman</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Estimasi Pengiriman</Typography>
                    <Typography variant="body2">2-4 hari</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Asal Pengiriman</Typography>
                    <Typography variant="body2">Jakarta</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ulasan Pembeli ({product.rating.count})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {product.rating.average}
                </Typography>
                <Box>
                  <Rating value={product.rating.average} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {product.rating.count} ulasan
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              Belum ada ulasan untuk produk ini
            </Typography>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductDetail;
