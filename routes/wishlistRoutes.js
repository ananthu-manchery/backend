

const express = require('express');
const Wishlist = require('../model/Wishlist'); 
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [{ productId, quantity: 1 }]
      });
    } else {
      const productIndex = wishlist.products.findIndex(p => p.productId.toString() === productId);

      if (productIndex > -1) {
        wishlist.products[productIndex].quantity += 1;
      } else {
        wishlist.products.push({ productId, quantity: 1 });
      }
    }

    await wishlist.save();
    res.json({ success: true, message: 'Item added to Wishlist' });
  } catch (error) {
    console.error('Error adding item to Wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for user' });
    }

    res.json({ wishlist: wishlist.products });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:userId/remove/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Filter out the product to remove it from the wishlist
    wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);

    // Save the updated wishlist
    await wishlist.save();

    res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



module.exports = router;
