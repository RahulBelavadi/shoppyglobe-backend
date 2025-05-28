const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Add product to cart
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Product ID and valid quantity required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create or update cart item
    let cartItem = await Cart.findOne({ userId: req.user.id, productId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId: req.user.id, productId, quantity });
    }

    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Valid quantity required' });
  }

  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete cart item
router.delete('/:id', auth, async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
