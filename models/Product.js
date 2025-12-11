const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  thumbnail: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'like_new', 'good', 'fair', 'poor'],
    default: 'new',
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
  },
  variants: [{
    name: String,
    options: [String],
    price: Number,
    stock: Number,
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ seller: 1 });

module.exports = mongoose.model('Product', productSchema);
