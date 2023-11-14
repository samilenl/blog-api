var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const passport = require("passport")
const connectDB = require("./configs/connectDB")
const strategy = require("./configs/passportJwtStrategy")



const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");


const blogRouter = require("./routes/blog")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// Connect to database
connectDB()

// Use the Passport JWT Strategy for authentication
passport.use(strategy)
app.use(passport.initialize())



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(compression());
app.use(helmet({crossOriginResourcePolicy: false,}));
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);


app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
// app.use('/', indexRouter);
app.use('/', blogRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: "Error"});
});


module.exports = app
