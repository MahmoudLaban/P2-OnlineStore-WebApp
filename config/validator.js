// Import check and validationResult functions from the express-validator library.

const { check, validationResult } = require("express-validator");

// Define validation rules for the sign-up form. The check() function validates the input fields, and returns an error message if the validation fails. This function is chained together with other validation methods like not().isEmpty() or isEmail() to specify additional validation requirements.

const userSignUpValidationRules = () => {
  return [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password", "Please enter a password with 4 or more characters")
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
  ];
};

// Define validation rules for the sign-in form. Similar to the previous step, this function uses check() to validate the email and password fields.

const userSignInValidationRules = () => {
  return [
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password", "Invalid password").not().isEmpty().isLength({ min: 4 }),
  ];
};

// Define validation rules for the contact-us form. This function uses check() to validate the name, email, and message fields.

const userContactUsValidationRules = () => {
  return [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email address")
      .not()
      .isEmpty()
      .isEmail(),
    check("message", "Please enter a message with at least 10 words")
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
  ];
};

// Define middleware functions to handle validation errors. These functions check the validation results and return an error message to the user if any validation rules fail. They also add a flash message to the req object, which can be used to display the error message on the web page. If the validation passes, the middleware calls the next() function to proceed to the next middleware in the stack.

const validateSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signup");
  }
  next();
};

const validateSignin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signin");
  }
  next();
};

const validateContactUs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    console.log(messages);
    req.flash("error", messages);
    return res.redirect("/pages/contact-us");
  }
  next();
};

// Export all the functions as an object, so they can be used in other parts of the application.

module.exports = {
  userSignUpValidationRules,
  userSignInValidationRules,
  userContactUsValidationRules,
  validateSignup,
  validateSignin,
  validateContactUs,
};
