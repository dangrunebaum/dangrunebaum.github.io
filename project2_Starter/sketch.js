//!!!!!!!!TW0 GLOBAL ARRAYS
  //Here we are setting up an array for holding the objects
//There will be one object per country
  var arrayOfObjects = [];
  //an array of Years -- use this for your mean line
  var arrayOfYears = [];

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable("eduindex2.csv", "csv");
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}
function setup() {
 
   
    createCanvas(windowWidth, windowHeight);
 
//Here is an array for countries (by rownumber)
var rowArray = [36,78,79,129,181];
//the loop below loops through the five rows and sets up an object for each country
//the object includes the countries name and three arrays: xpoints, ypoints, and yvalues
//these are parallel arrays with one value for each year
//xpoints and ypoints are the actual mapped values on the screen for each year
//yvalues are the original yvalues (not mapped to the screen) it is useful checking for zero values
     for (var i = 0; i < rowArray.length; i++) {
       //setting up the Object values
       var countryObject = new Object;
       countryObject.countryName = table.getString(rowArray[i], 1);
       countryObject.xpoints = [];
       countryObject.ypoints = [];
       countryObject.yvalues = [];

       //looping through the columns to push the proper values into the arrays
        for (var c = 2; c < table.getColumnCount(); c++) {
          var theYear = Number(table.getString(0, c))
          var Yvalue = Number(table.getString(rowArray[i], c))
           countryObject.xpoints.push(map(theYear,1990,2017,150,width-50));
           countryObject.ypoints.push(map(Yvalue,0,1,height-50,50));
           countryObject.yvalues.push(Yvalue);
         // this line loads the years into the arrayOfYears 
          if (i==0) arrayOfYears.push(theYear);

        }
        //once the inner loop is done, the object for that country is pushed into the arrayOfObjects for later use
    	arrayOfObjects.push(countryObject)

     }
     
//simple drawing stuff
 background(0);
        noFill();
       
 //I put the drawing of the axis into a separate function
  makeAxis();
//I also put the drawing of the points and lines in a separate function
makeCountryTimeLines();
  
  //THIS IS THE FUNCTION YOU HAVE TO MAKE!
  makeMeanLine();
}

// function draw() {
 //DON'T DO ANYTHING IN DRAW!!! 
// }

function makeCountryTimeLines() {
  //this loops through each country object
  //var colorArray = [“red”, “turquoise”, “lime”, “yellow”, “magenta”];
	for(var i=0; i < arrayOfObjects.length;i++) {
              if (i == 0) {
              stroke('crimson');
            } else if (i == 1) {
              stroke('deepskyblue');
            } else if (i == 2) {
              stroke('lime');
            } else if (i == 3) {
              stroke('yellow');
            } else stroke ('magenta');
       beginShape();
       startYpoint = 0;
    	var countryName = arrayOfObjects[i].countryName;

       //then it loops through the values in the object's arrays ypoints, xpoints, yvalues
       for(var j=0; j < arrayOfObjects[i].ypoints.length;j++) {
			 var Xpoint = arrayOfObjects[i].xpoints[j];
			 var Ypoint = arrayOfObjects[i].ypoints[j];
			 var Yval = arrayOfObjects[i].yvalues[j];
	        //this is the same code for drawing the dots and curves between dots
    	    //it only draws if the Yval is above zero
		     if (Yval > 0) {
		     // draw the dot

                ellipse(Xpoint,Ypoint,8,8);
            // draw the curve vertex
            // this is statement is detecting if you're at the first or last point
            // curveVertex() you need to write the start point and the end point twice.
        		if(startYpoint === 0) {
					startYpoint = 1;

          textFont('Avenir');
				  text(countryName,Xpoint-60,Ypoint)
				  curveVertex(Xpoint,Ypoint);
				  curveVertex(Xpoint,Ypoint);
				} else if (j == arrayOfObjects[i].ypoints.length - 1) { // this is the last point
				  curveVertex(Xpoint,Ypoint);
				  curveVertex(Xpoint,Ypoint);
				  } else {
				  curveVertex(Xpoint,Ypoint);
				}
         }
  
       }
       endShape();
       // this ends the curveVertex for this country
       // the loop will start again with the next country
       
       
   }
}

