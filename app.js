var express  = require('express');
var http = require('http');
var port = process.env.PORT || 3000;
var path = require('path');

var app = express();
var server = http.createServer(app);
var routes = require('./routes');

// Configuration
 
app.configure(function(){
  app.set('views', __dirname + '/views');

  //var jshtml = require('jshtml-express');
  //app.engine('jshtml', jshtml);
  app.engine('.html', require('ejs').__express)
  app.set('view engine', 'html');
  //app.set('view engine', 'jade');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
 
app.configure('production', function(){
  app.use(express.errorHandler());
});

// routes
require('./routes/index')(app);
 
server.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", server.address().port,
     app.settings.env);
});