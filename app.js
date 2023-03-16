require('dotenv').config() // Loading environment variables from the .env file into the process.env.
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const Category = require('./models/category')
var MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const hbs = require('hbs') // Import the Handlebars.js view engine

const app = express()
require('./config/passport') // Creating the Express.js app and import the Passport.js authentication configuration

// Mongodb configuration....connect to MongoDB database
connectDB()
// View engine setup 
// Configurating the view engine to use Handlebars.js and set the views directory to views + register the Handlebars.js partials.

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views')

// Register custom helper function
hbs.registerHelper('eq', function (a, b) {
  return a === b
})
// Define a custom ifEqual helper
hbs.registerHelper('ifEqual', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})
hbs.registerHelper('not', function (value) {
  return !value
})
hbs.registerHelper('startsWith', function (str, prefix, options) {
  return str.startsWith(prefix)
    ? options.fn(this)
    : options.inverse
    ? options.inverse(this)
    : ''
})
hbs.registerHelper('isArray', function (value) {
  return Array.isArray(value)
})
hbs.registerHelper('or', function (a, b) {
  return a || b
})
hbs.registerHelper('times', function (n, block) {
  let accum = ''
  for (let i = 0; i < n; ++i) accum += block.fn(i)
  return accum
})

hbs.registerHelper('if_and', function(a, b, opts) {
  if (a && b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.registerHelper('add', function (value1, value2) {
  return parseInt(value1) + parseInt(value2);
});
hbs.registerHelper('lt', function(a, b) {
  return a < b;
});

hbs.registerHelper('gt', function(a, b) {
  return a > b;
});
hbs.registerHelper('lte', function (a, b, opts) {
  if (a <= b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.registerHelper('gte', function (a, b, opts) {
  if (a >= b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
})
hbs.registerHelper('Number', function(value) {
  return Number(value);
});
hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
hbs.registerHelper('if_lt', function(a, b, opts) {
  if (a < b) {
    return opts.fn(this);
  }
});
hbs.registerHelper('if_gt', function(a, b, opts) {
  if (a > b) {
    return opts.fn(this);
  }
});
hbs.registerHelper('unless_eq', function(a, b, opts) {
  if (a !== b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
// Define the slice helper function
const slice = (arr, start, end) => arr.slice(start, end)

// Register the slice helper with Handlebars
hbs.registerHelper('slice', slice)

// Admin route
// Configurating Node.js/Express application by setting up various middleware
const adminRouter = require('./routes/admin') // importing the adminRouter module from the file named admin.js located in ./routes...handling all routes responsible for handling all routes related to admin functionality.
app.use('/admin', adminRouter) // sets up the adminRouter middleware to handle any requests that start with the path /admin.

app.use(logger('dev')) // sets up the logger middleware with the 'dev' option to log HTTP requests and responses to the console in a colored format.
app.use(express.json()) // sets up the express.json() middleware to parse incoming JSON data and make it available in the req.body object of the request object.
app.use(express.urlencoded({ extended: false })) // sets up the express.urlencoded() middleware to parse incoming URL-encoded data and make it available in the req.body object of the request object.
app.use(cookieParser()) // sets up the cookie-parser middleware to parse cookies from the HTTP request headers and make them available in the req.cookies object of the request object.
app.use(express.static(path.join(__dirname, 'public'))) // sets up the express.static() middleware to serve static files such as images, stylesheets, and scripts from a directory named public located in the root directory of the application.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection, 
    }), // sets up the express-session middleware to enable session handling. The middleware takes an object as its argument, which specifies the configuration options for the session handling. In this case, the session secret is obtained from an environment variable named SESSION_SECRET. The resave and saveUninitialized options are set to false to improve session storage efficiency. Finally, a MongoStore instance is created to store the session data in a MongoDB database using the mongoose connection.
    //session expires after 3 hours... used to maintain the state of a user's session between requests.
    cookie: { maxAge: 3 * 60 * 60 * 1000 },
  }),
)
app.use(flash()) // using the flash middleware, which provides a way to store and retrieve flash messages in the session... e.g., your profile has been updated successfully.
app.use(passport.initialize()) // initializing Passport, which is an authentication middleware for Node.js.
app.use(passport.session()) // using the session middleware provided by Express to store Passport's user authentication state in the session.

// global variables across routes
app.use(async (req, res, next) => { // defining a middleware function that will be executed on every request.
  try {
    res.locals.login = req.isAuthenticated() // sets a login variable to true if the user is authenticated and false otherwise. 
    res.locals.session = req.session // sets a session variable to the current session object. 
    res.locals.currentUser = req.user // sets a currentUser variable to the currently authenticated user object (if any).
    const categories = await Category.find({}).sort({ title: 1 }).exec() // retrieves all categories from the database and sorts them by title in ascending order.
    res.locals.categories = categories
    next()
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// add breadcrumbs ... an array of objects, where each object represent a breadcrumb
get_breadcrumbs = function (url) { // takes a URL as input, and returns an array of breadcrumb objects.
  var rtn = [{ name: 'Home', url: '/' }],
    acc = '', // accumulative url
    arr = url.substring(1).split('/')

  for (i = 0; i < arr.length; i++) {
    acc = i != arr.length - 1 ? acc + '/' + arr[i] : null
    rtn[i + 1] = {
      name: arr[i].charAt(0).toUpperCase() + arr[i].slice(1),
      url: acc,
    }
  }
  return rtn
}
app.use(function (req, res, next) { // calls the get_breadcrumbs function with the req.originalUrl property, which contains the full original URL of the request.
  req.breadcrumbs = get_breadcrumbs(req.originalUrl)
  next()
})

//Routes configurations
const indexRouter = require('./routes/index') // imports the router for the root endpoint or index page of the application. This router will handle any requests made to the root URL of the application.
const productsRouter = require('./routes/products') // imports the router for the products endpoint of the application. This router will handle any requests made to the /products URL of the application.
const usersRouter = require('./routes/user') //  imports the router for the user endpoint of the application. This router will handle any requests made to the /user URL of the application.
const pagesRouter = require('./routes/pages') // imports the router for the pages endpoint of the application. This router will handle any requests made to the /pages URL of the application.
app.use('/products', productsRouter) // mounts the productsRouter middleware to the /products URL of the application. This means that any requests made to /products will be handled by the productsRouter.
app.use('/user', usersRouter) // mounts the usersRouter middleware to the /user URL of the application. This means that any requests made to /user will be handled by the usersRouter.
app.use('/pages', pagesRouter) // mounts the pagesRouter middleware to the /pages URL of the application. This means that any requests made to /pages will be handled by the pagesRouter.
app.use('/', indexRouter) // mounts the indexRouter middleware to the root URL of the application. This means that any requests made to the root URL of the application will be handled by the indexRouter.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const port = process.env.PORT || 3005
app.set('port', port)
app.listen(port, () => {
  console.log('Server running at port ' + port)
})

module.exports = app
