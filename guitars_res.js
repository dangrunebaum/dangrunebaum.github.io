/*USE P5 .CSV  TOOLS TO MAKE NAME COLUMN ON LEFT MARGIN
PLACE GUITARS ICONS ON TIMELINE ACCORDING TO ROW AND YEAR. FOR EACH ROW, IF GIBSON PLACE
GIBSON ICON; IF FENDER PLACE ICON. PLACE ON X AXIS ACCORDING TO YEAR.
FOR EACH ROW, CREATE HOVER EVENT THAT PULLS APPROPRIATE IMAGE FROM URL.
PLACE SONG TITLES.
CREATE HOVER EVENTS THAT PULL SONG SAMPLES FROM SPOTIFY API 
CREATE AXES AND TITLES
CREATE NEW ELEMENT CONTAINING 2 SOUND SAMPLES AND WAVE FORM CANVASES*/

//declare variables for graph, csv, fender and gibson icons, guitarLocations and decade arrays 
//graph sound;
const guitarTopMargin = 410;
let samples;
let playSoundBrand = null;
let table;
let fender;
let gibson;
let guitarLocations = [];
const pClass = "showPick";
const lineClass = "showLineHighlight";
let guitarLineHighlighted = null;
let highlight = null;

//current value of filter selection
let filterSelection = $("#select-menu").val();
$("#select-menu").on("change",
  () => {
    filterSelection = $("#select-menu").val();
    clear();
    guitarLocations = [];
    setupAux();
  })
//filter function  
function toDisplay(g) {

  if (filterSelection === "All") return true;
  let [value, field] = filterSelection.split(",");
  return g[field] === value;

}
// let fenderColor = (162, 224, 184);
// let lpColor = (183, 132, 67);
let numberOneIcon;

//declare spacing variables
let leftMargin = 150;
const topMargin = 200;
//let graphWidth = 1350;

//set guitar category variable 
// var currentCat = table.getString(r, 9);

function preload() {
  //load font and table 
  myFont = loadFont('font/AllAgesDemo-2DPX.ttf');
  table = loadTable('data/guitars.csv', 'csv', 'header');
  // consoleString.log(table);
  //load images  
  fender = loadImage('images/fender_icon_green.png');
  gibson = loadImage('images/gibson_icon.png');
  fenderLogo = loadImage('images/Fender_logo_green.png');
  gibsonLogo = loadImage('images/Gibson_logo.png');
  numberOneIcon = loadImage('images/oneicon.png');
  fenderStrat = loadImage('images/fender_strat.png');
  gibsonLP = loadImage('images/gibson_lp.jpg');

  //create data structure for samples
  samples = {
    fender: {
      fft: null,
      top: 0,
      left: 800,
      sound: loadSound('sound/fender_sample.mp3')
    },
    gibson: {
      fft: null,
      top: 0,
      left: 800,
      sound: loadSound('sound/gibson_sample.mp3')
    }
  }
}

function setup() {

  createCanvas(windowWidth, 4000);
  samples.fender.fft = new p5.FFT();
  samples.fender.sound.amp(0.2);
  samples.gibson.fft = new p5.FFT();
  samples.gibson.sound.amp(0.2);

  setupAux();
  $('#select-menu').show(); // delay showing this select until now, i.e. after some of page rendered. .show is method of jquery select
}

