// const express = require('express');
// const router = express.Router();
// const Cart = require('../model/Cart');

// router.post('/add', async (req, res) => {
//     console.log(req.body); 

//     const { userId, productId } = req.body;
  
//     if (!userId || !productId) {
//       return res.status(400).json({ message: 'User ID and Product ID are required' });
//     }
  
//     try {
//       let cart = await Cart.findOne({ userId });
//       if (!cart) {
//         cart = new Cart({ userId, products: [] });
//       }
  
//       cart.products.push({ productId });
//       await cart.save();
  
//       res.status(200).json({ message: 'Product added to cart', cart });
//     } catch (error) {
//       console.error('Error adding product to cart:', error);
//       res.status(500).json({ message: 'Internal server error', error });
//     }
//   });

//   router.delete('/:userId/remove/:productId', async (req, res) => {
//     try {
//       const { userId, productId } = req.params;
//       const cart = await Cart.findOne({ userId });
      
//       if (!cart) {
//         return res.status(404).json({ message: "Cart not found" });
//       }

//       cart.cartItems = cart.cartItems.filter(item => item.productId.toString() !== productId);
  
//       await cart.save();
//       res.json({ message: 'Item removed successfully', cart });
//     } catch (error) {
//       console.error('Error removing item from cart:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
// });
// module.exports = router;
