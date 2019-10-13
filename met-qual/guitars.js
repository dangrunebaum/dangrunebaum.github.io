/*USE P5 .CSV  TOOLS TO MAKE NAME COLUMN ON LEFT MARGIN
PLACE GUITARS ICONS ON TIMELINE ACCORDING TO ROW AND YEAR. FOR EACH ROW, IF GIBSON PLACE
GIBSON ICON; IF FENDER PLACE ICON. PLACE ON X AXIS ACCORDING TO YEAR.
FOR EACH ROW, CREATE HOVER EVENT THAT PULLS APPROPRIATE IMAGE FROM URL.
PLACE SONG TITLES.
CREATE HOVER EVENTS THAT PULL SONG SAMPLES FROM SPOTIFY API 
CREATE AXES AND TITLES*/

//declare variables for csv, fender and gibson icons, decade array 
let table;
let fender;
let gibson;
const guitarLocations = [];
const decadeArray = [1940, 1950, 1960, 1970, 1980, 1990, 2000];

//declare spacing variables
let leftMargin = 100;
let topMargin = 200;
let guitarTopMargin = 170;
let graphWidth = 1350;

function preload() {

  //load table 
  myFont = loadFont('AllAgesDemo-2DPX.ttf');
  table = loadTable('guitars.csv', 'csv', 'header');
  //consoleString.log(table);
  //load images  
  fender = loadImage('fender_icon.png');
  gibson = loadImage('les_paul_icon.png');
  fenderLogo = loadImage('fender_logo.png');
  gibsonLogo = loadImage('Gibson_logo.png');
  //gibsonLogo = loadImage();

}

function setup() {
  //basic draw tasks 
  createCanvas(1920, 2400);
  background(0);
  fill(30, 30, 30);
  rect(0, 0, 1920, 200);
  noStroke();
  fill(200, 200, 100);
  textFont(myFont);
  textAlign(CENTER);
  textSize(70);
  textStyle(BOLD);
  fill(210, 145, 169);
  textAlign(LEFT);
  //text("FENDER", 450, 120);
  image(fenderLogo, 520, 15);
  textAlign(CENTER);
  fill(255);
  text("VS", 960, 120);
  fill(183, 132, 67);
  //text("GIBSON", 1290, 120);
  image(gibsonLogo, 1050, 15);
  fill(255);
  textSize(30);
  textStyle(NORMAL);
  text("THE    GREAT    GUITAR    DEBATE", 950, 187);
  textFont("Futura");
  textStyle(ITALIC);
  textSize(24);
  fill(255);
  text("The           /           rivalry defined the sound of rock. \nClick a guitar icon to explore legendary instruments played by rockstars in the Met’s “Play It Loud” exhibition.", 990, 250)
  fill(210, 145, 169);
  text("Fender", 780, 250);
  fill(183, 132, 67);
  text("Gibson", 868, 250);
  fill(255);
  textAlign(LEFT);
  textSize(18);
  textStyle(NORMAL);
  text("Date of Manufacture", leftMargin + 130, topMargin + 120);
  textSize(20);
  text("19             and 28             were played by 37 rockstars.", leftMargin + 975, topMargin + 200);
  text("Number One hits in .", leftMargin + 975, topMargin + 225);
  fill('orange');
  text("orange.", leftMargin + 1157, topMargin + 225);
  fill(210, 145, 169);
  text("Fenders", leftMargin + 1005, topMargin + 200);
  fill(183, 132, 67);
  text("Gibsons", leftMargin + 1150, topMargin + 200);
  fill(255);
  textStyle(24);
  text("   Fenders in vintage               . Gibsons in classic            .", leftMargin + 110, topMargin + 2110);
  fill(210, 145, 169);
  text("shell pink", leftMargin + 300, topMargin + 2110);
  fill(183, 132, 67);
  text("goldtop", leftMargin + 562, topMargin + 2110);
  fill(255);

  //make vertical background lines 
    for (let l = 0; l <= 1700; l += 160) {
      stroke(50);
      line(leftMargin + 150, topMargin + 315 + l, leftMargin + 150 + graphWidth, topMargin + 315 + l);
    } 


//  loop through rock stars for y axis
  for (let r = 0; r < table.getRowCount(); r++) {
    // fill(200, 200, 100);
    textFont("Futura");
    textAlign(RIGHT);
    textSize(20);
    //name in first column 
    text(table.getString(r, 0), leftMargin + 110, topMargin + 200);
    topMargin += 40;
  }

  //loop through decades for x axis and lines  
  for (let t = 0; t < decadeArray.length; t++) {
    textAlign(CENTER);
    text(decadeArray[t], leftMargin + 150, 350);
    stroke(50);
    line(leftMargin + 150, 355, leftMargin + 150, 2250);
    leftMargin += graphWidth / 6;
    text(decadeArray[t], leftMargin - 75, 2270);
  }

  /*loop through dates, for every date depending on if the artist is a Fender
  or Gibson user, place a Fender or Gibson icon on the coresponding year at 
  the corresponding row.*/
  for (let r = 0; r < table.getRowCount(); r++) {
    const yearValue = table.getNum(r, 3);
    const guitarYear = map(yearValue, 1940, 2000, 200, 1450);
    const x = guitarYear + 50;
    const y = guitarTopMargin + 207;
    const imageURL = table.getString(r, 6);
    const songTitle = table.getString(r, 4);
    let description = table.getString(r, 7);
    
    let songID = table.getString(r, 8);
    
    //push new object into array guitarLocations 
    //object contains upper left corner of guitar icon + title + URL for guitar image
    const g = {
      x, y, imageURL, songTitle, description, songID,
      type: table.getString(r, 1),
      title: [table.getString(r, 1),
              table.getString(r, 2), 
              table.getString(r, 3)].join("       ")
    };
    
    
    guitarLocations.push(g);
//    if (songID !== '') console.log(guitarLocations);
    if (table.getString(r, 1) === "Fender") {
      image(fender, x, y);
    } else {
      image(gibson, x, y);
    }
    textAlign(LEFT);
    textStyle(NORMAL);
    stroke(255);
    if (songTitle !== '') {
      if (table.getNum(r, 9) == 1) {
          fill('orange');
          line(x + 105, y + 17, x + 198, y + 17);
          noStroke();
          text(songTitle, x + 205, y + 25);
      }
      else {
          fill(255);
          line(x + 105, y + 17, x + 198, y + 17);
          noStroke();
          text(songTitle, x + 205, y + 25);
      }
  }
    //name next to guitars 
  //text(table.getString(r, 0), x - 250, y + 25);
    textAlign(RIGHT);
    guitarTopMargin += 40;
  }
  
  //console.log(guitarLocations);
}

