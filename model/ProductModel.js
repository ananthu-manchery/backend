const { string, required } = require('joi');


const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:false,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    ageGroup: {
         type: String,
          required: false
         },
    
    brand: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0, 
      },
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
