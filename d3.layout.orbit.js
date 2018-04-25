
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

	svg.attr("width", x).attr("height", y);
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

//Create SVG
var svg = d3.select("#planetarium").append("svg")
	.attr("width", x)
    .attr("height", y);

//Create a container for everything with the centre in the middle
var container = svg.append("g").attr("class","container")
					.attr("transform", "translate(" + x/2 + "," + y/2 + ")")


///////////////////////////////////////////////////////////////////////////
//////////////////////////// Explanation Texts ////////////////////////////
///////////////////////////////////////////////////////////////////////////
//Intro Text Wrapper
var introText = svg.append("g").attr("class", "introWrapper");
					//.attr("transform", "translate(" + -x/2 + "," + -y/2 + ")");
//Title
var Title = introText.append("text")
	.attr("class", "title")
	.attr("x", 10 + "px")
	.attr("y", 10 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 1)
	.text("EXOPLANETS");

//Intro text
var TextIntro = introText.append("text")
	.attr("class", "intro")
	.attr("x", 10 + "px")
	.attr("y", 40 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 1)
	.text("Since the definitive discovery of the first exoplanet in 1992 "+
		  "more than 1800 exoplanets have been found. Depending on circumstances and method of discovery " +
		  "we might know enough of the exoplanet to simulate its orbit. " +
		  "Here you can see 288 exoplanets from exoplanets.org for which we know the eccentricity and " +
		  "semi-major axis of the orbit, radius of the planet and (effective) temperature of the star which it orbits");
	//.call(wrap, 300);


//The explanation text during the introduction
var TextTop = container.append("text")
	.attr("class", "explanation")
	.attr("x", 0 + "px")
	.attr("y", -70 + "px")
	.attr("dy", "1em")
	.style("fill","white")
	.attr("opacity", 0)
	.text("");

//Create the legend
//createLegend();

//Initiate the progress Circle
var arc = d3.svg.arc()
	.innerRadius(10)
	.outerRadius(12);
progressCircle(8);

///////////////////////////////////////////////////////////////////////////
//////////////////////// Set up pointer events ////////////////////////////
///////////////////////////////////////////////////////////////////////////
//Reload page
d3.select("#reset").on("click", function(e) {location.reload();});

//Show information
d3.select("#info").on("click", showInfo);

//Remove info
d3.select("#infoClose").on("click", closeInfo);

//Skip intro
d3.select("#remove")
	.on("click", function(e) {

		//Remove all non needed text
		d3.select(".introWrapper").transition().style("opacity", 0);
		d3.select("#start").transition().style("opacity", 0);
		d3.select(".explanation").transition().style("opacity", 0);
		d3.select(".progressWrapper").transition().style("opacity", 0);

		//Make skip intro less visible, since now it doesn't work any more
		d3.select("#remove")
			.transition().duration(1000)
			.style("pointer-events", "none")
			.style("opacity",0.3);

		//Legend visible
		d3.select(".legendContainer").transition().style("opacity", 1);
		//Bring all planets back
		dim(delayTime = 0);
		bringBack(opacity = planetOpacity, delayTime=1);

		//Reset any event listeners
		resetEvents();
	});


///////////////////////////////////////////////////////////////////////////
////////////////////// Start introductions steps //////////////////////////
///////////////////////////////////////////////////////////////////////////

//Start introduction
d3.select("#start")
	.on("click", Draw0);

var counter = 1;
//Order of steps when clicking button
d3.select(".progressWrapper")
	.on("click", function(e){

		if(counter == 1) Draw1();
		else if(counter == 2) Draw2();
		else if(counter == 3) Draw3();
		else if(counter == 4) Draw4();
		else if(counter == 5) Draw5();
		else if(counter == 6) Draw6();

		counter = counter + 1;
	});

