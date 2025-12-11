const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validate items and check stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`
        });
      }

      // Add to order items
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.thumbnail,
        price: product.price,
        quantity: item.quantity,
        variant: item.variant,
        seller: product.seller
      });

      subtotal += product.price * item.quantity;

      // Update product stock and sold count
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    // Calculate totals
    const shippingFee = paymentMethod === 'cash_on_delivery' ? 15000 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const discount = 0; // Can be calculated based on promotions
    const totalAmount = subtotal + shippingFee + tax - discount;

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      discount,
      totalAmount,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.userId },
      { items: [], totalAmount: 0, totalItems: 0 }
    );

    // Populate order details for response
    await order.populate('items.product', 'name');
    await order.populate('user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.userId };
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
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

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'username email profile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.userId) {
      const user = await User.findById(req.userId);
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order'
        });
      }
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update order status'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get seller's orders
router.get('/seller/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Find orders that contain products from this seller
    const orders = await Order.find({
      'items.seller': req.userId
    })
      .populate('items.product', 'name')
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter orders by status if specified
    let filteredOrders = orders;
    if (status) {
      filteredOrders = orders.filter(order => order.orderStatus === status);
    }

    const total = await Order.countDocuments({
      'items.seller': req.userId
    });

    res.json({
      success: true,
      orders: filteredOrders,
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
