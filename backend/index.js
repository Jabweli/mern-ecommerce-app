const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

// product model
const Product = require("./models/productModel");
const User = require("./models/userModel");

const port = 4000;
const app = express();

app.use(express.json());
app.use(cors());

// connect to local database
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Database connected successfully!"));

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Add product endpoint
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    const last_product_array = products.slice(-1);
    const last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();

  res.json({
    status: "success",
    data: {
      product,
    },
  });
});

// Endpoint to fetch all products
app.get("/products", async (req, res) => {
  const products = await Product.find({});

  res.json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

// endpoint for new collection products
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  const newCollections = products.slice(1).slice(-8);
  console.log("New collections fetched");
  res.send(newCollections);
});

// Endpoint to delete product
app.post("/deleteproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.status(204).json({
    status: "success",
    message: "Deleted successfully!",
  });
});

// creating middleware to check auth user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate with a valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate with a valid token" });
    }
  }
};

// endpoint for adding product to cart
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log(req.body, req.user);
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;

  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Product added");
});

// endpoint for removing product from cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;

  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Product removed");
});

// endpoint for getting user cart data
app.post("/getcart", fetchUser, async (req, res) => {
  let user = await User.findOne({ _id: req.user.id });
  res.json(user.cartData);
});

// creating endpoint for signing up user
app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });

  if (check) {
    res.status(400).json({
      success: false,
      message: "Existing user found with that email address",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// endpoint to login user
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const passwordCompare = req.body.password === user.password;
    if (passwordCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } else {
    res.json({ success: false, message: "Incorrect email id" });
  }
});

// Start server
app.listen(port, () => {
  console.log("Server running on port", port);
});
