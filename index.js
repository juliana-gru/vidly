require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const error = require('./middleware/error');
const authorize = require('./middleware/auth');
const auth = require('./routes/auth');
const genresRouter = require('./routes/genres');
const customersRouter = require('./routes/customers');
const homeRouter = require('./routes/home');
const moviesRouter = require('./routes/movies');
const rentalsRouter = require('./routes/rentals');
const usersRouter = require('./routes/users');

const app = express();

process.on('unhandledRejection', (ex) => {
  console.log('We got an unhandled rejection.');
  throw ex;
});

winston.exceptions.handle(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ 
  db: 'mongodb://localhost/vidly-dev',
  level: 'info'
}));

//Make sure env variable is set otherwise app is not going to work properly
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly-dev', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(`Couldn't connect to MongoDB: `, err.message));

app.use(express.json());

app.use('/', homeRouter);
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/rentals', authorize, rentalsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));