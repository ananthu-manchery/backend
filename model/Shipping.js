const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone:{type:String , required:true}
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;
