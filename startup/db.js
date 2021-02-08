const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
  mongoose.connect('mongodb://localhost/vidly-dev', {
    useUnifiedTopology: true,
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then(() => winston.info('Connected to MongoDB...'));
}
