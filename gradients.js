///////////////////////////////////////////////////////////////////////////
/////////////////////// Gradients per Planet or Total /////////////////////
///////////////////////////////////////////////////////////////////////////
function createGradients() {

	//Radial gradient with the center at one end of the circle, as if illuminated from the side
	//A gradient is created for each planet and colored to the temperature of its star
	var gradientContainer = d3.select("#kevin").append("g").attr("class","gradientContainer");

	var gradientRadial = gradientContainer
		.selectAll("radialGradient").data(orbit.nodes()).enter()
		.append("radialGradient")
		.attr("cx", "50%")
		.attr("cy", "50%")
		.attr("r", "50%")
		.attr("fx", "0%")
        .attr("gradientUnits", "objectBoundingBox")
        .attr('id', function(d){return "gradientRadial-"+d.FIELD1})

    gradientRadial.append("stop")
        .attr("class", "stop1")
        .attr("offset", "0%")
        .attr("stop-color", function(d) {return d3.rgb("darkgray").brighter(1);})
        .attr("stop-opacity", "0.2")

    gradientRadial.append("stop")
        .attr("class", "stop2")
        .attr("offset", "60%")
        .attr("stop-color", function(d) {return d3.rgb("darkgray").darker(20);})
        .attr("stop-opacity", "0.5")
        
    gradientRadial.append("stop")
        .attr("class", "stop3")
        .attr("offset",  "100%")
        .attr("stop-color", function(d) {return d3.rgb("darkgray").darker(50);});
        
};

function updateColor(col, field1) {
    d3.select("#gradientRadial-"+field1).selectAll(".stop1").attr("stop-color", function(d) {return d3.rgb(col).brighter(1);});
    d3.select("#gradientRadial-"+field1).selectAll(".stop2").attr("stop-color", function(d) {return d3.rgb(col);});
    d3.select("#gradientRadial-"+field1).selectAll(".stop3").attr("stop-color", function(d) {return d3.rgb(col).darker(1.75);});
}