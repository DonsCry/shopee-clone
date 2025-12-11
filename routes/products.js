const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      condition,
      brand,
      freeShipping
    } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (condition) {
      filter.condition = condition;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (freeShipping === 'true') {
      filter['shipping.freeShipping'] = true;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('seller', 'username')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller', 'username profile');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new product (seller only)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      condition,
      stock,
      shipping,
      variants,
      tags
    } = req.body;

    // Check if user is seller or admin
    const user = await User.findById(req.userId);
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can create products'
      });
    }

    // Process uploaded images
    const images = req.files.map(file => `/uploads/${file.filename}`);
    const thumbnail = images.length > 0 ? images[0] : '';

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      subcategory,
      brand,
      images,
      thumbnail,
      condition: condition || 'new',
      stock: parseInt(stock),
      seller: req.userId,
      shipping: shipping ? JSON.parse(shipping) : {},
      variants: variants ? JSON.parse(variants) : [],
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.userId) {
      const user = await User.findById(req.userId);
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }
    }

    const updates = req.body;
    
    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updates.images = [...product.images, ...newImages];
      if (!updates.thumbnail) {
        updates.thumbnail = newImages[0];
      }
    }

    Object.assign(product, updates);
    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.userId) {
      const user = await User.findById(req.userId);
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this product'
        });
      }
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured products
router.get('/featured/all', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name')
      .populate('seller', 'username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get products by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      seller: req.params.sellerId, 
      isActive: true 
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({ 
      seller: req.params.sellerId, 
      isActive: true 
    });

    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
