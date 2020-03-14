/*
CSE 442: Data Visualization
Assignment 3: Interactive Visualization
Names:  Anika Padwekar
        Kwing Li
        McKinnon Williams
        Nicole Garakanidze
        Khai Tran
Sources:    https://github.com/UW-CSE442-WI20/A3-accidents-in-the-us (1)
            http://bl.ocks.org/almccon/1bcde7452450c153d8a0684085f249fd (2)
*/
const d3 = require('d3');
const queryString = require('query-string');

const parsed = queryString.parse(location.search);
const getFile = require('../static/airport_names.csv');

//console.log(parsed.airline);

/* Destination airports */
var destinations = Array();
/*                      */
var data1 = Array();
/* Sorted destination airports */
var types = [];
var ID_Name = new Map();
d3.csv(getFile, function(d){
    return {
    type : d.AirPort,
    code : d.AirID
  };
  }).then(function(data) {
    for(var i = 0; i < data.length; i++){
      var id = data[i].code;
      ID_Name.set(id, data[i].type);
    }
  });

// Used leaflet for map display: https://www.d3-graph-gallery.com/graph/backgroundmap_leaflet.html
var map = L
    .map('mapv1')
    // Center on US
    .setView([47.396413, -100.095262], 2.7);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 2  // Prevent ths duplicated display of countries on zoom
    }).addTo(map);

/*
Load in all the airports as circles so we can click
on them and be able to change the display interactively
*/
const airPorts = require('../static/new_temp.csv');

d3.csv(airPorts).then(function(data) {
    data.forEach(function(d) {
            d.Airline = d.Airline;
            d.AirID = d.AirID
            d.X = +d.X
            d.Y = +d.Y
        }
    );
    draw_airports(data);
});

function draw_data(data){

    data.forEach(function(d) {
        destinations.push(d.Dest);
        data1.push(d);

        L.circle([d.O_lat,d.O_long], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 25000,
            Opacity: 0.2
        }).addTo(map);

        L.circle([d.D_lat,d.D_long], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 30000,
            Opacity: 0.2
        }).on({
            mouseover: onHover,
            mouseout: offHover,
            click: onMapClick,
            dblclick: onMapClick
        }).addTo(map).bringToFront();

        let pointA = new L.LatLng(d.O_lat, d.O_long);
        let pointB = new L.LatLng(d.D_lat, d.D_long);

        let latlngs = Array();
        latlngs.push(pointA);
        latlngs.push(pointB);

        L.polyline(latlngs, {color: 'blue', weight: 1}).addTo(map);
    });
    destinations = distinct_Types(destinations);
}


const csvData = require('../static/2018_grouped_no_dates_with_cords.csv');
//-----------
// dropdown list
//-----------
d3.csv(csvData).then(function(data) {
    data.forEach(function(d) {
            d.Origin = d.Origin;
            d.Dest = d.Dest
            d.Time = +d.Time
            d.Distance = +d.Distance
            d.Count = +d.Count

            d.O_lat = +d.O_lat
            d.O_long = +d.O_long
            d.D_lat = +d.D_lat
            d.D_long = +d.D_long
        }
    );

    draw_data(data.filter(function (row) {
        return row.Origin == parsed.airline
    }));
    var select = d3.select(".dropdown1")
      .append("div")
      .append("select")

      select
      .on("change", function(d) {
        let airport = d3.select(this).property("value");
        let address = 'statistics.html?origin=';
        address = address.concat(parsed.airline, '&dest=');

        d3.csv(getFile, function(d){
          if (d.AirPort == airport) {
              return d.AirID;
        }}).then(v => {
            address = address.concat(v);
            if (Array.isArray(v) && v.length) {
                window.location.href = address;
            }
        })
      });


    select.selectAll("option")
        .data(destinations)
        .enter()
        .append("option")
        .attr("class", "dropdown1")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });
});

// --------------------------
// Dropdown list for airPort
// --------------------------

d3.csv(getFile, function(d){
    return {
    type : d.AirPort,
    code : d.AirID
  };
  }).then(function(data) {
    for(var i = 0; i < data.length; i++){
      var id = data[i].code;
      ID_Name.set(id, data[i].type);
    }
  });

function distinct_Types(rows) {
  types = [];
  for(var i = 0; i < rows.length; i++) {
    types[i] = ID_Name.get(rows[i]);
  }
  types = [...new Set(types)].sort();
  types.unshift("Please Select an AirPort");
  //console.log(types)
  return types;
}

