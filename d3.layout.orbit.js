
d3.layout.orbit = function() {
	var currentTickStep = 0;
	var orbitNodes;
	var orbitSize = [1,1];
	var nestedNodes;
	var flattenedNodes = [];
	var tickRadianStep = 0.004363323129985824;
    var orbitDispatch = d3.dispatch('tick');
    var tickInterval;
    var childrenAccessor = function(d) {return d.children};
    var tickRadianFunction = function() {return 1};
	var orbitRadius = function() {return 1};
	var maxOrbitalPeriod = 0;
	var minOrbitalPeriod = 999999999;
	var maxPlanetTemp = 0;
	var minPlanetTemp = 999999999;
	var maxPlanetRadius = 0;
	var minPlanetRadius = 999999999;
	var maxDistance = 0;
	var minDistance = 999999999;
	var maxDiscoveryYear = 0;
	var minDiscoveryYear = 999999999;
	var maxPlanetsperSystem = 0;
	var minPlanetsperSystem = 999999999;

	// returns instance of _orbitLayout
	// useful to change layout of this instance from another file
	// not used in this project
	function _orbitLayout() {
		return _orbitLayout;
	}
	

	// function to power the animation
	_orbitLayout.start = function() {
		tickInterval = setInterval(
			function() {
			currentTickStep++; // increment which tick we're on
			flattenedNodes.forEach(function(_node){ // for each planet
				if (_node.parent) { // if this planet has a parent (so it's not the center point)
					// animate it spinning around the parent
					// calculate the new x and y to draw the planet
					_node.x = _node.parent.x + ( orbitRadius(_node) * Math.sin( _node.angle + (currentTickStep * tickRadianStep * tickRadianFunction(_node))) );
					_node.y = _node.parent.y + ( orbitRadius(_node) * Math.cos( _node.angle + (currentTickStep * tickRadianStep * tickRadianFunction(_node))) );
				}
			})
			orbitDispatch.tick(); // send a message to the html to redraw the planets
		}, 
		1);
	
	}

	// function to stop the spinning
	_orbitLayout.stop = function() {
		clearInterval(tickInterval);
	}

	// accessors for various data features
	_orbitLayout.minOrbitalPeriod = function() {
		return minOrbitalPeriod;
	}
	_orbitLayout.maxOrbitalPeriod = function(){
		return maxOrbitalPeriod;
	}
	_orbitLayout.minPlanetTemp = function() {
		return minPlanetTemp;
	}
	_orbitLayout.maxPlanetTemp = function(){
		return maxPlanetTemp;
	}
	_orbitLayout.minPlanetRadius = function() {
		return minPlanetRadius;
	}
	_orbitLayout.maxPlanetRadius = function(){
		return maxPlanetRadius;
	}
	_orbitLayout.minDistance = function() {
		return minDistance;
	}
	_orbitLayout.maxDistance = function(){
		return maxDistance;
	}
	_orbitLayout.minDiscoveryYear = function() {
		return minDiscoveryYear;
	}
	_orbitLayout.maxDiscoveryYear = function(){
		return maxDiscoveryYear;
	}
	_orbitLayout.minPlanetsperSystem = function() {
		return minPlanetsperSystem;
	}
	_orbitLayout.maxPlanetsperSystem  = function(){
		return maxPlanetsperSystem;
	}

	// can be used to adjust the speed of all the points
	_orbitLayout.speed = function(_degrees) {
		if (!arguments.length) return tickRadianStep / (Math.PI / 360);
		tickRadianStep = tickRadianStep = _degrees * (Math.PI / 360);
		return this;
	}

	// function to set the size of the visualization
	_orbitLayout.size = function(_value) {
		if (!arguments.length) return orbitSize;
		orbitSize = _value;
		return this;
	}

	// function to set the speed of the orbits
	_orbitLayout.revolution = function(_function) {
		if (!arguments.length) return tickRadianFunction;
		tickRadianFunction = _function;
		return this
	}

	// function to set the orbit Radius of the planets
	_orbitLayout.totallyrad = function(_function) {
		if (!arguments.length) return orbitRadius;
		orbitRadius = _function;
		return this
	}

	// function to transform the original data by calling calculateNodes
	_orbitLayout.nodes = function(_data) {
    	if (!arguments.length) return flattenedNodes;
		nestedNodes = _data;
		// find children and transform the data
    	calculateNodes();
		return this;
	}

	// function to set the function used to calculate how many children nodes there are
	_orbitLayout.children = function(_function) {
    	if (!arguments.length) return childrenAccessor;
    	childrenAccessor = _function;
    	return this;
	}

	// used to send new locations to html on tick to be redrawn
	d3.rebind(_orbitLayout, orbitDispatch, "on");
	
	// return the instance of the orbit class to the html
	return _orbitLayout;

	function calculateNodes() {
		var _data = nestedNodes; 
		//If you have an array of elements, then create a root node (center)
		orbitNodes = {key: "Earth", values: _data}
		orbitNodes.x = orbitSize[0] / 2; // finds the center of the visualization
		orbitNodes.y = orbitSize[1] / 2; // finds the center of the visualization
		orbitNodes.depth = 0; // the root node (the center) has depth 0
		orbitNodes.planet_temp = 252;
		orbitNodes.light_years = 0;
		orbitNodes.pl_pnum = 8;

		// add this data with a new center as the key to flattenedNodes
		flattenedNodes.push(orbitNodes);

		// sends this data to traverseNestedData
		traverseNestedData(orbitNodes);

		// for each child of the current object, we will add the starting position to be drawn,
		// the identity of the parent, and the depth of 1 for each
		function traverseNestedData(_node) {
			if(childrenAccessor(_node)) { // if there are children of this data (i.e. planets, moons)
				var totalChildren = childrenAccessor(_node).length; // how many children
				// for each child
				for (var x = 0; x<totalChildren;x++) {
					// set the random starting point
					childrenAccessor(_node)[x].angle = Math.random()*360;
					// set the parent of this child
					childrenAccessor(_node)[x].parent = _node;
					// set the depth of this child to be 1
					childrenAccessor(_node)[x].depth = 1;
					// add this planet to the flattenedNodes so it can be animated orbiting it's parent
					flattenedNodes.push(childrenAccessor(_node)[x]);
					if(+childrenAccessor(_node)[x].pl_pnum > maxPlanetsperSystem && childrenAccessor(_node)[x].pl_pnum != "NA"){
						maxPlanetsperSystem = +childrenAccessor(_node)[x].pl_pnum;
					}
					if(+childrenAccessor(_node)[x].pl_pnum < minPlanetsperSystem){
						minPlanetsperSystem = +childrenAccessor(_node)[x].pl_pnum;
					}
					if(+childrenAccessor(_node)[x].orbital_period > maxOrbitalPeriod && childrenAccessor(_node)[x].orbital_period != "NA"){
						maxOrbitalPeriod = +childrenAccessor(_node)[x].orbital_period;
					}
					if(+childrenAccessor(_node)[x].orbital_period < minOrbitalPeriod){
						minOrbitalPeriod = +childrenAccessor(_node)[x].orbital_period;
					}
					if(+childrenAccessor(_node)[x].planet_temp > maxPlanetTemp && childrenAccessor(_node)[x].planet_temp != "NA"){
						maxPlanetTemp = +childrenAccessor(_node)[x].planet_temp;
					}
					if(+childrenAccessor(_node)[x].planet_temp < minPlanetTemp){
						minPlanetTemp = +childrenAccessor(_node)[x].planet_temp;
					}
					if(+childrenAccessor(_node)[x].radius > maxPlanetRadius && childrenAccessor(_node)[x].radius != "NA"){
						maxPlanetRadius = +childrenAccessor(_node)[x].radius;
					}
					if(+childrenAccessor(_node)[x].radius < minPlanetRadius){
						minPlanetRadius = +childrenAccessor(_node)[x].radius;
					}
					if(+childrenAccessor(_node)[x].light_years > maxDistance && childrenAccessor(_node)[x].light_years != "NA"){
						maxDistance = +childrenAccessor(_node)[x].light_years;
					}
					if(+childrenAccessor(_node)[x].light_years < minDistance){
						minDistance = +childrenAccessor(_node)[x].light_years;
					}
					if(+childrenAccessor(_node)[x].discovery_year > maxDiscoveryYear && childrenAccessor(_node)[x].discovery_year != "NA"){
						maxDiscoveryYear = +childrenAccessor(_node)[x].discovery_year;
					}
					if(+childrenAccessor(_node)[x].discovery_year < minDiscoveryYear){
						minDiscoveryYear = +childrenAccessor(_node)[x].discovery_year;
					}

				}

			}
		}

	}

}


