function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earth Quakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(data) {
  
    // Pull the "stations" property off of response.data
    var quakes = data.features;
  
    // Initialize an array to hold bike markers
    var quakemarkers = [];
  
    // Loop through the stations array
    quakes.forEach(quake => {
      // For each station, create a marker and bind a popup with the station's name
      var quakeMarker = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
        .bindPopup("<h3> Magnitude: " + quake.properties.mag + "</h3>");
  
      // Add the marker to the bikeMarkers array
      quakemarkers.push(quakeMarker);
    })
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakemarkers));
    console.log(quakemarkers);
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(data => createMarkers(data));
  