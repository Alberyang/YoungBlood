const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const compression = require('compression');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

require('dotenv').config();

//uml
const isProduction = process.env.NODE_ENV === 'production';

// connect to DB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

// Tell Mongoose to use ES6 promises
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', false);

// Create global app object
const app = express();

app.use(cors());
app.use(compression());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('method-override')());

// delete request
app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'web-it',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false,
  })
);

// Models

require('./server/models/userModel');
require('./server/models/imageModel');
require('./server/models/pdfModel');
require('./server/models/courseModel');
require('./server/models/experienceModel');
require('./server/models/projectModel');
require('./server/models/momentModel');
// Authentication
require('./server/config/passport');

// Routes
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(require('./server/routes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(errorhandler());

  mongoose.set('debug', true);

  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 5000, function () {
  console.log(
    `Listening on port ${server.address().port}. Open http://localhost:${
      server.address().port
    }`
  );
});

module.exports = server;