// code below this line taken from
// https://github.com/nbremer/


//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrap(text, width) {
	var text = d3.select(this[0][0]),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.4, // ems
		y = text.attr("y"),
		x = text.attr("x"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
};



//Outline taken from http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
function updateWindow(){
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50;
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

	svg2.attr("width", x).attr("height", y);
	d3.selectAll(".container").attr("transform", "translate(" + x/2 + "," + y/2 + ")");
	d3.selectAll(".legendContainer").attr("transform", "translate(" + 30 + "," + (y - 90) + ")");
	d3.select("#crazy").style("left", (x/2 - 112/2 + 6) + "px").style("top", (y/2 - 100) + "px");
	//d3.selectAll(".introWrapper").attr("transform", "translate(" + -x/2 + "," + -y/2 + ")");
}//updateWindow

var
	w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50,
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

window.onresize = updateWindow;


///////////////////////////////////////////////////////////////////////////
//////////////////////////// Explanation Texts ////////////////////////////
///////////////////////////////////////////////////////////////////////////


//The explanation text during the introduction
var TextTop = d3.select("#richturd").append("text")
	.attr("class", "explanation")
	.attr("x", 0 + "px")
	.attr("y", -70 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 0)
	.text("");

//Create the legend
//createLegend();



//Change the text during introduction
function changeText (newText, delayDisappear, delayAppear, xloc, yloc, finalText) {

	//If finalText is not provided, it is not the last text of the Draw step
	if(typeof(finalText)==='undefined') finalText = false;

	if(typeof(xloc)==='undefined') xloc = 0;
	if(typeof(yloc)==='undefined') yloc = -200;

	TextTop
		//Current text disappear
		.transition().delay(700 * delayDisappear).duration(700)
		.attr('opacity', 0)
		//New text appear
		.call(endall,  function() {
			TextTop.text(newText)
			.attr("y", yloc + "px")
			.attr("x", xloc + "px")
			.call(wrap, 300)
			;
		})
		.transition().delay(700 * delayAppear).duration(700)
		.attr('opacity', 1)
		;
}// function changeTopText

