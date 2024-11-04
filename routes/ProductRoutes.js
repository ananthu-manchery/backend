const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');


router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);
router.put('/:id',productController.updateProduct)
router.delete('/:id',productController.deleteProduct)



router.get('/:id', productController.getProductById);
router.get('/productcount', productController.getProductCount);

  

module.exports = router;
