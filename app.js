const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
const routes = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', routes);

// var listener = app.listen(config.get("app.port"), function () {
//   console.log("Listening on port " + listener.address().port);
// });

app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.json(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
    error: err,
  });
});

module.exports = app;