function setupAux() {
   // construct an array of guitar location objects that carry all the attributes for display 
   for (let r = 0, y = guitarTopMargin; r < table.getRowCount(); r++) {
    const yearValue = table.getNum(r, 3);
    const guitarYear = map(yearValue, 1940, 2000, 150, width - 300);
    const x = Math.round(guitarYear);

    const imageURL = table.getString(r, 6);
    let description = table.getString(r, 7);

    let songID = table.getString(r, 8);


    //object contains upper left corner of guitar icon + other attributes for a single artist line
    const g = {
      x, y, imageURL, description, songID,
      type: table.getString(r, 1),
      title: [table.getString(r, 1),
      table.getString(r, 2),
      table.getString(r, 3)].join("       "),
      numberOne: table.getString(r, 9),
      category: table.getString(r, 10),
      artist: table.getString(r, 0),
      songTitle: table.getString(r, 4)
    };
    if (toDisplay(g)) {
      // push new object into array guitarLocations
      guitarLocations.push(g);
      y += 40; // next guitar line to be drawn 40px below current line
    }

  }
  background(0);
  // image(fenderLogo, (width / 2) - 450, 15);
  // image(gibsonLogo, (width / 2) + 130, 15);
  //title images and text
  //noStroke();
  //fill(200, 200, 100);
  // textFont(myFont);
  // textSize(70);
  // textStyle(BOLD);
 // fill(162, 224, 184);
  // textAlign(CENTER);
  // fill(255);
  // text("VS", width / 2, 120);
 // fill(183, 132, 67);
 
  // fill(255);
  // textSize(30);
  // textStyle(NORMAL);
  // text("THE    GREAT    GUITAR    DEBATE", width / 2, 210);
}
function oldSetupAuxDrawCommands() {
  // background(0);

  // //title images and text
  noStroke();
  fill(200, 200, 100);
  textFont(myFont);
  textSize(70);
  textStyle(BOLD);
  fill(162, 224, 184);
  image(fenderLogo, (width / 2) - 450, 15);
  textAlign(CENTER);
  fill(255);
  text("VS", width / 2, 120);
  fill(183, 132, 67);
  image(gibsonLogo, (width / 2) + 130, 15);
  fill(255);
  textSize(30);
  textStyle(NORMAL);
  text("THE    GREAT    GUITAR    DEBATE", width / 2, 210);

  //text and images for sound comparison 
  textSize(50);
  text("FENDER  VS  GIBSON      SOUND  AND  WAVE  FORM  COMPARISON", width / 2, 2505);
  textSize(20);
  textFont("Futura");
  textAlign(LEFT);
  text("Fender's bright attack vs Gibson's warm \nsustain divides many rockstars into camps,\nthough some use both brands. \n \nConventional wisdom holds that Gibson's set \nneck transfers the resonance between neck \nand body better than Fender's bolt-on neck. \nThe result is said to be more warmth and \nsustain in the set-neck guitar, and more twang \nin the bolt-on guitar. \n \nTest the conventional wisdom by comparing \nthe wave forms of a Fender Stratocaster and \nGibson Les Paul, both strummed in open E. \n \nThe wave form analyzer shows amplitude \n(volume) over time in red, and frequency (pitch), \nfrom the lowest to highest that humans can hear, \nin blue. \n \nLook for a higher frequency profile in the \nFender and longer amplitude envelope in the \nGibson.", 1150, 2665);
  textSize(24);
  textStyle(ITALIC);
  textAlign(CENTER);
  text("Test a Fender Stratocaster against a Gibson Les Paul", width / 2, 2570);
  textStyle(NORMAL);
  textAlign(LEFT);
  textSize(14);
  text("Click guitar strings for on/off", 210, 2642);
  image(fenderStrat, 200, 2675);
  image(gibsonLP, 180, 2925);

  //subtitle and other accompanying text 
  textFont("Futura");
  textStyle(ITALIC);
  textSize(24);
  textAlign(CENTER);
  noStroke();
  fill(255);
  text("The Fender/Gibson rivalry defined the sound of rockstars in the \nMetropolitan Museum of Art's \"Play It Loud\" exhibition. Click a guitar to explore.", width / 2, topMargin + 60);
  // fill(162, 224, 184);
  // text("Fender", width / 2 - 440, topMargin + 70);
  // fill(183, 132, 67);
  // text("Gibson", width / 2 - 350, topMargin + 70);
  fill(255);
  textAlign(LEFT);
  textSize(14);
  textStyle(NORMAL);
  text("Date of Manufacture", 130, topMargin + 175);
  textSize(20);
  // let [fCount, gCount, lineCount] = guitarCounts();
  // text(`19             and 28             were played by ${lineCount} rockstars.`, width - 700, topMargin + 275);
  // fill(183, 132, 67);
  // text("Gibsons", width - 525, topMargin + 275);
  // fill(162, 224, 184);
  // text("Fenders", width - 672, topMargin + 275);
  // text("Number One hits in       .", leftMargin + 975, topMargin + 225);
  // fill('cyan');
  // text("blue", leftMargin + 1157, topMargin + 225);
  fill(255);
  text("   Fenders in vintage               .  Gibsons in classic            .", 130, topMargin + 2150);
  fill(162, 224, 184);
  text("surf green", 316, topMargin + 2150);
  fill(183, 132, 67);
  text("goldtop", 588, topMargin + 2150);

  //legend for sound samples 
  fill(221, 105, 103);
  rect(798, topMargin + 2670, 20, 20);
  fill(102, 219, 251);
  rect(798, topMargin + 2710, 20, 20);
  fill(255);
  text("Amplitude", 830, topMargin + 2687);
  text("Frequency", 830, topMargin + 2727);

  //loop through decades for x axis and lines
    for (var t = 1940; t <= 2000; t += 10) {
    var tvalues = t;
    var tvalue = map(tvalues, 1940, 2000, 150, width - 300);
    fill(255);
    textAlign(CENTER);
    noStroke();
    text(tvalues, tvalue, 400);
    fill(60);
    text(tvalues, tvalue, 1000);
    text(tvalues, tvalue, 1600);
    strokeWeight(2);
    stroke(60);
    line(tvalue, 405, tvalue, 2300);
    fill(255);
    text(tvalues, tvalue, 2320);
    leftMargin += width / 6;
  }

  /*loop through dates, for every date depending on if the artist is a Fender
or Gibson user, place a Fender or Gibson icon on the coresponding year at 
the corresponding row.*/

 
  //were played by ${lineCount} rockstars.
  let [fCount, gCount, lineCount] = guitarCounts();
  textSize(18);
  textAlign(LEFT);
  text(`${fCount} Fenders and ${gCount} Gibsons`, 315, 343);
  // text(`${fCount}               and  ${gCount}             `, 300, 350);
  // fill(183, 132, 67);
  // text("Gibsons", 495, 350);
  // fill(162, 224, 184);
  // text("Fenders", 330, 350);

  //rectangles around sound samples 
  stroke(255);
  strokeWeight(4);
  fill(0);
  rect(798, topMargin + 2448, 202, 202);
  samples.fender.top = topMargin + 2450;
  rect(798, topMargin + 2748, 202, 202);
  samples.gibson.top = topMargin + 2750;
}