// --------------------------
// Drawing Functions Below
// --------------------------
function draw_data(data){

    data.forEach(function(d) {
        destinations.push(d.Dest);
        data1.push(d);

        L.circle([d.O_lat,d.O_long], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 25000,
            Opacity: 0.2
        }).addTo(map);

        L.circle([d.D_lat,d.D_long], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0,
            radius: 30000,
            opacity: 0.2
        }).on({
            mouseover: onHover,
            mouseout: offHover,
            click: onMapClick,
            dblclick: onMapClick
        }).addTo(map).bringToFront();

        let pointA = new L.LatLng(d.O_lat, d.O_long);
        let pointB = new L.LatLng(d.D_lat, d.D_long);

        let latlngs = Array();
        latlngs.push(pointA);
        latlngs.push(pointB);

        L.polyline(latlngs, {color: 'blue', weight: 1}).addTo(map);
    });
    destinations = distinct_Types(destinations);
}


/*
Function to draw the airports that are gotten from the airports csv file
*/
function draw_airports(data){

    data.forEach(function(d) {
        L.circle([d.X,d.Y], {
            fillOpacity: 0,
            opacity: 0,
            radius: 25000
        }).on({
            click: onMapClick,
            dblclick: onMapClick
        }).addTo(map);

        L.circle([d.X,d.Y], {
            color: "blue",
            fillColor: "#f03",
            fillOpacity: 0,
            radius: 1000,
            weight: 1
        }).on('dblclick', onMapClick).addTo(map);
    });
}

// --------------------------
// Map Interactions Below
// --------------------------
function onMapClick(l) {
    d3.csv(airPorts).then(function(data) {
        data.forEach(function(d) {
                d.X = +d.X
                d.Y = +d.Y
                if (l.latlng.lat == d.X && l.latlng.lng == d.Y) {
                    let address = 'main.html?airline=';
                    address = address.concat(d.AirID);
                    window.location.href = address;
                }
            }
        )});
}

function onHover(l) {
    info.update(l.latlng);
}

function offHover(l) {
    info.update();
}

// --------------------------
// Map Instruction Pane Below
// --------------------------
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML +=
            '<p>Click or double click <br> on an airport to change the <br> departure city to that one</p>';

    return div;
};

legend.addTo(map);


// --------------------------
// Hover Piece Below
// --------------------------
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

    if (props == null){
        this._div.innerHTML = '<h4>Flight Info</h4>' + 'Hover over a destination'
        return
    }
    let closest_point = data1[0];
    let min_distance = 10000000000000000;
    data1.forEach(function (d) {
        let latlngs = Array();
        latlngs.push(d.D_lat);
        latlngs.push(d.D_long);
        if (props.distanceTo(latlngs) < min_distance){
            min_distance = props.distanceTo(latlngs);
            closest_point = d;
        }
    });

    this._div.innerHTML = '<h4>Flight Info</h4>' +  (props ?
        '<b>' + "Airport: " + closest_point.Dest + '</b><br />' + closest_point.Count + ' flights' + '</b><br />' +
        closest_point.Time.toFixed(0) + ' minutes' + '</b><br />' + closest_point.Distance.toFixed(0) + ' miles'
        : 'Hover over a destination');
};

info.addTo(map);

// --------------------------
// DISPLAY SUMMARY INFO BELOW
// --------------------------
const airportID = parsed.airline;

setTimeout(function() {
    document.getElementById("airportName").innerHTML = ID_Name.get(airportID);
    tallyData();
}, 500);

function tallyData() {
    d3.csv(csvData).then(function(data) {
        // map holds, key: dest airport, value: num of flights to key airport
        const map = new Map();
        let totalCount = 0;
        let totalFlightTime = 0.0;

        // finding all flights where origin is selected airport
        data.forEach(function(d) {
            if(d.Origin === airportID) {
                // incrementing total count by the flight count
                let count = parseInt(d.Count);
                totalCount += count;

                // incrementing total flight time by the flight time and num of flights
                totalFlightTime += parseFloat(d.Time) * count;

                // tallying counts for each dest airport
                if (map.has(d.Dest)) {
                    let prev = map.get(d.Dest);
                    map.set(d.Dest, prev + count);
                } else {
                    map.set(d.Dest, count);
                }
            }
        });

        // finding dest airport with most flights from origin
        let airportMaxID = "";
        let airportMaxCount = 0;
        map.forEach(function(value, key, map) {
            if(value > airportMaxCount) {
                airportMaxID = ID_Name.get(key);
                airportMaxCount = value;
            }
        });

        // updating values to display on html
        document.getElementById("airportCount").innerText = map.size;
        document.getElementById("airportMost").innerText = airportMaxID;
        document.getElementById("airportMostNum").innerText = airportMaxCount;
        document.getElementById("numFlights").innerText = totalCount;
        document.getElementById("avgFlightTime").innerText = (totalFlightTime / totalCount).toFixed(2);
    });
}
