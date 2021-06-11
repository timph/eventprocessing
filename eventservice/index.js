const express = require('express'),
  app = express(),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  http = require('http'),
  eventHandle = require('./eventHandle'),
  server = http.createServer(app);

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}
app.set('port', process.env.PORT || 4000);

app.use(methodOverride());
app.use(bodyParser.json());
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ success: 'Done' });
});
app.post('/', eventHandle);

server.listen(app.get('port'), function () {
  console.log(`Service listening on port ${app.get('port')} 🚀 🚀 🚀 `)
})
