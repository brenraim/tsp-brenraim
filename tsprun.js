/*
	Brendan Raimann
	3/1/2016
	Script for Traveling Salesman Problem
	Allows for solving with both Nearest Neighbor and Smallest Increase heuristics.
	Version 1.0
*/

$(document).ready( function() {

	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext("2d");
	
	var canvas2 = $("#canvas2").get(0);
	var ctx2 = canvas2.getContext("2d");
	
	//do not put this in the css
	ctx.canvas.width = 500;
	ctx.canvas.height = 400;
	
	ctx2.canvas.width = 500;
	ctx2.canvas.height = 400;
	
	var dotX = [];  //Stores the x coordinates of all points in order
	var dotY = [];	//Stores the y coordinates of all points in order
	
	var order = [0];  //Stores the order of points for the tour to follow in the first canvas
	var order2 = [0];  //Stores the order of points for the tour to follow in the second canvas
	
	/*
		Uses 2 x and 2 y coordinates as parameters
		Returns the distance between these points
	*/
	function distance(x1,x2,y1,y2) {
		return Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
	}

	/*
		Refreshes the page from the cache when clicked
	*/
	$("#button4").one("click", function() {
		location.reload(false);
	});
	
	/*
		Adds a matching set of 1000 random points to the first and second canvas
	*/
	$("#button3").one("click", function() {
		var x;
		var y;
		for (var i = 0; i < 1000; i++)
		{
			x = Math.random() * 500;
			y = Math.random() * 400;
			ctx.beginPath();
			ctx.arc(x, y, 2, 0, 2*Math.PI);
			ctx.stroke();
		
		ctx2.beginPath();
		ctx2.arc(x, y, 2, 0, 2*Math.PI);
		ctx2.stroke();
		
		dotX.push(x);
		dotY.push(y);
		}
	});
	
	/*
		Allows the user to click on the first canvas to place matching points on both canvases
	*/
	$("#canvas").click( function() {
		ctx.beginPath();
		ctx.arc(event.x - canvas.offsetLeft - 1, event.y - canvas.offsetTop - 1, 2, 0, 2*Math.PI);
		ctx.stroke();
		
		ctx2.beginPath();
		ctx2.arc(event.x - canvas.offsetLeft - 1, event.y - canvas.offsetTop - 1, 2, 0, 2*Math.PI);
		ctx2.stroke();
		
		dotX.push(event.x - canvas.offsetLeft - 1);
		dotY.push(event.y - canvas.offsetTop - 1);		
	});
	
	/*
		Allows the user to click on the second canvas to place matching points on both canvases
	*/
	$("#canvas2").click( function() {
		ctx.beginPath();
		ctx.arc(event.x - canvas2.offsetLeft - 1, event.y - canvas2.offsetTop - 1, 2, 0, 2*Math.PI);
		ctx.stroke();
		
		ctx2.beginPath();
		ctx2.arc(event.x - canvas2.offsetLeft - 1, event.y - canvas2.offsetTop - 1, 2, 0, 2*Math.PI);
		ctx2.stroke();
		
		dotX.push(event.x - canvas2.offsetLeft - 1);
		dotY.push(event.y - canvas2.offsetTop - 1);		
	});

	/*
		Solves the first canvas using the Nearest Neighbor heuristic.
		The algorithm traverses through each point placed on the canvas
		By comparing its distance to the points already on the tour, this finds the shortest distance
		The point in then added to the tour directly after its nearest point on the tour
		This order of points is stored in the array, 'order'
			'order' stores indexes for the dotX and dotY arrays in the order for the tour to be drawn
			e.g. If 'order contained the values [1,2,4,3], the tour would go from point 1 to point 2, to point 4, and to point 3.
		
	*/
	$("#button1").click( function() {
		var temp;  //used for storing the current best distance
		var index;	//used for storing the index of the current closest neighbor
		if (dotX.length != 0)
		{
			for (var i = 1; i < dotX.length; i++) //traverses all points
			{
				temp = distance(dotX[i],dotX[order[order.length - 1]],dotY[i],dotY[order[order.length - 1]]); //current point to end of tour
				index = order.length - 1;
				for (var x = 0; x < order.length - 1; x++)  //traverses current tour
				{
					if (distance(dotX[i],dotX[order[x]],dotY[i],dotY[order[x]]) < temp)		//comparing distance to a point on the tour to the current closest neighbor
					{
							temp = distance(dotX[order[x]],dotX[i],dotY[order[x]],dotY[i]);
							index = x;
					}
				}
				order.splice(index + 1,0,i);  //adds the best index to the array
			}
			ctx.strokeStyle = "#55C";	//beginning to draw tour on canvas
			ctx.lineWidth = 2;
			ctx.moveTo(dotX[0],dotY[0]);
			ctx.beginPath();
			for (var y = 0; y < order.length; y++)
			{
				ctx.lineTo(dotX[order[y]],dotY[order[y]]);
			}
			ctx.stroke();
		}
	});
	
	/*
		Solves the first canvas using the Smallest Increase heuristic.
		The algorithm traverses through each point placed on the canvas
		By comparing the effect on the total tour length from joining the tour at different locations,
		the point is added to the tour at the least impactful index.
		This order of points is stored in the array, 'order2'
			'order2' stores indexes for the dotX and dotY arrays in the order for the tour to be drawn
	*/
	$("#button2").click( function() {
		var temp;  //used for storing the current smallest increase in tour length
		var index;	//used for storing the current best index
		if (dotX.length != 0)
		{
			for (var i = 1; i < dotX.length; i++) //traverses all points
			{
				temp = distance(dotX[i],dotX[order2[order2.length - 1]],dotY[i],dotY[order2[order2.length - 1]]); //distance to last spot on tour
				index = order2.length - 1;
				for (var x = 0; x < order2.length - 1; x++)  //traverses current tour
				{
					if (distance(dotX[i],dotX[order2[x]],dotY[i],dotY[order2[x]]) + 				//calculates the new increase in tour length
						distance(dotX[i],dotX[order2[x+1]],dotY[i],dotY[order2[x+1]]) - 			//Takes the two new lines created by the added point and subtracts the old line
						distance(dotX[order2[x]],dotX[order2[x+1]],dotY[order2[x]],dotY[order2[x+1]]) < temp)
					{
							temp = distance(dotX[i],dotX[order2[x]],dotY[i],dotY[order2[x]]) + 		//distance from tour to point
								distance(dotX[i],dotX[order2[x+1]],dotY[i],dotY[order2[x+1]]) - 	//other distance from tour to point
								distance(dotX[order2[x]],dotX[order2[x+1]],dotY[order2[x]],dotY[order2[x+1]]);		//distance between points on tour
							index = x;
					}
				}
				order2.splice(index + 1,0,i);
			}
			ctx2.strokeStyle = "#006600"; //change color of line
			ctx2.lineWidth = 2; //change width of line
			ctx2.moveTo(dotX[0],dotY[0]);
			ctx2.beginPath();
			for (var y = 0; y < order2.length; y++)
			{
				ctx2.lineTo(dotX[order2[y]],dotY[order2[y]]);
			}
			ctx2.stroke();
		}
	});
});