//count brands, and lines
function guitarCounts() {
  return [
    guitarLocations.filter((g) =>
      g.type === "Fender"
    ).length,
    guitarLocations.filter((g) =>
      g.type === "Gibson"
    ).length,
    guitarLocations.length
  ]
}

// is mouse over any guitar image?
function overAnyGuitar() {  // boolean, return true if mouse position over a guitar
  return guitarLocations.some(
    (g) => (mouseX >= g.x && mouseX <= g.x + 100) && (mouseY >= g.y && mouseY <= g.y + 40)
  );
}
// is mouse over a particular guitar image?
function overOneGuitar(g) {  // boolean, return true if mouse position over a specific guitar guitar
  return (mouseX >= g.x && mouseX <= g.x + 100) && (mouseY >= g.y && mouseY <= g.y + 40);
}

// draw - render the guitar lines
function draw() {

  oldSetupAuxDrawCommands();
// background(0);
  guitarLocations.forEach(
    (g,index) => renderGuitarLine(g,index)
  );
  // can use value of last guitar line's y to close off display and start sound elements below
  // needs the frame lines and all below to be render now, OR could so earlier if line count known.
}
// if mouse moved check to see if mouse is still over a guitar, and if not remove showPick, returning cursor to default.
function mouseMoved() {
  if (!overAnyGuitar()) {
    $("body").removeClass(pClass);
  }
}

