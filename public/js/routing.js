
console.log(dojoConfig.packages);
require(["esri/map", "esri/arcgis/utils", "esri/arcgis/Portal", "oauth/OAuthHelper",  
	"dojo/on", "dojo/domReady!"], 
	initialize
);

function initialize(map, utils, portal, oauthHelper, on, domReady){
	loadWebmap();

	oAuthHelper.init({
		appId:      "bAkrQgFPquOr8OXa",
		portal:     "http://www.arcgis.com",
        expiration: (14 * 24 * 60), // 2 weeks, in minutes
        popup:      true
    });


	if (!oAuthHelper.isSignedIn()) {
	    // Anonymous view
        domStyle.set("anonymousPanel", "display", "block");
        domStyle.set("personalizedPanel", "display", "none");
    	oAuthHelper.signIn(); //.then(displayItems);
    }
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