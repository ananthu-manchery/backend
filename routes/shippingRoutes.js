const express = require('express');
const router = express.Router();
const Shipping = require('../model/Shipping'); 


router.post('/shipping', async (req, res) => {
  const { userId, name, address, city, postalCode, phone } = req.body; // added phone field
  try {
    const newShipping = new Shipping({ userId, name, address, city, postalCode, phone });
    const savedShipping = await newShipping.save();
    res.json(savedShipping);
  } catch (error) {
    console.error('Error saving shipping details:', error.message); // log the specific error
    res.status(500).json({ error: 'Failed to save shipping details' });
  }
});




router.get('/shipping/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const shippingDetails = await Shipping.find({ userId });
    res.json(shippingDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve shipping details' });
  }
});



router.put('/shipping/:id', async (req, res) => {
  try {
    const updatedAddress = await Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update address' });
  }
});


router.delete('/shipping/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShipping = await Shipping.findByIdAndDelete(id);
    if (!deletedShipping) {
      return res.status(404).json({ error: 'Shipping details not found' });
    }
    res.json({ message: 'Shipping details deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shipping details' });
  }
});


module.exports = router;
