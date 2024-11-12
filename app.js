var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',apiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Kết nối MongoDB
const uri = "mongodb://localhost:27017/MyDatabase";
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{
    console.log('Đã kết nối thành công tới MongoDB');
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err);
  })

  app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
});

module.exports = app;
