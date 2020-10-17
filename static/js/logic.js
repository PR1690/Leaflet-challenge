// create variable for url

var earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Creating map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
  });
  
// Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
// create a function link to get the geojson data.
 function earthquakes(features, latlng) {
    var magn = features.properties.mag;             //create variable to get magnitude data from json file
    var magd = features.geometry.coordinates[2];    //create variable to get depth of the earth (third coordinate)from json file
    var magcolor = "red"
    if (magd > 80){
        magcolor = 'rgb(255, 0, 0)'
    }else if (magd <= 80 && magd  >= 70){
        magcolor = 'rgb(255, 102, 0)'
    }else if (magd <= 69 && magd  >= 50){
        magcolor = 'rgb(255, 153, 51)'
    }else if (magd <= 49 && magd  >= 30){
        magcolor = 'rgb(255, 204, 0)'
    }else if (magd <= 29 && magd  >= 10){
        magcolor = 'rgb(204, 255, 102)'
    }else {
        magcolor = 'rgb(64, 255, 0)'
    }
    let circle = {
        radius: magn * 5,
        fillColor: magcolor,
        color: "black",
        weight: 1,
        fillOpacity: 0.80
    } 
    return L.circleMarker(latlng, circle);

 }

  // Grabbing our GeoJSON data..
  d3.json(earth_url, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {pointToLayer: earthquakes}).addTo(myMap);
  });

  // create a scale for legends to provide context to earthquake magnitude

  function legendclr(d) {
    return d > 80
      ? "rgb(255, 0, 0)"
      : d > 70
      ? "rgb(255, 102, 0)"
      : d > 50
      ? "rgb(255,153,51)"
      : d > 30
      ? "rgb(255,204,0)"
      : d > 10
      ? "rgb(204,255,102)"
      : "rgb(64, 255, 0)";
}
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  labels = ['<strong>Depth</strong>'],
  categories = ['0','10','30','50','70','80'];
  for (var i = 0; i < categories.length; i++) {
          div.innerHTML +=
          labels.push('<i class="circle" style="background:' + legendclr(categories[i]) + '"></i> ' +
              + categories[i] + (categories[i + 1] ? "&ndash;" + categories[i + 1] + "<br>" : "+"));
      }
      div.innerHTML = labels.join('<br>');
  return div;
  };
legend.addTo(myMap);
 