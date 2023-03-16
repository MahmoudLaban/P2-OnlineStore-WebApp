const { Router } = require("express");
const router = new Router();
const Product = require("./../models/Product.model")
const Order = require("./../models/Order.model")
const mongoose = require("mongoose"); // <== has to be added

// import middleware functions
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/route-guard.js");

// Route to retrieve all orders
router.get("/orders", isLoggedIn, isAdmin, (req, res) => {

    // Send a response to indicate that all orders are being retrieved
    res.send("Getting all the Orders")
  })
  

// Route to create an Order
router.post("/orders/:userId", isLoggedIn, isAdmin, (req, res, next) => {
    // Extract the user ID from the request parameters
    const { userId } = req.params;
    // Extract the cart data from the request body and parse it as JSON
    let { cart } = req.body;
    cart = JSON.parse(cart);
  
    // Transform the cart items into a product array for the order
    let products = [];
    cart.forEach(item => {
      products.push({
        productId: item.id,
        amount: item.amount
      });
    });
  
    // Create a new order object with the user ID and product array
    const newOrder = new Order({
      user: userId,
      products: products,
      price: 0 // replace with actual price calculation
    });
  
    // Save the new order to the database
    newOrder.save()
      .then(order => {
        // Respond with a success message
        res.send("Order created.");
      })
      .catch(error => next(error));
  });
  

// Checkout Page
router.get("/checkout", isLoggedIn, (req, res) => {

    const { ids } = req.query
    const idsArray = ids.split(",")
  
    Product.find({ _id: { $in: idsArray } }).then(products => {
      res.render('products/checkout', {
        products,
        userInSession: req.session.currentUser,
        layout: req.session.currentUser.role == "admin"
          ? 'loggedin-admin.hbs' : 'loggedin-user.hbs'
      })
    })
  
  })

  module.exports = router;