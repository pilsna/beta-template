require(["esri/map",  "esri/geometry/Multipoint",  
    "dojo/on", "dojo/dom", "dojo/domReady!"], 
	function(){
		var map = new esri.Map("mapcontainer", {
			basemap: "streets",
			center: [-122.67, 45.52],
			zoom: 14
		});

}
);



$(document).on('click', '#sidebarButton', function(e) {
  e.preventDefault();
  $('body').toggleClass('active');
});

