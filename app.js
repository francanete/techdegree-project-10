var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

let sequelize = require('./models').sequelize;


/*  Error handler  */

app.use((req, res, next) => {
  console.log('404 error handler called');
  // const err = new Error();
  // err.status = 404;
  // err.message = "Sorry!  It looks like the page you're looking for does not exist.";

  // next(err);

  res.status(404).render('page-not-found');



});




/* Global error handler */
app.use((err, req, res, next) => {

  // if (err) {
  //   console.log('Global error handler called', err);
  // }
  if (err.status === 404) {
      res.status(404).render('page-not-found', { err });
  } else {
      err.message = err.message || 'Sorry! It looks like something went wrong on the server.';
      res.status(err.status || 500).render('error', {err});
  }
});



module.exports = app;