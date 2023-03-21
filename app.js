require('dotenv').config()
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
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const hbs = require('hbs')

const app = express()
require('./config/passport')

// mongodb configuration
connectDB()
// view engine setup

app.set('views', path.join(__dirname, 'view'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/view')

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

/*
hbs.registerHelper('startsWith', function (str, prefix, options) {
  return str.startsWith(prefix)
    ? (options.fn ? options.fn(this) : '')
    : (options.inverse ? options.inverse(this) : '')
})
*/



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

// admin route
const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  }),
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// global variables across routes
app.use(async (req, res, next) => {
  try {
    res.locals.login = req.isAuthenticated()
    res.locals.session = req.session
    res.locals.currentUser = req.user
    const categories = await Category.find({}).sort({ title: 1 }).exec()
    res.locals.categories = categories
    next()
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// add breadcrumbs
get_breadcrumbs = function (url) {
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
app.use(function (req, res, next) {
  req.breadcrumbs = get_breadcrumbs(req.originalUrl)
  next()
})

//routes config
const indexRouter = require('./routes/index')
const productsRouter = require('./routes/products')
const usersRouter = require('./routes/user')
const pagesRouter = require('./routes/pages')
app.use('/products', productsRouter)
app.use('/user', usersRouter)
app.use('/pages', pagesRouter)
app.use('/', indexRouter)

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

const port = process.env.PORT || 3009
app.set('port', port)
app.listen(port, () => {
  console.log('Server running at port ' + port)
})

module.exports = app
