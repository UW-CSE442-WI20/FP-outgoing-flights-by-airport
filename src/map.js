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
var d3 = require('d3');
var queryString = require('query-string');

const parsed = queryString.parse(location.search);
const getFile = require('../static/airport_names.csv');

console.log(parsed.airline);

/* Destination airports */
var destinations = Array();
var data1 = Array();
/* Sorted destination airports */
var types = [];
var ID_Name = new Map();

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

function onMapClick(l) {
     d3.csv(airPorts).then(function(data) {
     data.forEach(function(d) {
             d.X = +d.X
             d.Y = +d.Y
             if (l.latlng.lat == d.X && l.latlng.lng == d.Y) {
                 var address = 'main.html?airline=';
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

const csvData = require('../static/2018_grouped_no_dates_with_cords.csv');

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

    var select = d3.select(".dropdown2")
      .append("div")
      .append("select")

    select
      .on("change", function(d) {
        // var address = 'main.html?airline=';
        // var AirPort = d3.select(this).property("value");
        // d3.csv(getFile, function(d){
        //   if (d.AirPort == AirPort) {
        //       return d.AirID;
        // }}).then(v => {
        //     address = address.concat(v);
        //     console.log(address);
        //     window.location.href = address;
        // })
      });

    select.selectAll("option")
      .data(types)
      .enter()
        .append("option")
        .attr("class", "dropdown2")
        .attr("value", function (d) { return d; })
        .text(function (d) { return toProperCase(d); });
});

function draw_data(data){

    data1 = data;

    console.log(data);

    data.forEach(function(d) {
        destinations.push(d.Dest);
        
        L.circle([d.O_lat,d.O_long], {
           color: "red",
           fillColor: "#f03",
           fillOpacity: 0.5,
           radius: 50000,
           Opacity: 0.2
         }).addTo(map);

         L.circle([d.D_lat,d.D_long], {
           color: "blue",
           fillColor: "#f03",
           fillOpacity: 0.1,
           radius: 10000,
           weight: 1
         }).on({
             mouseover: onHover,
             mouseout: offHover
         })
        
        var pointA = new L.LatLng(d.O_lat, d.O_long);
        var pointB = new L.LatLng(d.D_lat, d.D_long);
        var pointList = [pointA, pointB];

        var latlngs = Array()
        latlngs.push(pointA)
        latlngs.push(pointB)

        var polyline = L.polyline(latlngs, {color: 'blue', weight: 1}).addTo(map);
    });
    destinations = distinct_Types(destinations);
}

/*
 Function to draw the airports that are gotten from the airports csv file
 */
 function draw_airports(data){

     console.log(data)

     data.forEach(function(d) {
         L.circle([d.X,d.Y], {
           color: "blue",
           fillColor: "#f03",
           fillOpacity: 0,
           opacity: 0,
           radius: 50000,
           weight: 1
         }).on({
             click: onMapClick,
             dblclick: onMapClick,
             mouseover: onHover,
             mouseout: offHover
         }).addTo(map);

         L.circle([d.X,d.Y], {
           color: "blue",
           fillColor: "#f03",
           fillOpacity: 0.1,
           radius: 1000,
           weight: 1
         }).on('dblclick', onMapClick).addTo(map); 
     });
 }

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

 /* 

 Working on a place to display the hover information

 */
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
    console.log(props)
    console.log(props.lat)
    console.log(props.lng)
    //props.lat
    //props.lng
    temp = data1.filter(function (row) {
        return row.D_lat == props.lat && row.D_long == props.lng
    })
    console.log(temp);
    console.log(temp.Count);
    console.log(temp.Origin);

    this._div.innerHTML = '<h4>Flight Info</h4>' +  (temp ?
         '<b>' + temp.Origin + '</b><br />' + temp.Count + ' people / mi<sup>2</sup>'
         : 'Hover over a destination');
};

 info.addTo(map);



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
    for(var i = 0; i < rows.length; i++) {
      types[i] = ID_Name.get(rows[i]);
    }
    types = [...new Set(types)].sort();
    types.unshift("Please Select an AirPort");
    console.log(types)
    return types;
}

function toProperCase(value) {
    var words = value.split(" ");
    var result = words[0].substring(0, 1).toUpperCase() + words[0].substring(1, words[0].length).toLowerCase(); 
    for (var i = 1; i < words.length; i++) {
      result += " " + words[i].substring(0, 1).toUpperCase() + words[i].substring(1, words[i].length).toLowerCase(); 
    }
    return result;
}

// --------------------------
// DISPLAY SUMMARY INFO BELOW
// --------------------------
const airportID = parsed.airline;

setTimeout(function() {
    document.getElementById("airportName").innerHTML = "<Selected airport>";
    d3.csv(getFile).then(function(data) {
        data.forEach(function(d) {
            d.Airline = d.Airline
            d.AirID = d.AirID
    
            if (d.AirID == airportID) {
                document.getElementById("airportName").innerHTML = d.AirPort;
                console.log(d.AirPort);
            }
        });
    });
    tallyData();
}, 500);

function tallyData() {
    d3.csv(csvData).then(function(data) {
        const map = new Map();
        let totalCount = 0;
        let totalFlightTime = 0.0;
        data.forEach(function(d) {
            if(d.Origin === airportID) {
                // count++;
                // Is 'count' in the CSV the num of flights?
                let count = parseInt(d.Count);
                totalCount += count;

                totalFlightTime += parseFloat(d.Time) * count;

                // tallying counts for each airport
                if (map.has(d.Dest)) {
                    let prev = map.get(d.Dest);
                    map.set(d.Dest, prev + count);
                } else {
                    map.set(d.Dest, count);
                }
            }
        });

        let airportMaxID = "";
        let airportMaxCount = 0;
        map.forEach(function(value, key, map) {
            if(value > airportMaxCount) {
                airportMaxID = key;
                airportMaxCount = value;
            }
        });
        console.log(totalFlightTime);
        console.log(totalCount);
        document.getElementById("airportCount").innerText = map.size;
        document.getElementById("airportMost").innerText = airportMaxID;
        document.getElementById("airportMostNum").innerText = airportMaxCount;
        document.getElementById("numFlights").innerText = totalCount;
        document.getElementById("avgFlightTime").innerText = (totalFlightTime / totalCount).toFixed(2);
    });
}

// --------------------------
