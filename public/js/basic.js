var clicked; 
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
                //console.log('response: ');
                //console.log(response);
                function updateInfo(clickEvent){
                    //console.log(response);
                    var html = response.itemInfo.itemData.operationalLayers[0].popupInfo.description;
                    //console.log(html);
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
                    }
                    clicked = clickEvent;
                    //console.log(clicked);
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
