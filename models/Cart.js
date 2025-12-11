const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  variant: {
    name: String,
    option: String,
  },
  price: {
    type: Number,
    required: true,
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate total amount and items
cartSchema.methods.calculateTotals = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  this.totalItems = this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
