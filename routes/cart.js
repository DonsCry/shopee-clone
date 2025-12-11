const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId })
      .populate('items.product', 'name images thumbnail price stock');

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock available'
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        variant,
        price: product.price
      });
    }

    // Calculate totals
    cart.calculateTotals();
    await cart.save();

    // Populate product details for response
    await cart.populate('items.product', 'name images thumbnail price stock');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update cart item quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find and update the item
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product', 'name images thumbnail price stock');

    res.json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove', auth, async (req, res) => {
  try {
    const { productId, variant } = req.body;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find and remove the item
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items.splice(itemIndex, 1);
    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product', 'name images thumbnail price stock');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get cart summary
router.get('/summary', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      return res.json({
        success: true,
        summary: {
          totalItems: 0,
          totalAmount: 0,
          itemCount: 0
        }
      });
    }

    res.json({
      success: true,
      summary: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length
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
