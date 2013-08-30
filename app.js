var express  = require('express');
var http = require('http');
var port = process.env.PORT || 3000;
var path = require('path');

var app = express();
var server = http.createServer(app);
var routes = require('./routes');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.engine('.html', require('ejs').__express)
	app.set('view engine', 'html');

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(allowCrossDomain);
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