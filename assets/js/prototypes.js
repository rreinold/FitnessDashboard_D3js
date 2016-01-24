function Goal(){
	// Name of the goal
	this.name = "Default Goal Name";
	// Initial level
	this.initial = "";
	// Goal target
	this.target = "";
	// Current goal status
	this.current = "";
	// Goal units
	this.units = "";
	// array of SVG paths representing icon
	this.icon = [];
	// history of the goal
	this.history = []
}

// Upward Goal extends Goal
// Purpose: Represent a goal in which the target value > initial value

function UpwardGoal(name,initial,target,current){
	this.name = name;
	this.initial = initial;
	this.target = target;
	this.current = current;
}

applyInheritance(UpwardGoal, new Goal);

// 	DownwardGoal extends Goal
//	Purpose: Represent a goal in which the target value < initial value

function DownwardGoal(name,initial,target,current){
	this.name = name;
	this.initial = initial;
	this.target = target;
	this.current = current;
}

applyInheritance(DownwardGoal, new Goal);


// 	Visual
//	Purpose: Represent the data visualization of a goal

function Visual(selection, goal){
	this.selection = selection;
	this.goal = goal;
	this.render = function(){

		var main = selection
			.append("div")
			.style("width","100%")
			.style("height","100%")
			;

		var iconDiv = main
			.append("div")
			.style("width","33%")
			.style("height","100%")
			.style("float","left")
			;

		var valueDiv = main
			.append("div")
			.style("width","67%")
			.style("height","100%")
			.style("float","left")
			;

		iconSvg = iconDiv
			.append("svg")
			.style("width","100%")
			.style("height","100%")
			;

		iconGroup = iconSvg.append("g");

		valueSvg = valueDiv
			.append("svg")
			.style("width","100%")
			.style("height","100%")
			.style("position","relative")
			;

		for (path in goal.icon){
			iconGroup.append("path")
          		.attr("fill","#000000")
          		.attr("d",goal.icon[path])
          		.attr("transform","translate(0,60)");
          		;
      	}

      	 valueSvg
          .append("text")
            
            .text("Current:" + goal.current)

            .attr("dominant-baseline", "central")
            .attr("text-anchor","middle")
            .attr("x","50%")
            .attr("y","50%")
            .style("font-size","35px")
            .style("fill","#FF851B")
            ;
      	return main;
	}
}

//	CurrentOnlyVisual extends Visual
//	Purpose: Represent a visual in which only current 
//	goal status is displayed
function CurrentOnlyVisual(){

}
applyInheritance(CurrentOnlyVisual, new Visual());


//	InitialCurrentAndTargetVisual extends Visual
// 	Purpose: epresent a visual in which all three attributes
//	of a goal are displayed: initial, current, and target.
function InitialCurrentAndTargetVisual(){
}

applyInheritance(InitialCurrentAndTargetVisual, new Visual());





//	Helper method for applying JavaScript prototype inheritance
//	Pass in child class, and an instance of its parent class

function applyInheritance(child, parentInstance){
child.prototype = parentInstance;
child.prototype.constructor = child;
};
