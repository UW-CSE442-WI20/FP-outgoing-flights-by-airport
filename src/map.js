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
console.log(parsed.airline);


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


const csvData = require('./grouped_origin_dest.csv');

d3.csv(csvData).then(function(data) {
    data.forEach(function(d) {
            d.Origin = d.Origin;
            d.Dest = d.Dest
            d.AVG_Time = +d.AVG_Time
            d.AVG_Distance = +d.AVG_Distance
            d.Count = +d.Count
        
            d.O_lat = +d.O_lat
            d.O_long = +d.O_long
            d.D_lat = +d.D_lat
            d.D_long = +d.D_long
            
            //Need to update the data to remove the wrong sets that point to 0,0
            if (d.Origin == 'SFB') {
                d.O_lat = 28.7794
                d.O_long = -81.2357
            }
            if (d.Dest == 'SFB') {
                d.D_lat = 28.7794
                d.D_long = -81.2357
            }
            

        }
    );
    //draw_data(data)
    //change this to take in a value from the page where you choose the index
    draw_data(data.filter(function (row) {
        return row.Origin == parsed.airline
    }));
});

function draw_data(data){

    console.log(data);

    data.forEach(function(d) {

        L.circle([d.O_lat,d.O_long], 10).addTo(map);
        
        var pointA = new L.LatLng(d.O_lat, d.O_long);
        var pointB = new L.LatLng(d.D_lat, d.D_long);
        var pointList = [pointA, pointB];

        var latlngs = Array()
        latlngs.push(pointA)
        latlngs.push(pointB)

        var polyline = L.polyline(latlngs, {color: 'blue', weight: 1}).addTo(map);
    });

}

