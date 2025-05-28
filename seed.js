const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  { name: "Smartphone", price: 499, description: "Latest smartphone", stock: 20 },
  { name: "Headphones", price: 99, description: "Noise-cancelling", stock: 50 },
  { name: "Laptop", price: 1200, description: "Gaming laptop", stock: 15 },
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Products seeded");
    process.exit();
  })
  .catch(err => console.log(err));
