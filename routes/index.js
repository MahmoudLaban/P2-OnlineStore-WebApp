const router = require("express").Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
