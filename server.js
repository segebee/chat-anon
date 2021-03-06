const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');
const { isProduction } = require('./utils');
require('./utils/mongoose');


const port = 4300 || process.env.PORT;
const app = express();

if (!isProduction) {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = req.app.get('env') === 'development' ? err.message : 'There are no houses here';
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(err);
  console.log(req.url);
  res.json({ result: err });
});


app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening on %s ', port);
});
