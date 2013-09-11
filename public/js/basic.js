define([
    "dojo/ready", 
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/arcgis/utils",
    "esri/IdentityManager",
    "esri/tasks/ClosestFacilityTask",
    "esri/tasks/ClosestFacilityParameters",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/tasks/FeatureSet",
    "esri/tasks/DataLayer"
],
function(
    ready, 
    declare,  
    lang,
    arcgisUtils,
    IdentityManager,
    ClosestFacilityTask,
    ClosestFacilityParameters,
    Point,
    Graphic,
    FeatureSet,
    DataLayer
) {
    return declare("", null, {
        config: {},
        constructor: function(config) {
            //config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information. 
            this.config = config;
            ready(lang.hitch(this, function() {
                this._createWebMap();
            }));
        },
        _mapLoaded: function() {
            // Map is ready
            console.log('map loaded');
        },
        //create a map based on the input web map id
        _createWebMap: function() {
            var closestTask = new ClosestFacilityTask('http://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World')
            var closestParams = new ClosestFacilityParameters();
            arcgisUtils.createMap(this.config.webmap, "mapDiv", {
                mapOptions: {
                    //Optionally define additional map config here for example you can 
                    //turn the slider off, display info windows, disable wraparound 180, slider position and more. 
                },
                bingMapsKey: this.config.bingmapskey
            }).then(lang.hitch(this, function(response) {
                //Once the map is created we get access to the response which provides important info 
                //such as the map, operational layers, popup info and more. This object will also contain
                //any custom options you defined for the template. In this example that is the 'theme' property.
                //Here' we'll use it to update the application to match the specified color theme.  
                //console.log(this.config);
                this.map = response.map;

                function routeHandler(clickEvent){
                	console.log('routeHandler called, graphicsLayer:');
                	//console.log(closestTask);
                	//console.log(this.getLayer(this.graphicsLayerIds[0]))
                	var inPoint = new Point(clickEvent.mapPoint.x, clickEvent.mapPoint.y, this.spatialReference);
                	var location = new Graphic(inPoint);
                	var features = [];
                	features.push(location);
                	var incidents = new FeatureSet();
                	incidents.features = features;
                	closestParams.incidents = incidents;

                	var graphicsLayer = this.getLayer(this.graphicsLayerIds[0]);
                	var facilities = new FeatureSet();
                	//facilities.geometry = this.extent;
                	facilities.features = graphicsLayer.graphics;
                	closestParams.facilities = facilities; 
                	//this.getLayer(this.graphicsLayerIds[0]).graphics;

                	console.log(IdentityManager);
                	//closestParams.token = IdentityManager.credentials[0].token;
 					//closestParams.f = 'json';
                	closestTask.solve(closestParams, function(solveResult){
                		var directions = solveResult.directions;
                		console.log(directions);
                		array.forEach(solveResult.routes, function(route, index){
							//build an array of route info
							var attr = array.map(solveResult.directions[index].features,function(feature){
								return feature.attributes.text;
							});
							console.log(route)
							/*
							var infoTemplate = new InfoTemplate("Attributes", "${*}");

							route.setInfoTemplate(infoTemplate);
							route.setAttributes(attr);

							routeGraphicLayer.add(route);
							dom.byId("directionsDiv").innerHTML = "Hover over the route to view directions";
							*/
						});

						//display any messages
						if(solveResult.messages.length > 0){
							//dom.byId("directionsDiv").innerHTML = "<b>Error:</b> " + solveResult.messages[0];
							console.log(solveResult.messages[0]);
						}      
					});
                }

                if (this.map.loaded) {
                    // do something with the map
                    //console.log(this.map);
                    this.map.on('click', updateInfo);
                    this._mapLoaded();
                } else {
                    on(this.map, "load", lang.hitch(this, function() {
                        // do something with the map
                        this._mapLoaded();
                    }));
                }
            }), lang.hitch(this, function(error) {
                //an error occurred - notify the user. In this example we pull the string from the 
                //resource.js file located in the nls folder because we've set the application up 
                //for localization. If you don't need to support mulitple languages you can hardcode the 
                //strings here and comment out the call in index.html to get the localization strings. 
                if (this.config && this.config.i18n) {
                    alert(this.config.i18n.map.error + ": " + error.message);
                } else {
                    alert("Unable to create map: " + error.message);
                }
            }));
        }
    });
});
