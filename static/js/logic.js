// Step 1: CREATE THE BASE LAYERS
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  
  function chooseColor(depth) {
    let color = "#98ee00";
  
    // If statement on color
    if (depth > 90) {
      color = "#ea2c2c";
    } else if (depth > 70) {
      color = "#ea822c";
    } else if (depth > 50) {
      color = "#ee9c00";
    } else if (depth > 30) {
      color = "#eecc00";
    } else if (depth > 10) {
      color = "#d4ee00";
    } else {
      color = "#98ee00";
    }
  
    return color;
  }

  function getRadius(mag) {
    return mag * 4;
  }
  
  let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
  d3.json(queryUrl).then(function (data) {
    // Step 2: CREATE THE DATA/OVERLAY LAYERS
    console.log(data);

    let markers = [];
    for (let i = 0; i < data.features.length; i++) {
        let row = data.features[i];
        let location = row.geometry.coordinates;
        if (location) {
            let latitude = location[1];
            let longitude = location[0];
            let depth = location[2];
            let mag = row.properties.mag;

      // Create Marker
        let marker = L.circleMarker([latitude, longitude], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: chooseColor(depth),
            radius: getRadius(mag)
        }).bindPopup(`<h1>${row.properties.title}</h1><hr><h2>Depth: ${depth}m</h2>`);

        markers.push(marker);
    }
};
    let markerLayer = L.layerGroup(markers);

    // Step 3: CREATE THE LAYER CONTROL
    let baseMaps = {
      Street: street,
      Topography: topo
    };
  
    let overlayMaps = {
      Earthquakes: markerLayer
    };
  
    // Step 4: INITIALIZE THE MAP
    let myMap = L.map("map", {
      center: [40.7, -94.5],
      zoom: 4,
      layers: [street, markerLayer]
    });
  
    // Step 5: Add the Layer Control, Legend, Annotations as needed
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  
  });
  
  