/*
* GET home page.
*/

var webmaps = {
	'wind': 'a30160193b1f4922be09d62940f65696',
	'andet': 'asdf'
};

module.exports = function(app) {
	app.get('/', function(req, res){
		res.render('index', { title: 'template' })
	});
	app.get('/route', function(req, res){
		res.render('route', { title: 'template' })
	});
	app.get('/esri', function(req, res){
		res.render('esri', { title: 'template' })
	});
	app.get('/simple', function(req, res){
		res.render('simple/simple', { title: 'template' })
	});
	app.get('/simple/:template', function(req, res){
		res.render('simple/' + req.params.template, { title: 'template' })
	});
	app.get('/simple/:template/:map', function(req, res){
		res.redirect('simple/' + req.params.template + '?webmap=' + webmaps[req.params.map])
	});
	app.get('/tmpl/:template', function(req, res){
		var mapname = req.params.mapname;
		console.log(mapname);
		if (mapname !== undefined) {
			res.redirect('/tmpl/' + req.params.template + '?webmap=' + webmaps[req.params.mapname])
		} else {
			res.render(req.params.template, { title: 'template' })
		}
	});

};