//THIS IS WHERE YOU DO EVERYTHING!!!!
//THERE IS NO WORKING CODE IN HERE
//YOU NEED TO CREATE THE WORKING CODE
function makeMeanLine() {
// //   //INSTRUCTIONS
// //   //IN THIS CODE -- LOOP THROUGH THE arrayOfYears
// //   //THAT IS THE FIRST LOOP YOU SHOULD WRITE
// //   //FOR EACH YEAR LOOP THROUGH THE THE Array of OBJECTS 
// //   //AND GET THE CORRESPONDING YPOINT AND YVALUES 
// //   //THE TRICK IS PUT THE i and j for the inner and outer loop in the right place...
// //   //add up the ypoints and divide by the number of countries
// //   //then use the same drawing code from the makeCountryTimeLines() function
// //   //make sure your line is a different color!
// //     //remember to check for 0 values and minus (decrement) the number of countries each time
// //     // // //but only do that when you have everything else working..
     //   fill('orange');
        stroke('orange');
        beginShape();
        startYpoint = 0;
    
    // get mean ypoints 
    for(i=0;i<arrayOfYears.length;i++) {
      var totalYpoints = 0;
      for(j=0;j<arrayOfObjects.length;j++) {
           totalYpoints += arrayOfObjects[j].ypoints[i];
           }
      var  meanYpoint= totalYpoints / 5;

      //loop through the values in the object arrays' xpoints
       var Xpoint = arrayOfObjects[1].xpoints[i];

          //this is the same code for drawing the dots and curves between dots
          //it only draws if the Yval is above zero
         if (meanYpoint > 0) {
         // draw the dot
                   fill('orange'); 
                   ellipse(Xpoint,meanYpoint,8,8);
                   noFill();
            // draw the curve vertex
            // this is statement is detecting if you're at the first or last point
            // curveVertex() you need to write the start point and the end point twice.
            if(startYpoint === 0) {
          startYpoint = 1;

          text("Mean",Xpoint-60,meanYpoint)
          curveVertex(Xpoint,meanYpoint);
          curveVertex(Xpoint,meanYpoint);
        } else if (j == arrayOfYears.length - 2) { // this is the last point
          curveVertex(Xpoint,meanYpoint);
          curveVertex(Xpoint,meanYpoint);
          } else {
          curveVertex(Xpoint,meanYpoint);
          }
         }
        }
      
       endShape();
       // this ends the curveVertex for this country
       // the loop will start again with the next country
       
       
   }



function makeAxis() {
  textAlign(LEFT)
  fill(0,255,255)
  textFont('DIN alternate');
  textSize(24);
     text("UN Human Development Reports Education Index: 5 Most Populous Countries",30,30)
    
    //draw xaxis
    stroke(0,255,255)
    line(150,height-50,width-50,height-50);
    //draw yaxis
    stroke(0,255,255)
    line(150,50,150,height-50);
    //yaxis vaules
    for(var i = 0; i < 1.1; i += 0.2) {
      //rounding is here because of floating point issue
      var rounded = Math.round( i * 10 ) / 10;
      yvalue = map(rounded,0,1,height-50,50);
      textAlign(RIGHT,CENTER)
      textSize(12);
      text(rounded,140,yvalue);
      line(145,yvalue,155,yvalue);
    }
    //xaxis values
     for (var c = 2; c < table.getColumnCount(); c++) {
       //number() is here, though might not need
       var myYear = Number(table.getString(0, c))
     console.log(myYear);
       var xvalue = map(myYear,1990,2017,150,width-50)
      // console.log(table.columns[c]);
       textAlign(CENTER,BOTTOM);
       fill(0,255,255);
       textSize(12);
       text(myYear,xvalue,height-30);
       line(xvalue,height-55,xvalue,height-45);
       noFill()
       
     }
}