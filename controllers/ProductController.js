const mongoose = require('mongoose'); 
const Product = require('../model/ProductModel');
const upload = require('../middlewares/multer'); 

exports.getAllProducts = (req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch(error => res.status(500).json({ error: 'Error fetching products:', error }));
};


// Get product count (new endpoint)
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments(); 
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product count', error });
  }
};


exports.addProduct = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected!' });
    }

    console.log(req.body); 

    const newProduct = new Product({
      name: req.body.name,
      description:req.body.description,
      price: req.body.price,
      category: req.body.category,
      ageGroup: req.body.ageGroup,  
      brand: req.body.brand,
      image: req.file.path,
      quantity: req.body.quantity
    });

    newProduct.save()
      .then(product => res.json({ message: 'Product added successfully', product }))
      .catch(error => res.status(500).json({ error: 'Error saving product:', error }));
  });
};


exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  if (req.file) {
    updateData.image = req.file.path;  
  }

  Product.findByIdAndUpdate(productId, updateData, { new: true })
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully', product });
    })
    .catch(error => res.status(500).json({ error: 'Error updating product:', error }));
};


exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  Product.findByIdAndDelete(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    })
    .catch(error => res.status(500).json({ error: 'Error deleting product:', error }));
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.buyProduct = async (req, res) => {
  const { productId, quantityPurchased } = req.body;

  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantityPurchased) {
      return res.status(400).json({ message: 'Insufficient product quantity available' });
    }

    product.quantity -= quantityPurchased;
    await product.save();

    res.json({ message: 'Purchase successful', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

