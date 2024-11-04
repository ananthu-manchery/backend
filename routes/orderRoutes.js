const express = require('express');
const router = express.Router();
const Order = require('../model/orderModel'); 
const Product=require('../model/ProductModel')

router.post('/orders', async (req, res) => {
    try {
        const { userId, shippingAddress, orderItems, totalPrice, paymentMethod } = req.body;

        const newOrder = new Order({
            userId,
            shippingAddress,
            orderItems,
            totalPrice,
            paymentMethod,
            status: 'Pending',
        });

        const savedOrder = await newOrder.save();
        for (let item of orderItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Reduce the product's stock by the ordered quantity
                product.quantity -= item.quantity;

                // Check if the stock goes below zero (optional, to avoid negative stock)
                if (product.quantity < 0) {
                    return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
                }

                await product.save(); // Save the updated product
            }
        }

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});




router.get('/orders', async (req, res) => {
    const { userId } = req.query;  // Get userId from query parameters
    try {
        let orders;
        if (userId) {
            // If a userId is provided, fetch orders for that user
            orders = await Order.find({ userId });
        } else {
            // Otherwise, fetch all orders
            orders = await Order.find();
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});


router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});


router.put('/orders/:id', async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
  });
  

router.put('/orders/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
});


router.delete('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow deletion only if the status is 'Cancelled' or 'Delivered'
    if (order.status !== 'Cancelled' && order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Only cancelled or delivered orders can be removed' });
    }

    await Order.deleteOne({ _id: orderId });
    res.status(200).json({ message: 'Order removed successfully' });
  } catch (err) {
    console.error('Error removing order:', err);
    res.status(500).json({ message: 'Error removing order', error: err });
  }
});


  router.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    res.status(200).send('Order deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
