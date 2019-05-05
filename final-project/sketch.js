// * Make videoDatatwo array, save as .js file
// * Embed external JS page in html page
// * Declare a global variable in the HTML page before you embed that page
// * Loop through video objects,  create arrays for xpoints (“Reach”) and ypoints (“Views”), map onto canvas width and height
// * Create arrays for "Message" and "Topic"
// * Create color array
// * Draw ellipses
// * Draw x and y axes
// also good to do bar graph showing average reach for each topic 

//first, set up canvas

var currentCat = 0;

function setup() {
   
    createCanvas(windowWidth, windowHeight);
// //create background
   background(250,250,250);

   for(var i = 0; i < videoDatatwo.length; i++) {

   videoDatatwo[i].xpoint = map(videoDatatwo[i].Reach, 0, 47674, 150,width-100);
   videoDatatwo[i].ypoint = map(videoDatatwo[i].Views, 0, 9248, height-150, 100);

}

}

function draw() 
{
  background(250,250,250);
for(var i = 0; i < videoDatatwo.length; i++) if(currentCat == 0 || currentCat == videoDatatwo[i].Topic) {

 {
  
//loop through the videoDatatwo array of objects and get video Message and Topic, xpoints and ypoints
// message = "Message"
// topic = "Topic"
// xpoints = "Reach"
// ypoints = "Views"
//xpoints and ypoints are the mapped values on the screen for each reach and view number
    
    // var message = videoDatatwo[i].Message;
    // var topic = videoDatatwo[i].Topic;
    // var xpoint = map(videoDatatwo[i].Reach, 0, 47674, 150,width-100);
    // var ypoint = map(videoDatatwo[i].Views, 0, 9248, height-150, 100);
        
        //if statement in main draw loop so it only draws for the current category
        
//set one color for each topic
if (videoDatatwo[i].Topic == 'Culture') {
              fill('Maroon');
            } else if (videoDatatwo[i].Topic == 'Weather') {
              fill('Red');
            } else if (videoDatatwo[i].Topic == 'Imperial') {
              fill('Orange');
            } else if (videoDatatwo[i].Topic == 'Society') {
              fill('Yellow');
            } else if (videoDatatwo[i].Topic == 'Nature') {
              fill('Lime'); 
            } else if (videoDatatwo[i].Topic == 'Sports') {
              fill('Green');
            } else if (videoDatatwo[i].Topic == 'Scitech') {
              fill('Blue');
            } else if (videoDatatwo[i].Topic == 'Economy') {
              fill('Turquoise');
            } else fill ('Magenta');

//draw ellipses
          noStroke();
          ellipse(videoDatatwo[i].xpoint, videoDatatwo[i].ypoint,8,8);
}
}

// you needed to end your loop here
// all of these things just need to be drawn once
//draw header text 
//  noStroke();
  fill(80,80,80);
  textStyle('bold');
  textFont('Arial');
  textSize(40);
  text("NIPPON TV NEWS24 FACEBOOK VIDEOS: PERFORMANCE BY TOPIC",160,50);
  textSize(20);
  textStyle(NORMAL);
  text("227 videos posted Jan-March 2019, represented by Reach and Views",160,80);
  textStyle(ITALIC);
  textSize(18);
  fill('SteelBlue');
  text("Hover to see video headline", 160, 150);

  //draw key ellipses
  fill('Maroon');
  ellipse(150, height-30, 20, 20);
  fill('Turquoise');
  ellipse(300, height-30, 20, 20);
  fill('Orange');
  ellipse(450, height-30, 20, 20);
  fill('Lime');
  ellipse(600, height-30, 20, 20);
  fill('Magenta');
  ellipse(750, height-30, 20, 20);
  fill('Blue');
  ellipse(900, height-30, 20, 20);
  fill('Yellow');
  ellipse(1050, height-30, 20, 20);
  fill('Green');
  ellipse(1200, height-30, 20, 20);
  fill ('Red');
  ellipse(1350, height-30, 20, 20);

  //draw key text
  fill(80,80,80);
  textStyle(NORMAL);
  textFont('Arial');
  textSize(20);
  text("Culture",170,height-22);
  text("Economy",320,height-22);
  text("Imperial",470,height-22);
  text("Nature",620,height-22);
  text("Politics",770,height-22);
  text("Scitech",920,height-22);
  text("Society",1070,height-22);
  text("Sports",1220,height-22);
  text("Weather",1370,height-22);

  // draw axis labels 
  textSize(25);
  text("Reach", width/2, height-70);
  text("Views", 60, height/2);
  textSize(20);
  text("47674", width-150, height-75);
  text("14385", 75, 120);


// here is your next loop, where you check for rollovers
var mouseHit = false;
for(var j = 0; j < videoDatatwo.length; j++) {
    var MouseYes1 = dist(videoDatatwo[j].xpoint,videoDatatwo[j].ypoint, mouseX, mouseY);
  //If the distance is equal to the size of the ellipse then change the cursor
  if(MouseYes1 < 6) {
          mouseHit = true
          tellMeSomething(videoDatatwo[j].Message);
          // fill(0,0,0);
          // ellipse(videoDatatwo[i].xpoint, videoDatatwo[i].ypoint,8,8);
          // you can redraw the… of the thing you hit, make it light up or be bigger here
    } else {
      //cursor(ARROW)
    }
   // tellMeSomething();
  }
  if (mouseHit) {
            cursor(HAND);

  } else {
  cursor(ARROW);
  

 //axis function
  makeAxis();

}

function makeAxis() {
  // textAlign(LEFT);
  // fill(75,75,75);
    
    //draw xaxis
    fill(80,80,80);
    strokeWeight(2);
    stroke(100,100,100)
    line(150,height-100,width-100,height-100);
    //draw yaxis
    line(150,100,150,height-100);
   
}

function tellMeSomething(myMessage) {
   var infoBox = document.getElementById("inputResults");
 infoBox.innerHTML = myMessage;
}

$(document).ready(function () {
      $('#select-menu').change(function () {
    var selectedGroup = $('#select-menu').val();
   currentCat =  selectedGroup
   console.log(selectedGroup)
   


  });
  });
};