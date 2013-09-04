require(["esri/map", "esri/arcgis/utils", "esri/IdentityManager",  
    "dojo/on", "dojo/dom", "dojo/domReady!"], 
    loadWebmap

);


function loadWebmap(map, utils, identityManager, on, dom, domReady){
	var webmap;
	var urlObject = esri.urlToObject(document.location.href);
	if (urlObject.query === null) {
		loadMap();
	} else {
		webmap = urlObject.query.webmap;	
		esri.arcgis.utils.createMap(webmap,"mapcontainer",{
		   mapOptions:{
		     slider:false
		   }
		}).then(function(response){
		    map = response.map;
		});
	}
}