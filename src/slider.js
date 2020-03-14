// Referenced: https://bl.ocks.org/henryjameslau/8eec50d0091898d2eb64c85c50194609

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
"November", "December"];
var month = "January";
// Step
 var sliderStep = d3
   .sliderRight()
   .min(0)
   .max(10)
   .step(1)
   .width(300)
   .height(200)
   .tickFormat(function(d, i) {
       return months[i];
   })
   .ticks(11)
   .default(0)
   .handle(d3.symbol().type(d3.symbolCircle).size(200))
   .on('onchange', val => {
     d3.select('g.value-step').text(months[val]);
     document.getElementById("value-step").value=months[val];
     window.updateData(months[val]);
   });

 var gStep = d3
   .select('div#slider-simple')
   .append('svg')
   .attr('width', 500)
   .attr('height', 1000)
   .append('g')
   .attr('transform', 'translate(30,30)');

 gStep.call(sliderStep);
