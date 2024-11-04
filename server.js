// const express=require('express')

// const connectDB=require("./config/db")
// const cors=require("cors")
// const userRoutes=require('./routes/userRoutes')

// const app=express()
// const PORT=process.env.PORT || 5000;

// app.use(express.json())
// app.use(cors())

// connectDB()
// app.use("/api/users",userRoutes)
// app.listen(PORT,()=>console.log(`server running on port ${PORT}`))

//server.js
const express = require('express');
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const app = express();
const productRoutes = require('./routes/ProductRoutes');
const path = require('path');
const cartRoutes = require('./routes/cartRoutes');
const searchRoutes = require('./routes/searchRoutes');

const shippingRoutes = require('./routes/shippingRoutes');
const orderRoutes = require('./routes/orderRoutes'); 





const wishlistRoutes = require('./routes/wishlistRoutes');



const PORT = process.env.PORT || 5000;


connectDB();

app.use(express.json());

app.use(cors({
  // origin: 'http://localhost:3000', 
  origin:'http://ananthu-manchery.github.io/Cycle-And-Accsoories',
  credentials: true, 
}));
app.use(express.urlencoded({extended:false}));
  app.use(express.static('./public'))


app.use("/api/users", userRoutes);
app.use("/api/products",productRoutes)
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', shippingRoutes);
app.use('/api', orderRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