///////////////////////////////////////////////////////////////////////////
//////////////////////// Storytelling steps ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function Draw0(){

	stopTooltip = true;

	//Make other buttons invisible as to not distract
	d3.select("#start").transition().duration(1000).style("opacity", 0);
	//Remove button
	setTimeout(function() {
		d3.select("#start")
			.style("visibility","hidden");
		}, 1200);


	//Make legend invisible as to not distract
	d3.select(".legendContainer").transition().duration(1000).style("opacity", 0);
	d3.select(".introWrapper").transition().duration(1000).style("opacity", 0);

	//Remove event listeners during examples
	removeEvents();

	//Start
	startCircle(time = 29);

	changeText("Let me introduce you to this chaos of exoplanets that orbit many " +
			   "different stars in our Milky Way",
				delayDisappear = 0, delayAppear = 1);
	//Dim all planets
	dim(delayTime=0);

	//Highlight the biggest planet
	highlight(235, delayTime=8);

	changeText("Here we have WASP-12 b, one of the biggest planets in our dataset. " +
			   "Its radius is more than 20x bigger than Earth",
				delayDisappear = 7, delayAppear = 8);


	changeText("As comparison, here we have Kepler-68 c, which is about the same size as Earth. " +
			   "It's so small in comparison to the rest that you can barely see it",
				delayDisappear = 16, delayAppear = 17);

	//Highlight an Earth like chosen planet
	highlight(215, delayTime=17);

	changeText("As a note, although the sizes of the planet are scaled, and the orbits are scaled, " +
			   "they are not scaled to each other. Otherwise most planets would become smaller than " +
			   "a pixel if I keep them on these orbits. ",
				delayDisappear = 27, delayAppear = 28);

}//function Draw0

//Scaling radii
function Draw1() {

	startCircle(time = 5);

	changeText("Scaling the planetary radii to the orbits would give you this result. " +
			   "(The star in the center was already scaled to our Sun)",
				delayDisappear = 0, delayAppear = 3);

	//Dim all planets
	dim(delayTime = 0);
	//Bring all planets back
	bringBack(opacity = planetOpacity, delayTime = 1);

	d3.selectAll(".planet")
		.transition().delay(700 * 2).duration(2000)
		.attr("r", function(d) {
			var newRadius = radiusJupiter/au*3000*d.Radius;
			if  (newRadius < 1) {return 0;}
			else {return newRadius;}
		});

}//function Draw1

//Radius of orbit
function Draw2() {

	startCircle(time = 26);

	//Dim all planets again
	dim(delayTime = 0);
	//Make planets bigger again
	d3.selectAll(".planet")
		.transition().delay(700 * 1).duration(1500)
		.attr("r", function(d) {return radiusSizer * d.Radius;});

	//Highlight the biggest planet
	highlight(235, delayTime=4);
	changeText("Let's get back to WASP-12 b. The distance to the star it orbits is only 2% of the distance " +
			   "between the Earth and the Sun",
				delayDisappear = 0, delayAppear = 3);

	changeText("The distance between the Earth and the Sun is 150 million kilometers " +
			   "and is called an Astronomical Unit, or 'au'. Thus the distance of WASP-12 b to its star is 0.02 au",
				delayDisappear = 12, delayAppear = 13);

	changeText("This is extremely close. Even Mercury, the planet closest to our Sun, is stil 0.3 au away, which " +
			   "would not fit on most regular screen sizes ",
				delayDisappear = 24, delayAppear = 25);
}//Draw2

//Orbital period
function Draw3(){
	startCircle(time = 18);

	changeText("The planets you see here are quite different from Earth because of more reasons. " +
			   "The average time it takes these 288 planets to go around their star is only 17 Earth days! ",
				delayDisappear = 0, delayAppear = 1);

	changeText("WASP-12 b goes around in just 26 hours",
				delayDisappear = 11, delayAppear = 12);

	//Highlight an Earth like chosen planet
	highlight(215, delayTime=16);
	changeText("and Kepler-68 c in almost 10 days",
				delayDisappear = 16, delayAppear = 17);

}//Draw3


//Elliptical orbits - Circles
function Draw4(){

	//Start progress button
	startCircle(time = 22);

	changeText("Both of the planets highlighted now are on very circular orbits. " +
			   "However, this is not always the case",
				delayDisappear = 0, delayAppear = 1);

	changeText("Most orbits are shaped more like stretched out circles: ellipses. " +
			   "The 'eccentricity' describes how round or how stretched out an ellipse is",
				delayDisappear = 10, delayAppear = 11);

	changeText("If the eccentricity is close to 0, the ellipse is more like a circle, " +
			   "like our planets here. However, if the eccentricity is close to 1, " +
			   "the ellipse is long and skinny",
				delayDisappear = 20, delayAppear = 21);

}//Draw4

//Elliptical orbits
function Draw5() {

	//Start progress button
	startCircle(time = 10);

	changeText("Here we have Kepler-75 b, which is already on a very stretched orbit. " +
			   "Its eccentricity is 0.57",
				delayDisappear = 1, delayAppear = 2, xloc=200, yloc = -24*1);

	//Dim all planets again
	dim(delayTime = 0);

	//Highlight elliptical orbit
	highlight(237, delayTime=2);

	changeText("Let me speed things up a bit. Do you see that the planet is moving faster " +
			   "when it is close to the star? If you want to know why that happens, " +
			   "please look up Kepler's 2nd law",
				delayDisappear = 8, delayAppear = 9, xloc=200, yloc = -24*2);


	setTimeout(function() {speedUp = 50;}, 700*8);

}//Draw5

