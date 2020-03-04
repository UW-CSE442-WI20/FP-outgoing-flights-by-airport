

// You can require libraries
const d3 = require('d3');
const getFile = require('../static/airports.csv');
let sqldata = [];
let dataSet = sqldata;
/*// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


// Anything you put in the static folder will be available
// over the network, e.g.*/
var types = [];
d3.csv(getFile, function(d){
    return {
      type : d.AirPort
    };
}).then(function(data) {
    //console.log('Dynamically loaded CSV data', data);
    var ap = distinct_Types(data);
    var select = d3.select(".dropdown")
      .append("div")
      .append("select")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        alert(value);
      });

    select.selectAll("option")
      .data(ap)
      .enter()
        .append("option")
        .attr("class", "dropdown")
        .attr("value", function (d) { return d; })
        .text(function (d) { return toProperCase(d); });
  });
function toProperCase(value) {
  var words = value.split(" ");
  var result = words[0].substring(0, 1).toUpperCase() + words[0].substring(1, words[0].length).toLowerCase(); 
  for (var i = 1; i < words.length; i++) {
    result += " " + words[i].substring(0, 1).toUpperCase() + words[i].substring(1, words[i].length).toLowerCase(); 
  }
  return result;
}
// distint and sort the data
function distinct_Types(rows) {
  for(var i = 0; i < rows.length; i++) {
    types[i] = rows[i].type;
  }
  types = [...new Set(types)].sort();
  types.unshift("Please Select an AirPort");
  return types;
}

