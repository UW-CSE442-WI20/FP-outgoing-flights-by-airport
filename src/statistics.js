var d3 = require('d3');

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

const csvData = require('../static/grouped_data.csv');
d3.csv(csvData).then(function(data) {
    data.forEach(function(d) {
        d.Origin = d.Origin;
        d.Dest = d.Dest
        d.Time = +d.Time
        d.Distance = +d.Distance
        d.Count = +d.Count    
    });
    
  const results = data.filter(function (row) {
    return (row.Origin == 'SEA' && row.Dest == 'ORD')
  });

  console.log(results);
  x.domain(results.map(function(d) { return d.Time; }));
  y.domain([0, d3.max(results, function(d) { return d.Count; })]);
  

  // add bars
  svg.selectAll(".bar")
      .data(results)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Time); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.Count); })
      .attr("height", function(d) { return height - y(d.Count); });

  //x axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // y axis
  svg.append("g")
      .call(d3.axisLeft(y));

});