/*
 * GET home page.
 */

module.exports = function(app) {
   app.get('/', function(req, res){
     res.render('index', { title: 'template' })
   });
   app.get('/esri', function(req, res){
     res.render('esri', { title: 'template' })
   });
};
