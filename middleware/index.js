let middlewareObject = {}; // Declares an empty object.

//Middleware to check login for user
middlewareObject.isNotLoggedIn = (req, res, next) => { // adds a new property named isNotLoggedIn to the middlewareObject. function checks if the user is not authenticated (i.e., not logged in), and if so, calls the next() function to pass control to the next middleware function in the chain. Otherwise, it redirects the user to the homepage (/).
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

middlewareObject.isLoggedIn = (req, res, next) => { // adds another property named isLoggedIn to the middlewareObject. function checks if the user is authenticated (i.e., logged in), and if so, calls the next() function to pass control to the next middleware function in the chain. 
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/signin");
};

module.exports = middlewareObject; // exports the middlewareObject so that other files can use it by importing it using the require() function.