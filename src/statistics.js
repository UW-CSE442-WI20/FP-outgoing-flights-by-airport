var d3 = require('d3');
var queryString = require('query-string');
const parsed = queryString.parse(location.search);
document.getElementById("origin").innerText = parsed.origin;
document.getElementById("dest").innerText = parsed.dest;

const csvData = require('../static/months/jan.csv');
//console.log(parsed);
//const datePattern = /\.*-(\d{01})-\.*/;

// Graph visualization copied from example found at:
// https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


function updateCSV(month) {
  if (month == "January") {
    csvData = require("../static/months/jan.csv");
  } else if (month == "February") {
    csvData = require('../static/months/feb.csv');
  } else if (month == "March") {
    csvData = require('../static/months/march.csv');
  } else if (month == "April") {
    csvData = require('../static/months/april.csv');
  } else if (month == "May") {
    csvData = require('../static/months/may.csv');
  } else if (month == "June") {
    csvData = require('../static/months/june.csv');
  } else if (month == "July") {
    csvData = require('../static/months/july.csv');
  } else if (month == "August") {
    csvData = require('../static/months/august.csv');
  } else if (month == "September") {
    csvData = require('../static/months/sept.csv');
  } else if (month == "October") {
    csvData = require('../static/months/oct.csv');
  } else if (month == "November") {
    csvData = require('../static/months/nov.csv');
  } else {
    csvData = require('../static/months/dec.csv');
  }
}

// Default will be set to january flights, need to change file
// based on selected month
d3.csv(csvData).then(function(data) {
    data.forEach(function(d) {
        d.Origin = d.Origin;
        d.Dest = d.Dest
        d.Date = d.Date
        console.log(d.Date)
        d.Distance = +d.Distance
        d.Count = +d.Count
    });

  const results = data.filter(function (row) {
    return (row.Origin == parsed.origin && row.Dest == parsed.dest) 
  });

    console.log(results);
    x.domain(results.map(function(d) { return d.Date; }));
    y.domain([0, d3.max(results, function(d) { return d.Count; })]);


    // add bars
    svg.selectAll(".bar")
        .data(results)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Date); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Count); })
        .attr("height", function(d) { return height - y(d.Count); })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

    //x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");

    // y axis
    svg.append("g")
        .call(d3.axisLeft(y));

});
// define feagure div for tip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// mouse handle the 
function handleMouseOver(d, i) {
  toolTipMap(`There are ${d.Count} flights in date: ${d.Date}`);
  // Use D3 to select element, change color and size
  d3.select(this).style("opacity", .7);

}

function handleMouseOut(d, i) {
    // Use D3 to select element, change color and size
    //console.log("mouse", this);
    div.transition()
        .duration(500)
        .style("opacity", 0);
    d3.select(this).style("opacity", 1);
}

// mouse click
function toolTipMap(d){
    div.transition()
        .duration(150)
        .style("opacity", .9);
    div.html(d)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}
