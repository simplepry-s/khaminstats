var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var updateRouter = require('./routes/update');

var app = express();
app.use(bodyParser.json());

const db = require('./config/key').mongoURI;

//Connect to mongo
mongoose.connect(db)
  .then(() => console.log('Mongo DB Connect...'))
  .catch(err => console.log(err));


  puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/update', updateRouter);



/// serve static aesset if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));


module.exports = app;
