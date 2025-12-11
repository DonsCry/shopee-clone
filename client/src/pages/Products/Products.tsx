import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
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
  Pagination,
  Skeleton,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  ExpandMore,
  FilterList,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product } from '../../types';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000000,
    condition: '',
    brand: '',
    freeShipping: false,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  const [page, setPage] = useState(1);

  const categories = [
    { id: 'elektronik', name: 'Elektronik' },
    { id: 'fashion-pria', name: 'Fashion Pria' },
    { id: 'fashion-wanita', name: 'Fashion Wanita' },
    { id: 'kesehatan', name: 'Kesehatan' },
    { id: 'makanan', name: 'Makanan & Minuman' },
    { id: 'mainan', name: 'Mainan Anak' },
    { id: 'olahraga', name: 'Olahraga' },
    { id: 'rumah-tangga', name: 'Rumah Tangga' },
  ];

  const brands = [
    'Samsung', 'Apple', 'Xiaomi', 'OPPO', 'Vivo', 'Adidas', 'Nike', 'Puma', 'Uniqlo', 'H&M'
  ];

  const conditions = [
    { value: 'new', label: 'Baru' },
    { value: 'like_new', label: 'Seperti Baru' },
    { value: 'good', label: 'Baik' },
    { value: 'fair', label: 'Cukup' },
  ];

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const condition = searchParams.get('condition') || '';
    const brand = searchParams.get('brand') || '';
    const freeShipping = searchParams.get('freeShipping') === 'true';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    setFilters({
      category,
      minPrice: minPrice ? parseInt(minPrice) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice) : 10000000,
      condition,
      brand,
      freeShipping,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  }, [searchParams]);

  const { data, isLoading, error } = useQuery(
    ['products', { ...filters, page, search: searchParams.get('search') }],
    () => productService.getProducts({
      ...filters,
      page,
      search: searchParams.get('search') || undefined,
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams(newFilters);
    setPage(1);
  };

  const updateSearchParams = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 10000000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.condition) params.set('condition', newFilters.condition);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.freeShipping) params.set('freeShipping', 'true');
    if (newFilters.sortBy !== 'createdAt') params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder !== 'desc') params.set('sortOrder', newFilters.sortOrder);
    
    setSearchParams(params);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const renderProductCard = (product: Product) => (
    <Card
      key={product._id}
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
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.name}
            sx={{ height: 200, width: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Link>
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
        {product.shipping.freeShipping && (
          <Chip
            label="Gratis Ongkir"
            color="success"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 1 }}>
        <Typography
          variant="body2"
          component={Link}
          to={`/product/${product._id}`}
          sx={{
            height: 40,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
            {formatPrice(product.price)}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', ml: 1 }}
            >
              {formatPrice(product.originalPrice)}
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
          Terjual {product.sold} • {product.seller.username}
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
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Filters Sidebar */}
        <Box sx={{ width: 280, flexShrink: 0 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            Filter
          </Typography>

          {/* Categories */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Kategori</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={filters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.checked ? category.id : '')}
                      />
                    }
                    label={category.name}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Price Range */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Harga</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom>
                Rp {filters.minPrice.toLocaleString('id-ID')} - Rp {filters.maxPrice.toLocaleString('id-ID')}
              </Typography>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(e, value) => {
                  const [min, max] = value as [number, number];
                  handleFilterChange('minPrice', min);
                  handleFilterChange('maxPrice', max);
                }}
                min={0}
                max={10000000}
                step={100000}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5000000, label: '5jt' },
                  { value: 10000000, label: '10jt' },
                ]}
              />
            </AccordionDetails>
          </Accordion>

          {/* Condition */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Kondisi</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {conditions.map((condition) => (
                  <FormControlLabel
                    key={condition.value}
                    control={
                      <Checkbox
                        checked={filters.condition === condition.value}
                        onChange={(e) => handleFilterChange('condition', e.target.checked ? condition.value : '')}
                      />
                    }
                    label={condition.label}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Brand */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Merek</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {brands.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={filters.brand === brand}
                        onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                      />
                    }
                    label={brand}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Free Shipping */}
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.freeShipping}
                onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
              />
            }
            label="Gratis Ongkir"
          />
        </Box>

        {/* Products Grid */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Sort and View Options */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {searchParams.get('search') ? `Hasil pencarian: "${searchParams.get('search')}"` : 'Semua Produk'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Urutkan</InputLabel>
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  label="Urutkan"
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <MenuItem value="createdAt-desc">Terbaru</MenuItem>
                  <MenuItem value="createdAt-asc">Terlama</MenuItem>
                  <MenuItem value="price-asc">Harga Terendah</MenuItem>
                  <MenuItem value="price-desc">Harga Tertinggi</MenuItem>
                  <MenuItem value="sold-desc">Terlaris</MenuItem>
                  <MenuItem value="rating.average-desc">Rating Tertinggi</MenuItem>
                </Select>
              </FormControl>
              <Box>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <ViewModule />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Products */}
          {isLoading ? (
            <Grid container spacing={2}>
              {Array.from({ length: 12 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : data?.data ? (
            <>
              <Grid container spacing={2}>
                {data.data.map((product: Product) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={product._id}>
                    {renderProductCard(product)}
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {data.pagination && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={data.pagination.pages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
              Tidak ada produk yang ditemukan
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
