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

var d3 = require('d3');


const csvData = require('../static/grouped_data.csv');

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

    console.log(data);

    data.forEach(function(d) {
        destinations.push(d.Dest);
        //ABQ 35.0433,-106.6129
        //ABY 31.5357,-84.1939
        //BQK 31.2548,-81.4669
        //SFB 28.7794,-81.2357
        L.circle([d.O_lat,d.O_long], 10)
        .addTo(map);
        
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

// Sets values to be displayed on HTML
setTimeout(function() {
    var airportName = parsed.airline;
    document.getElementById("airportName").innerHTML = airportName;

    var numFlights = 0;
    document.getElementById("numFlights").innerText = numFlights;
}, 500);