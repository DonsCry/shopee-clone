import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  FlashOn,
  LocalOffer,
  Star,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productService } from '../../services/productService';
import { Product } from '../../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { data: products, isLoading } = useQuery(
    'featuredProducts',
    productService.getFeaturedProducts,
    {
      onSuccess: (data) => {
        setFeaturedProducts(data.slice(0, 8));
      },
    }
  );

  const categories = [
    { name: 'Elektronik', image: '/api/placeholder/200/200', link: '/products?category=elektronik' },
    { name: 'Fashion Pria', image: '/api/placeholder/200/200', link: '/products?category=fashion-pria' },
    { name: 'Fashion Wanita', image: '/api/placeholder/200/200', link: '/products?category=fashion-wanita' },
    { name: 'Kesehatan', image: '/api/placeholder/200/200', link: '/products?category=kesehatan' },
    { name: 'Makanan', image: '/api/placeholder/200/200', link: '/products?category=makanan' },
    { name: 'Mainan', image: '/api/placeholder/200/200', link: '/products?category=mainan' },
    { name: 'Olahraga', image: '/api/placeholder/200/200', link: '/products?category=olahraga' },
    { name: 'Rumah Tangga', image: '/api/placeholder/200/200', link: '/products?category=rumah-tangga' },
  ];

  const flashDeals = [
    { id: 1, name: 'Flash Sale 1', discount: 50, timeLeft: '2:34:56' },
    { id: 2, name: 'Flash Sale 2', discount: 70, timeLeft: '1:23:45' },
    { id: 3, name: 'Flash Sale 3', discount: 30, timeLeft: '4:56:78' },
  ];

  const banners = [
    { id: 1, title: 'Diskon 50% Semua Produk', subtitle: 'Hanya Hari Ini!', image: '/api/placeholder/1200/300' },
    { id: 2, title: 'Gratis Ongkir', subtitle: 'Minimal Belanja 50rb', image: '/api/placeholder/1200/300' },
    { id: 3, title: 'Cashback 20%', subtitle: 'Pakai ShopeePay', image: '/api/placeholder/1200/300' },
  ];

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{ bgcolor: '#fff3e0', py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            {banners.map((banner) => (
              <Grid item xs={12} md={4} key={banner.id}>
                <Card sx={{ position: 'relative', height: 300 }}>
                  <CardMedia
                    component="img"
                    image={banner.image}
                    alt={banner.title}
                    sx={{ height: 300, objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {banner.title}
                    </Typography>
                    <Typography variant="body2">{banner.subtitle}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Kategori
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} lg={1.5} key={category.name}>
              <Card
                component={Link}
                to={category.link}
                sx={{
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={category.image}
                  alt={category.name}
                  sx={{ height: 80, width: 80, mx: 'auto', p: 1 }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Flash Deals */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FlashOn sx={{ color: '#ee4d2d', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Flash Deals
          </Typography>
          <Chip
            label="Berakhir dalam"
            color="error"
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        <Grid container spacing={2}>
          {flashDeals.map((deal) => (
            <Grid item xs={12} sm={6} md={4} key={deal.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{deal.name}</Typography>
                    <Chip
                      label={`${deal.discount}% OFF`}
                      color="error"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Berakhir dalam: {deal.timeLeft}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Produk Terlaris
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="outlined"
            color="primary"
          >
            Lihat Semua
          </Button>
        </Box>
        <Grid container spacing={2}>
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : featuredProducts.map((product) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={product._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={product.thumbnail}
                        alt={product.name}
                        sx={{ height: 200, objectFit: 'cover' }}
                      />
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Chip
                          label={`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`}
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          height: 40,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                          Rp {product.price.toLocaleString('id-ID')}
                        </Typography>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through', ml: 1 }}
                          >
                            Rp {product.originalPrice.toLocaleString('id-ID')}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating
                          value={product.rating.average}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          ({product.rating.count})
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Terjual {product.sold}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 1, pt: 0 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{ flex: 1 }}
                          color="primary"
                        >
                          <ShoppingCart fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <FavoriteBorder fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* Special Offers */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Penawaran Spesial
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Gratis Ongkir
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Minimal pembelian Rp 50.000
                </Typography>
                <Button variant="contained" sx={{ mt: 2, bgcolor: '#ee4d2d' }}>
                  Belanja Sekarang
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#e8f5e8' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Cashback 20%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan ShopeePay
                </Typography>
                <Button variant="contained" sx={{ mt: 2, bgcolor: '#ee4d2d' }}>
                  Aktifkan Sekarang
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
