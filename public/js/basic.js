var clicked, map; 
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments[0];
    return this.replace(/{(\w+)}/g, function(match, key) { 
      return ((typeof args[key] !== 'undefined') && (args[key] !== null))
        ? args[key]
        : '&nbsp;'
      ;
    });
  };
}

define([
    "dojo/ready", 
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "esri/arcgis/utils",
    //"esri/IdentityManager",
    "esri/geometry/Point",
    "esri/graphic"
    //"esri/tasks/FeatureSet",
    //"esri/tasks/DataLayer"
],
function(
    ready, 
    on,
    declare,  
    lang,
    array,
    arcgisUtils,
    //IdentityManager,
    Point,
    Graphic
    //FeatureSet,
    //DataLayer
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
            arcgisUtils.createMap(this.config.webmap, "mapDiv", {
                mapOptions: {
                    //Optionally define additional map config here for example you can 
                    //turn the slider off, display info windows, disable wraparound 180, slider position and more. 
                },
                bingMapsKey: this.config.bingmapskey,
                ignorePopups: true
            }).then(lang.hitch(this, function(response) {
                //Once the map is created we get access to the response which provides important info 
                //such as the map, operational layers, popup info and more. This object will also contain
                //any custom options you defined for the template. In this example that is the 'theme' property.
                //Here' we'll use it to update the application to match the specified color theme.  
                //console.log(this.config);
                this.map = response.map;
                //var higlightLayer = new GraphicsLayer("highlight");
                //this.map.addLayer(higlightLayer);
                //console.log('response: ');
                //console.log(response);
                function updateInfo(clickEvent){
                    //console.log(response);
                    var id = clickEvent.graphic._graphicsLayer.id
                    console.log(id);
                    var layers = response.itemInfo.itemData.operationalLayers;
                    var currentId = 0;
                    array.forEach(layers, function(layer, i){
                        if (layer.id === id){
                            currentId = i;
                        }
                    });
                    console.log(currentId);
                    var html = layers[currentId].popupInfo.description;
                    //var layerId = clickEvent.graphic._graphicsLayer.id;
                    //var layer = response.map.getLayer(layerId);
                    //console.log(layer);
                    var formatted = html.format(clickEvent.graphic.attributes)
                    //console.log('formatted: ' + formatted);
                    //console.log(clickEvent.graphic.attributes.KomNavn);
                    if (clickEvent.graphic !== undefined) {
                        var box = document.getElementById("infobox");
                        var text = document.getElementById("infotext");
                        if (clickEvent.graphic.infoTemplate === undefined){
                            text.innerHTML = formatted;
                        } else {
                            text.innerHTML = clickEvent.graphic.infoTemplate;
                        }
                        box.style.visibility = 'visible';
                        highlight(clickEvent);
                    }
                   
                }
                function highlight(event) {
                    response.map.graphics.clear();
                    //console.log("event fired");
                    //console.log(event);
                    if (event.graphic !== undefined) {
                        //console.log(event.graphic.symbol);
                        var highlightSymbol = 
                            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, 
                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, 
                            new dojo.Color([255,0,0]), 3), new dojo.Color([125,125,125,0.35]));
                        //console.log(event.graphic);
                        var highlightGraphic = new esri.Graphic(event.graphic.geometry, highlightSymbol);
                        response.map.graphics.add(highlightGraphic);
                    }
                }
                function info(layer) {
                    return 'id=' + layer.id + ' graphicsLayerIds=' + response.map.graphicsLayerIds + ' layerIds=' + response.map.layerIds;
                }
                if (this.map.loaded) {
                    // do something with the map
                    // console.log(this);
                    //dojo.connect(this.map.graphics, 'onClick', updateInfo);
                    //this.map.graphics.on('click', updateInfo);
                    on(this.map, 'click', updateInfo);
                    var closebutton = document.getElementById("closebutton");
                    on(closebutton, 'click', function(){
                        this.parentElement.style.visibility = 'hidden';
                    });
                    console.log(info(this.map.graphics));
                    this.map.graphics.enableMouseEvents();
                    //console.log(this.map);
                    //on(this.map, 'mouse-over', highlight);
                    //on(this.map, 'mouse-out', function(event){
                        //response.map.graphics.clear();
                    //});
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
