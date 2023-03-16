//Import the required dependencies and middleware functions from other modules.
const { Router } = require("express");
const router = new Router();
const Product = require("../models/product")
const Order = require("./../models/Order.model")
const mongoose = require("mongoose"); // <== has to be added
// import middleware functions
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/route-guard.js");

// Route to retrieve all products
router.get("/products", isLoggedIn, async (req, res, next) => {

    try {
        // Use the await keyword to pause execution until the find() operation is complete
        const products = await Product.find();

        // Render the products-list view with the retrieved products and a layout based on the user role
        res.render('products/products-list', {
            products,
            layout: req.session.currentUser.role === "admin"
                ? 'loggedin-admin.hbs' : 'loggedin-user.hbs'
        });

    } catch (error) {
        // Pass any errors to the next error-handling middleware function
        next(error);
    }
});

// Route to retrieve a product by ID
router.get("/products/:productId", isLoggedIn, async (req, res, next) => {
    try {
      // pick the Id from the request parameters
      const { productId } = req.params;
      // Use the await keyword to pause execution until the findbyId() operation is complete
      const product = await Product.findById(productId);
  
      // Render the product-details view with the retrieved product and a layout template based on the user's role
      res.render('products/product-details', {
        product,
     //This is a property that specifies the layout template to be used when rendering the view. It is determined based on the current user's role, which is stored in the req.session.currentUser object.
     //If the user is an admin, the "loggedin-admin.hbs" template will be used, and if the user is not an admin, the "loggedin-user.hbs" template will be used.
        layout: req.session.currentUser.role == "admin"
          ? 'loggedin-admin.hbs' : 'loggedin-user.hbs'
      });
    } catch (error) {
      // Pass any errors to the next error-handling middleware function
      next(error);
    }
  });
  
// Route to render the admin dashboard page
router.get("/adminDashboard", isLoggedIn, isAdmin, async (req, res, next) => {
    try {
      // Find all products in the database
      const products = await Product.find();
      // Render the admin dashboard view with the products array and the loggedin-admin layout
      res.render('admin/products-dashboard', {
        products,
        layout: 'loggedin-admin.hbs'
      });
    } catch (error) {
      // Pass any errors to the next error-handling middleware function
      next(error);
    }
  });

// Route for creating a new product (get form)
router.get("/products/add", isLoggedIn, isAdmin, (req, res, next) => {
    try {
// Render the product addition form
      res.render('admin/product-add', {
        product,
        layout: 'loggedin-admin.hbs'
      });
    } catch (error) {
      // Pass any errors to the next error-handling middleware function
      next(error);
    }
  });
  
// Route for creating a new product (submit form)
router.post("/products", isLoggedIn, isAdmin, (req, res, next) => {
    try {
      // Extract the data submitted in the form
      const { title, price, description } = req.body;
      // Create a new product object with the extracted data
      const newProduct = new Product({ title, price, description });
      // Save the new product to the database
      newProduct.save().then(() => {
        // Redirect to the admin dashboard on successful product creation
        res.redirect('/adminDashboard');
      });
    } catch (error) {
      // Pass any errors to the next error-handling middleware function
      next(error);
    }
  });
  
// Route for updating a Product in the database (get form)
router.get("/products/:productId/edit", isLoggedIn, isAdmin, (req, res, next) => {
    try {
      // Get the product ID from the request parameters
      const { productId } = req.params;
  
      // Find the product in the database by ID
      Product.findById(productId).then(product => {
        // Render the product editing form with the product data
        res.render('admin/product-edit', {
          product,
          layout: 'loggedin-admin.hbs'
        });
      });
    } catch (error) {
      // Pass any errors to the next error-handling middleware function
      next(error);
    }
  });
  
  // Route for updating a Product in the database (submit form)
  router.post("/products/:productId/edit", isLoggedIn, isAdmin, (req, res, next) => {
    try {
      // Get the product ID and new data from the request parameters and body
      const { productId } = req.params;
      const { title, price, description } = req.body;
  
      // Update the product in the database with the new data
      Product.findByIdAndUpdate(productId, { title, price, description }, { new: true })
        .then(newProduct => {
          // Redirect to the admin dashboard on successful product update
          res.redirect('/adminDashboard');
        });
    } catch (error) {
      // Pass any errors to the next error-handling middleware function
      next(error);
    }
  });
  

// Route to Cart Page - displays the products in the user's cart
router.get("/cart", isLoggedIn, (req, res, next) => {

    // Get the product IDs from the query string and split them into an array
    const { ids } = req.query
    const idsArray = ids ? ids.split(",") : []
  
    // Find all products with IDs in the array
    Product.find({ _id: { $in: idsArray } })
      .then(products => {
        res.render('products/cart', {
          products,
          layout: req.session.currentUser.role == "admin"
            ? 'loggedin-admin.hbs' : 'loggedin-user.hbs'
        })
      })
      .catch(err => next(err))
    
  })
  

module.exports = router;