// is mouse over one of the rendered lines? if not return false. 
function overLine(g) {
  return (mouseY >= g.y && mouseY <= g.y + 40);
}
//draw guitar/artist lines
function renderGuitarLine(g, index) {
  if (index === 0) console.log(g.x);
  let textFillColor = 255;
//if mouse over this guitar line make text red. 
  if (overLine(g)) {
    textFillColor = 'rgb(148, 55, 10)';
  }
  if (g.type === "Fender") {
    image(fender, g.x, g.y);
  } else {
    image(gibson, g.x, g.y);
  }
//check if mouse is over guitar g, if so add pClass (cursor)
  if (overOneGuitar(g)) {
    $("body").addClass(pClass);
  }
  //draw #1 song titles, lines and hit icons 
  textSize(20);
  textAlign(LEFT);
  textStyle(NORMAL);

  if (g.songTitle !== '') {
    stroke(255);
    strokeWeight(1);
    line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
    if (g.numberOne == 1) {
      // stroke(255);
      // strokeWeight(1);
      // line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
      noStroke();
      fill('pink');
      text(g.songTitle, g.x + 185, g.y + 25);
      fill(textFillColor);
      textFont(myFont);
      textAlign(LEFT);
      textSize(20);
      text("hit", g.x + 420, g.y + 25);
      image(numberOneIcon, g.x + 390, g.y);
    }
    else {
      //non#1 song titles and lines 

      textAlign(LEFT);
      textFont("Futura");
      noStroke();
      textSize(20);
      fill(textFillColor);
      text(g.songTitle, g.x + 185, g.y + 25);
    }
    drawSound();
  }
  //rockstar names next to guitars
  textSize(20);
  textFont("Futura");
  textAlign(RIGHT);
  fill(textFillColor);
  noStroke();
  text(g.artist, g.x - 30, g.y + 25);

}

function mouseClicked() {
  //see if mouse click occurs on guitar icon 
  const guitarLocation = overAnyGuitar();

  //open jquery modal confirm window and display guitar title, image and close button 
  if (guitarLocation) {
    $.confirm({
      backgroundDismiss: true,
      boxWidth: '60%', //modal window 60% of screen
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
  }
  //mouse positions for sound stuff 
  else if ((mouseX >= 260 && mouseX <= 580) && (mouseY >= 2735 && mouseY <= 2765)) {
    togglePlay("fender");
  }
  else if ((mouseX >= 275 && mouseX <= 595) && (mouseY >= 3040 && mouseY <= 3070)) {
    togglePlay('gibson');
  }
  // prevent default
  return false;
}

//populate popup with image, frame, song and description  
function makeContent(guitarLocation) {
  return `<div class="popup">
    <img class="popupimage" 
    style="border-color: ${guitarLocation.type === 'Gibson' ? 'rgb(183, 132, 67)' : 'rgb(162, 224, 184)'}"
    src="${guitarLocation.imageURL}"/>
    <div class="sd">
    ${makeIframe(guitarLocation.songID)}
    <p>${guitarLocation.description}</p>
    </div>
  </div>`
}
//spotify Iframe call 
function makeIframe(songIDStr) {
  if (songIDStr !== "0") {
    return `<iframe src="https://open.spotify.com/embed/track/${songIDStr}" 
    width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
  }
  return "";
}

// sound functions 
function drawSound() {
  // print(mouseX,mouseY);
  //   background(0);
  if (playSoundBrand === null) return;
  let sample = samples[playSoundBrand];
  let spectrum = sample.fft.analyze();
  noStroke();
  fill(103, 219, 251); // audio frequency spectrum is blue
  for (var i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, 200);
    let h = -200 + map(spectrum[i], 0, 255, 200, 0);
    rect(x + sample.left, 200 + sample.top, 200 / spectrum.length, h)
  }

  let waveform = sample.fft.waveform();
  noFill();
  beginShape();
  stroke(221, 105, 103); // amplitude waveform is red
  strokeWeight(1);
  for (var i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, 198);
    let y = map(waveform[i], -1, 1, 0, 198);
    vertex(x + sample.left, y + sample.top);
  }
  endShape();
  // make border rectangles green on play 
  stroke(0, 255, 0);
  strokeWeight(4);
  rect(798, topMargin + 2448, 202, 202);
  samples.fender.top = topMargin + 2450;
  rect(798, topMargin + 2748, 202, 202);
  samples.gibson.top = topMargin + 2750;
  //   text('click to play/pause', 4, 10);
}

// fade sound if mouse is over canvas
function togglePlay(brand) {
  let sound = samples[brand].sound;
  if (playSoundBrand !== null) {
    if (sound.isPlaying()) {
      sound.pause();
      console.log("sound paused");
      // stroke('white');
      // strokeWeight(4);
      // fill(0);
      // rect(998, topMargin + 2298, 202, 202);
      // rect(998, topMargin + 2598, 202, 202);
      playSoundBrand = null;
    }
  } else {
    playSoundBrand = brand;
    sound.loop();
  }

}

function windowResized() {
  location.reload();
}

