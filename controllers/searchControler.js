const Product = require('../model/ProductModel'); 

const searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        const products = await Product.find({ name: new RegExp(query, 'i') });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { searchProducts };