///////////////////////////////////////////////////////////////////////////
//////////////////////// Storytelling steps ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function Draw0(){

	//stopTooltip = true;

	//Make other buttons invisible as to not distract
	//d3.select("#start").transition().duration(1000).style("opacity", 0);
	//Remove button
	//setTimeout(function() {
	//	d3.select("#start")
	//		.style("visibility","hidden");
	//	}, 1200);


	//Make legend invisible as to not distract
	//d3.select(".legendContainer").transition().duration(1000).style("opacity", 0);
	//d3.select(".introWrapper").transition().duration(1000).style("opacity", 0);

	//Remove event listeners during examples
	//removeEvents();

	//Start
	changeText("Let me introduce you to this chaos of exoplanets that orbit many " +
			   "different stars in our Milky Way",
				delayDisappear = 0, delayAppear = 1);


	changeText("Here we have WASP-12 b, one of the biggest planets in our dataset. " +
			   "Its radius is more than 20x bigger than Earth",
				delayDisappear = 7, delayAppear = 8);


	changeText("As comparison, here we have Kepler-68 c, which is about the same size as Earth. " +
			   "It's so small in comparison to the rest that you can barely see it",
				delayDisappear = 16, delayAppear = 17);

	changeText("As a note, although the sizes of the planet are scaled, and the orbits are scaled, " +
			   "they are not scaled to each other. Otherwise most planets would become smaller than " +
			   "a pixel if I keep them on these orbits. ",
				delayDisappear = 27, delayAppear = 28);

	changeText("Scaling the planetary radii to the orbits would give you this result. " +
			   "(The star in the center was already scaled to our Sun)",
				delayDisappear = 0, delayAppear = 3);
	changeText("Let's get back to WASP-12 b. The distance to the star it orbits is only 2% of the distance " +
			   "between the Earth and the Sun",
				delayDisappear = 0, delayAppear = 3);

	changeText("The distance between the Earth and the Sun is 150 million kilometers " +
			   "and is called an Astronomical Unit, or 'au'. Thus the distance of WASP-12 b to its star is 0.02 au",
				delayDisappear = 12, delayAppear = 13);

	changeText("This is extremely close. Even Mercury, the planet closest to our Sun, is stil 0.3 au away, which " +
			   "would not fit on most regular screen sizes ",
				delayDisappear = 24, delayAppear = 25);
}
