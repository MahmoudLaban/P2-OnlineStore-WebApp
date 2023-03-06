//This module defines a simple route for the home page that renders a view using Handlebars. 
//When a client navigates to the home page, the view engine will render the "index" template and send the resulting HTML to the client.

//create a new router object and assign it to the "router" constant
const router = require("express").Router();

//call the "router" object get() method to define a route for the home page "/"
//The request handler function takes three arguments: req, res, and next. req contains information about the incoming request, res is the response object, and next is a function that can be called to pass control to the next middleware function in the chain.  The response handler function calls the res.render() method, which renders the index view and sends the HTML to the client.
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
