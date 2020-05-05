// query URL for all earth quakes the last week
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// A color gradient function
function pickColor(mag){
    if (mag <= 1){
        return '#00FF00'
    }else if(mag <= 2){
        return '#55CC22'
    }else if(mag <= 3){
        return '#77AA33'
    }else if(mag <= 4){
        return '#998833'
    }else if(mag <= 5){
        return '#DD7744'
    }else{
        return '#FF5544'
    }
}
// grab json from api
d3.json(url, function(data) {
    
    // A pop up binding function for each feature
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }
    //   create earthquake geoJSON layer
      var earthquakes = L.geoJSON(data, {
          onEachFeature: onEachFeature,
        //   create circle markers for each feature
          pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, 
                // Circle styling base on magnitude  
                {radius: feature.properties.mag*6,
                    fillColor: pickColor(feature.properties.mag),
                    color: "#000",
                    weight: 1,
                    opacity: 0.7,
                    fillOpacity: 0.9
                });
          }
      });
       drawMap(earthquakes);
  });
  
  function drawMap(earthquakes) {
    //   add plate data layer
    d3.json('static/data/plates.json', function(data) {
        var style = {
            "color": "#ff7800",
            "weight": 3,
            "opacity": 0.5
        };
        
        plateData = L.geoJSON(data, {
            style: style
        });

    // set up different tile layers
    var satellitetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY
    });
  
    var comicmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.comic",
      accessToken: API_KEY
    });

    var highmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.high-contrast",
      accessToken: API_KEY
    });
  
    // set up map and layers and control
    var baseMaps = {
      "Satellite Map": satellitetmap,
      "Comic Map": comicmap,
      "High Contrast Map": highmap
    };
    var overlayMaps = {
        Earthquakes: earthquakes,
        Plates: plateData
    };
    var myMap = L.map("map", {
      center: [
        37.7749, -122.4194
      ],
      zoom: 5,
      layers: [satellitetmap, earthquakes,plateData]
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
  
   // add legend
    var info = L.control({
        position: "bottomleft"
      });
      var legendHtml =['<h4>Color Magnitude Legend</h4>'];
      for (var i=0; i<5;i++){
        legendHtml.push(
            "<div class='legend_box' " +`style="background-color: ${pickColor(i+0.1)}"`
            +`<h3>${i}--    ${i+1}</h3>`
            +"</div>"
        )
      }
      legendHtml.push(
        "<div class='legend_box' " +`style="background-color: ${pickColor(i+0.1)}"`
        +`<h3>${i}+</h3>`
        +"</div>"
    )
      info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML = legendHtml.join("");
        return div;
      };
    info.addTo(myMap);  
});  
  };
