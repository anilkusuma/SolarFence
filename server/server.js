'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var customLib = require('./customlib.js');
var multer = require('multer');
var path = require('path');
var https = require('https');
var fs = require('fs');
var app = module.exports = loopback();
var bodyParser = require('body-parser');
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.start = function() {
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      //customLib.getNewId();
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
boot(app, __dirname, function(err) {
  if (err) throw err;
  if (require.main === module)
    app.start();
});
