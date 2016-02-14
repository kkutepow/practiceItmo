var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var admin = require('./routes/admin/admin');
var restaurants = require('./routes/admin/restaurants');
var chefs = require('./routes/admin/chefs');

var app = express();

knexSQL = require('knex')({
  client: 'mysql',
  connection: {   // ==== MySQL connection settings ===
    host     : '127.0.0.1',
    user     : 'root', // input your username
    password : '********', //    and password here!
    database : 'restaurantdb'
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', admin);
app.use('/', restaurants);
app.use('/', chefs);

// catch 404 and forward to error.ejs handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
