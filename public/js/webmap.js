require(["esri/map", "esri/arcgis/utils", "esri/IdentityManager",  
    "dojo/on", "dojo/dom", "dojo/domReady!"], 
    loadWebmap

);

function loadMap(){
		var map = new esri.Map("mapcontainer", {
			basemap: "streets",
			center: [-122.67, 45.52],
			zoom: 14
		});

}

function loadWebmap(){
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