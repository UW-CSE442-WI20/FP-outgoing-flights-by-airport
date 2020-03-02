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
            https://bl.ocks.org/Andrew-Reid/d95e59b71544706515632c4b7fb0402a (3)
*/

var d3 = require('d3');

var width = 1000;
var height = 500;

var svg = d3.select("#map").insert('svg')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g');

// Center the Orthographic map on US
var projection = d3.geoOrthographic().rotate([90, -35, 5]);

var path = d3.geoPath()
    .projection(projection);

// Source (2) used heavily to display orthographic projection of the data
var promises = [
    d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
];

var graticule = d3.geoGraticule();

Promise.all(promises).then(ready);

function ready(data) {

    // Referenced: (3) for creating water fill
    g.append('path')
        .datum({type: "Sphere"})
        .attr("class", "water")
        .attr("d", path);

    g.append('g')
        .append('path')
        .attr('d', path(data[0]))
        //.style("border", "2pix white solid")
        .attr("fill", 'SeaGreen')
      	.attr("stroke", "black");
}