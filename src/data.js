var d3 = require('d3');


const csvData = require('./grouped_origin_dest.csv');

d3.csv(csvData).then(function(data) {
    data.forEach(function(d) {
            d.Origin = d.Origin;
            d.Dest = d.Dest
            d.AVG_Time = +d.AVG_Time
            d.AVG_Distance = +d.AVG_Distance
            d.Count = +d.Count
            //Up down
            d.O_lat = (((+d.O_lat)* -1) + 60) * 12
            //Left right
            d.O_long = (((+d.O_long))   + 120) * 15

            //Up down
            d.D_lat = (((+d.D_lat)* -1) + 60) * 12
            //Left right
            d.D_long = (((+d.D_long))   + 120) * 15

        }
    );
    draw_data(data);
});

function draw_data(data){

    console.log(data);
    d3.selectAll("circle").remove();
    d3.selectAll("line").remove();


    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");
        /*
    var lines = svg.selectAll("line")
        .data(data)
        .enter()
        .append("line")

    var lineAttributes = lines
        .style("stroke", "white")
        .style("stroke-width", 1)
        .attr("x1", function(data) { return data.O_lat})
        .attr("y1", function(data) { return data.O_long})
        .attr("x2", function(data) { return data.D_lat})
        .attr("y2", function(data) { return data.D_long});
    */
    var circleAttributes = circles
        .attr("cy", function (data) { return data.O_lat; })
        .attr("cx", function (data) { return data.O_long; })
        .attr("r", 3 )
        .style("fill", "white");

        

}