//Colour of the planet
function Draw6() {

	//Return planets to original speed
	speedUp = 400;

	//Start progress button
	startCircle(time = 33);

	//Dim all planets again
	dim(delayTime = 0);

	//Bring all planets back
	bringBack(opacity = 0.3, delayTime = 1);

	changeText("Wondering about the color of the planets? They are colored according to " +
			   "the approximate color of the star around which they orbit",
				delayDisappear = 0, delayAppear = 1);

	changeText("Depending on the mass of a star, its temperature is different and therefore " +
			   "the color in which we see it",
				delayDisappear = 8, delayAppear = 9);

	changeText("You can hover over the legend in the bottom right to highlight only planets " +
			  "that rotate around similar stars",
				delayDisappear = 16, delayAppear = 17);

	//Make legend invisible as to not distract
	d3.select(".legendContainer").transition().delay(17 * 700).duration(2000).style("opacity", 1);
	//Replace Legend events
	d3.selectAll('.legend')
		.on("mouseover", classSelect(0.04))
		.on("mouseout", classSelect(planetOpacity));

	changeText("I'll admit, this coloring might be a bit confusing, since now they seem like little stars " +
			   "orbiting our Sun",
				delayDisappear = 24, delayAppear = 25);


	changeText("However, seeing that we've come to the end of the introduction, I'll let you " +
			   "decide what you like best...",
				delayDisappear = 32, delayAppear = 33);

	d3.select(".progressWrapper")
			.transition().delay(700 * 35).duration(1000)
			.style("opacity", 0);

	d3.select("#crazy")
		.style("visibility","visible")
		.style("left", (x/2 - 112/2 + 6) + "px")
		.style("top", (y/2 - 100) + "px")
		.transition().delay(700 * 35).duration(1000)
		.style("opacity", 1);

}//Draw6








///////////////////////////////////////////////////////////////////////////
//////////////////////////// Progress circle //////////////////////////////
///////////////////////////////////////////////////////////////////////////

function progressCircle(time) {
//Create a small icon that starts when an animation is going on
var progressWrapper = container.append("g")
		.attr("class", "progressWrapper")
		.attr("transform", "translate(0,-220)")
		.style("pointer-events", "none");

//Circle in the back so the whole thing becomes clickable
var backCircle =  progressWrapper.append("circle")
	.attr("r", 12)
	.style("opacity", 0.01);

//Create the play button
var play =  progressWrapper.append("path")
	.attr("class", "play")
	.attr("d", d3.svg.symbol().type("triangle-up").size(35))
	.style("fill","#3B3B3B")
	.attr("transform", "translate(1,0) rotate(90)")
	.style("opacity", 0);

/*
//Create pause icon
var pause = container.selectAll(".pause")
				.data([-5,2])
				.enter()
				.append("rect")
				.attr("transform", "translate(0,-200)")
				.attr("x", function (d) {console.log(d); return d;})
				.attr("y",  -5)
				.attr("width", 3)
				.attr("height", 10)
				.style("fill", "white");
*/

/*
//The circle, already created in main script
var arc = d3.svg.arc()
	.innerRadius(10)
	.outerRadius(12);
*/

//Create the arc around the play button
var progress = progressWrapper.append("path")
	.datum({startAngle: 0,endAngle: 2*Math.PI})
	.attr("class", "playCircle")
	.style("fill", "white")
	.style("opacity", 0)
	.attr("d", arc);

};

function startCircle(time) {

	//Stop click event
	d3.select(".progressWrapper")
		.style("pointer-events", "none");

	//Dim the play button
	d3.selectAll(".play")
		.transition().delay(0).duration(500)
		.style("opacity", 1)
		.style("fill","#3B3B3B")
		.transition().delay(700 * time)
		.style("fill","white")
		;

	//Run the circle and at the end
	d3.selectAll(".playCircle")
		.style("opacity", 1)
		.transition().duration(700 * time).ease("linear")
		.attrTween("d", function(d) {
		   var i = d3.interpolate(d.startAngle, d.endAngle);
		   return function(t) {
				d.endAngle = i(t);
				return arc(d);
		   }//return
		})
		.call(endall, function() {
			d3.select(".progressWrapper")
				.style("pointer-events", "auto");
		});
};