//loop through song column, draw song titles and lines for each row
//where song exists


function mouseClicked() {
  //see if mouse click occurs on guitar icon 
  const guitarLocation = guitarLocations.find(
    (g) => (mouseX >= g.x && mouseX <= g.x + 100) && (mouseY >= g.y && mouseY <= g.y + 40)
  );

  //open jquery modal confirm window and display title, image and ok button 
  if (guitarLocation)
    $.confirm({
      backgroundDismiss: true,
      boxWidth: '60%', //modal window 30% of screen
      boxHeight: '50%',
      useBootstrap: false,
      title: `<div class="popuptitle">
    <span class="popuptitletext">${guitarLocation.title}</span>
    </div>`,
      //image height fixed at 400px 
      content: makeContent(guitarLocation),
      buttons: {
        close: function () {
          //           $.alert('Confirmed!');
        },
      }
    });
  // prevent default
  return false;
}
// <a class="goright" onclick="playsound()">${guitarLocation.songTitle}</a>
// function playsound (e){
// // 
// $('svg')[0].trigger('click');
// }
function makeContent(guitarLocation) {
  return `<div class="popup">
    <img class="popupimage" 
    style="border-color: ${guitarLocation.type === 'Gibson' ? 'rgb(183, 132, 67)' : 'rgb(210, 145, 169)'}"
    src="${guitarLocation.imageURL}"/>
    <div class="sd">
    ${makeIframe(guitarLocation.songID)}
    <p>${guitarLocation.description}</p>
    </div>
  </div>`
}

function makeIframe(songIDStr) {
  if(songIDStr !== "") {
    return `<iframe src="https://open.spotify.com/embed/track/${songIDStr}" 
    width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
  }
  return "";
}

/*if fender color rockstar text pink, if gibson color gold, if both color blue */