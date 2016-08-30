require('dotenv').load();
var express = require('express');
var nunjucks = require('nunjucks');
var fun = require('./app_server/config/functions');
const S3_BUCKET = process.env.S3_BUCKET;
// Create a new Express application.
var app = express();
var multer = require('multer');
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'html');

var env = nunjucks.configure('views', {    
    express: app,
	tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
 }
}
);

//set up routes
require('./app_server/routes/uploads')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(process.env.PORT ||3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});

