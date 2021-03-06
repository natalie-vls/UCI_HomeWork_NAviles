// Query URL for "Earthqukes from the Past 7 Days"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Pull data
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
}); 

// Create function for features
function createFeatures(earthquakeDataFeatures){
    function onEachFeature(feature, circle) {
        if (feature.properties.place && feature.properties.time && feature.properties.mag && feature.geometry.coordinates[1] && feature.geometry.coordinates[0] && feature.geometry.coordinates[2] !== null) {            
            circle.bindPopup("<h3>" + feature.properties.place + "<h3><p>" +
            feature.properties.mag + " magnitudes</p><p>" + feature.geometry.coordinates[2] +
            " depth</p><p>" + new Date(feature.properties.time) + "</p>");   
        }      
    }    
    function radiusMag(mag) { 
        return mag * 25000;
    }

// Create function for color scale
    function circleColor(depth) {

        if (depth  < -10) {
            return "#33ff33"
        }
        else if (depth < 10) {
            return "#ccff66"
        }
        else if (depth < 30) {
            return "#ffff4d"
        }
        else if (depth < 50) {
            return "#ffcc00"
        }
        else if (depth < 70) {
            return "#ff9900"
        }
        else if (depth < 90) {
            return "#ff0000"
        }
    }

// Create geoJSON layer
    var earthquakes = L.geoJSON(earthquakeDataFeatures, {
        pointToLayer: function(earthquakeDataFeatures, latlng) {
            return L.circle(latlng, {
                radius: radiusMag(earthquakeDataFeatures.properties.mag),
                color: circleColor(earthquakeDataFeatures.geometry.coordinates[2]),
                fillColor: circleColor(earthquakeDataFeatures.geometry.coordinates[2]),
                fillOpacity: 0.7
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);

// Start mapping process
    function createMap(earthquakes) {
        
        var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
        });

        var baseMaps = {
            "Street Map": streetmap
        };

        var overlayMaps = {
            Earthquakes: earthquakes
        };

        var map = L.map("map", {
            center: [32.7767, -96.7970],
            zoom: 4,
            layers: [streetmap, earthquakes]
        });

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(map);

        function getColor(c) {
            return  c > 90 ? "#33ff33":
                    c > 70 ? "#ccff66":
                    c > 50 ? "#ffff4d":
                    c > 30 ? "#ffcc00":
                    c > 10 ? "#ff9900":
                            "#ff0000";
        }


// Create legend
        var legend = L.control({position: "bottomright"});

        legend.onAdd = function(map) {
            var div = L.DomUtil.create("div", "info legend");
            var mags = [-10, 10, 30, 50, 70, 90];
            var labels = [];
            for (var i = 0; i < mags.length; i++) {
                div.innerHTML +=
                '<i style="background:' + getColor(mags[i] + 1) + '"></i>' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
            }
            return div;
        };
        legend.addTo(map);
    }
}