//set topic category variable 
var currentCat = 0;
//set dot fill color 
var ellipseColor;
//set up canvas, set to window size 
function setup() {

  createCanvas(windowWidth, windowHeight);

  //loop through the videoDatatwo array of objects and get xpoints and ypoints
  for (var i = 0; i < videoDatatwo.length; i++) {

    videoDatatwo[i].xpoint = map(videoDatatwo[i].Reach, 0, 47674, 150, width - 400);
    videoDatatwo[i].ypoint = map(videoDatatwo[i].Views, 0, 9248, height - 150, 150);

  }

}

colorObject = [
  { "topic": "Culture", "color": "#e41a1c" },
  { "topic": "Economy", "color": "#377eb8" },
  { "topic": "Imperial", "color": "#4daf4a" },
  { "topic": "Nature", "color": "#984ea3" },
  { "topic": "Politics", "color": "#ff7f00" },
  { "topic": "Scitech", "color": "#00e6e6" },
  { "topic": "Society", "color": "#a65628" },
  { "topic": "Sports", "color": "#f781bf" },
  { "topic": "Weather", "color": "#66ff1a" },
];

function draw() {
  background(255, 255, 255);
  //if statement in main draw loop so it only draws for the current category
  for (var i = 0; i < videoDatatwo.length; i++) if (currentCat == 0 || currentCat == videoDatatwo[i].Topic) {
    for (var f = 0; f < colorObject.length; f++) if (videoDatatwo[i].Topic == colorObject[f].topic) {
      ellipseColor = colorObject[f].color;
      fill(ellipseColor);
      noStroke();
      ellipse(videoDatatwo[i].xpoint, videoDatatwo[i].ypoint, 12, 12);
    }
  }

  //draw header text 
  fill(80, 80, 80);
  // textStyle('bold');
  textFont('Avenir');
  textSize(40);
  text("NIPPON TV NEWS24 FACEBOOK VIDEOS: PERFORMANCE BY TOPIC", 160, 60);
  textSize(20);
  textStyle(NORMAL);
  fill('#D42D26');
  text("227 Q1 2019 videos, represented by Reach and Views, filtered by Topic", 160, 80);
  textStyle(ITALIC);
  textSize(18);
  fill('SteelBlue');
  text("Click for video", 160, 152);


  //draw key ellipses
  //loop through color object, assign color to ellipse based on iterator position 
  for (c = 0; c < colorObject.length; c++) {
    ellipseFill = colorObject[c].color;
    let xPos = c * 140 + 150;
    fill(ellipseFill);
    ellipse(xPos, height - 35, 20, 20);
  }

  //draw key text
  //loop through topic array 
  fill(80, 80, 80);
  textStyle(NORMAL);
  for (t = 0; t < colorObject.length; t++) {
    const topicText = colorObject[t].topic;
    let tPos = t * 140 + 170;
    textStyle(NORMAL);
    textFont('Avenir');
    textSize(20);
    text(topicText, tPos, height - 23);
  }

  //draw axis labels 
  textSize(25);
  text("Reach", width / 2 - 100, height - 55);
  text("Views", 60, height / 2);
  textSize(20);

  //check for rollovers
  var mouseHit = false;

  for (var j = 0; j < videoDatatwo.length; j++) {
    if (currentCat == 0 || currentCat == videoDatatwo[j].Topic) {
      var MouseYes1 = dist(videoDatatwo[j].xpoint, videoDatatwo[j].ypoint, mouseX, mouseY);

      if (MouseYes1 < 8) {
        mouseHit = true

        tellMeSomething(videoDatatwo[j].Message);

        //make ellipse bigger on mouseHit
        for (d = 0; d < colorObject.length; d++) if (videoDatatwo[j].Topic == colorObject[d].topic) {
          mouseoverColor = colorObject[d].color;
          fill(mouseoverColor);
          ellipse(videoDatatwo[j].xpoint, videoDatatwo[j].ypoint, 20, 20);

        }

      }
    }
    //If the distance is equal to the size of the ellipse then change the cursor
    if (mouseHit) {
      cursor(HAND);

    } else {
      cursor(ARROW);

    }
  }
  //axis function
  makeAxis();
  textAlign(LEFT, BOTTOM);
}

function makeAxis() {

  //draw xaxis and yaxis
  strokeWeight(2);
  stroke(80, 80, 80);
  line(150, height - 100, width - 400, height - 100);
  line(150, 150, 150, height - 100);

  //draw xaxis values
  noStroke();
  for (var x = 0; x <= 50000; x += 10000) {
    var xvalues = x;
    var xvalue = map(xvalues, 0, 50000, 150, width - 400);
    textAlign(CENTER, CENTER);
    textSize(14);
    fill(80, 80, 80);
    text(xvalues, xvalue, height - 90);
  }

  //draw yaxis values 
  for (var y = 0; y <= 15000; y += 5000) {
    var yvalues = y;
    var yvalue = map(yvalues, 0, 15000, height - 100, 150);
    textAlign(RIGHT, CENTER);
    textSize(14);
    fill(80, 80, 80);
    text(yvalues, 140, yvalue);
  }
}

//handle clicks from p5
function mouseClicked() {
  //find dots on canvas that match click 
  for (var j = 0; j < videoDatatwo.length; j++) {
    //limit search to current category 
    if (currentCat == 0 || currentCat == videoDatatwo[j].Topic) {
      if (dist(videoDatatwo[j].xpoint, videoDatatwo[j].ypoint, mouseX, mouseY) < 8) {
        //open video permalink in new tab 
        var win = window.open(videoDatatwo[j].Permalink, "_blank");
        win.focus();//actually go to new tab 
        break;//stop searching for matching click 
      }
    }
  }
}

function tellMeSomething(myMessage) {
  var infoBox = document.getElementById("inputResults");
  infoBox.innerHTML = myMessage;
}

$(document).ready(function () {
  $('#select-menu').change(function () {
    var selectedGroup = $('#select-menu').val();
    currentCat = selectedGroup
    // console.log(selectedGroup)

  });
});
