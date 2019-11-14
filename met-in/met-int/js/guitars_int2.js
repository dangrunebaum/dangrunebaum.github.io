//object, sound, table and array variables 
let samples;
let playSoundBrand = null;
let table;
let fender;
let gibson;
let numberOneIcon;
let guitarLocations;
let allGuitarLocations = [];

//current value of filter selection
let filterSelection = $("#select-menu").val();

//filter function   
function toDisplay(g) {
  if (filterSelection === "All") return true;
  let [value, field] = filterSelection.split(",");
  return g[field] === value;
}


//spacing variables
const guitarTopMargin = 410;
let leftMargin = 150;
const topMargin = 200;
//let graphWidth = 1350;
function preload () {
  alert('reload');
}
//start graph instance 
let graph = (p) => {

  $("#select-menu").on("change",
  () => {
    filterSelection = $("#select-menu").val();
    p.clear();
    let y = guitarTopMargin;
    guitarLocations = allGuitarLocations.filter(
      g => {
        if (toDisplay(g)) {
          g.y = y;
          y += 40;
          return true;
        } else return false;
      });
    $(".guitarRow").remove();
    setupAux();
  }).show();

  p.preload = () => {
    //load font and table 
    myFont = p.loadFont('font/AllAgesDemo-2DPX.ttf');
    table = p.loadTable('data/guitars.csv', 'csv', 'header');
    //  console.log(table);
    //load images  
    fender = p.loadImage('images/fender_icon_green.png');
    gibson = p.loadImage('images/gibson_icon.png');
    fenderLogo = p.loadImage('images/Fender_logo_green.png');
    gibsonLogo = p.loadImage('images/Gibson_logo.png');
    numberOneIcon = p.loadImage('images/oneicon.png');
    arrow = p.loadImage('images/arrow.png');

    /*loop through dates, for every date if rockstar is a Fender
  or Gibson user, place a Fender or Gibson icon on the coresponding year at 
  the corresponding row.*/
    for (let r = 0, y = guitarTopMargin; r < table.getRowCount(); r++) {
      const yearValue = table.getNum(r, 3);
      const guitarYear = p.map(yearValue, 1940, 2000, 150, p.width - 300);
      const x = guitarYear;
      const imageURL = table.getString(r, 6);
      let description = table.getString(r, 7);

      let songID = table.getString(r, 8);
      // console.log({ x, y });
      //push new object into array guitarLocations 
      //object contains upper left corner of guitar icon + title + URL for guitar image
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

      // if (toDisplay(g)) {

      allGuitarLocations.push(g);
      y += 40;

      // }

    }

    guitarLocations = allGuitarLocations;

  }

  //set up canvas 
  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, 2500);
    p.background(0);

    setupAux();

  }

  function setupAux() {

    //title images and text
    p.image(fenderLogo, (p.width / 2) - 450, 15);
    p.image(gibsonLogo, (p.width / 2) + 130, 15);
    // p.noStroke();
    // p.fill(200, 200, 100);
    p.textFont(myFont);
    p.textSize(70);
    // p.textStyle(p.BOLD);
    // p.fill(162, 224, 184);
    p.textAlign(p.CENTER);
    p.fill(255);
    p.text("VS", p.width / 2, 120);
    // p.fill(183, 132, 67);
    // p.fill(255);
    p.textSize(30);
    // p.textStyle(p.NORMAL);
    p.text("THE    GREAT    GUITAR    DEBATE", p.width / 2, 210);


    //subtitle and other accompanying text 
    p.textFont("Futura");
    p.textStyle(p.ITALIC);
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.noStroke();
    p.fill(255);
    p.text("The Fender/Gibson rivalry shaped the sound of rockstars in the \nMetropolitan Museum of Art's \"Play It Loud\" exhibition. Click to explore.", p.width / 2, topMargin + 60);
    p.fill(255);
    p.textAlign(p.LEFT);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text("Date of Manufacture", 130, topMargin + 170);
    p.textSize(20);
    p.image(arrow, 180, topMargin + 195);

    p.fill(255);
    p.text("   Fenders in vintage               .  Gibsons in classic            .", 130, topMargin + 2150);
    p.fill(162, 224, 184);
    p.text("surf green", 316, topMargin + 2150);
    p.fill(183, 132, 67);
    p.text("goldtop", 588, topMargin + 2150);




    //were played by ${lineCount} rockstars.
    let [fCount, gCount, lineCount] = guitarCounts();
    p.textSize(18);
    p.textAlign(p.LEFT);
    p.fill(255);
    p.text(`${fCount} Fenders and ${gCount} Gibsons`, 320, 338);

    //loop through decades for x axis and lines
    for (var t = 1940; t <= 2000; t += 10) {
      var tvalues = t;
      var tvalue = p.map(tvalues, 1940, 2000, 150, p.width - 300);
      p.fill(255);
      p.strokeWeight(2);
      p.stroke(60);
      p.line(tvalue, 405, tvalue, 40 * guitarLocations.length + 405);
      p.fill(255);
      p.noStroke();
      tvalue -= 20;
      p.text(tvalues, tvalue, 395);
      p.text(tvalues, tvalue, 425 + guitarLocations.length * 40);
      if (filterSelection === "All") {
        let textY = (395 + 425 + guitarLocations.length * 40) / 2;
        p.fill(60);
        p.text(tvalues, tvalue, textY - 13);
      }
    }
    p.textSize(20);
    p.fill(255);
    $("#select-menu").show();




    guitarLocations.forEach(
      (g) => {
        let div = $('<div class="guitarRow"/>'); // create div
        //div is located at the top of the graph and is 99% of "width" wide and 40px tall
        div.css("top", g.y - 5);
        div.on("click", g, handleGuitarClick);
        // console.log(246, g.y);
        $("body").append(div);
        renderGuitarLine(g);
        //  console.log(249, g.y);

      });
  }
}

//draw guitars 
function renderGuitarLine(g) {
  if (g.type === "Fender") {
    p.image(fender, g.x, g.y);
  } else {
    p.image(gibson, g.x, g.y);
  }
  //draw #1 song titles, lines and hit icons 
  p.textAlign(p.LEFT);
  p.textStyle(p.NORMAL);

  if (g.songTitle !== '') {
    if (g.numberOne == 1) {
      p.stroke(255);
      p.strokeWeight(1);
      p.line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
      p.noStroke();
      p.fill('pink');
      p.text(g.songTitle, g.x + 185, g.y + 25);
      p.fill(255);
      p.textFont(myFont);
      p.textAlign(p.LEFT);
      p.text("hit", g.x + 420, g.y + 25);
      p.image(numberOneIcon, g.x + 390, g.y);
    }
    else {
      //non #1 song titles and lines 
      p.stroke(255);
      p.strokeWeight(1);
      p.line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
      p.textAlign(p.LEFT);
      p.textFont("Futura");
      p.noStroke();
      p.textSize(20);
      p.fill(255);
      p.text(g.songTitle, g.x + 185, g.y + 25);
    }
  }
  //rockstar names next to guitars
  p.textFont("Futura");
  p.textAlign(p.RIGHT);
  p.noStroke();
  p.text(g.artist, g.x - 30, g.y + 25);
}


function guitarCounts() {
  return [
    guitarLocations.filter((g) =>
      g.type === "Fender"
    ).length,
    guitarLocations.filter((g) => {
      if (g.type === "Gibson") {
        // console.log(g.artist);
        return true;
      }
      return false;
    }
    ).length,
    guitarLocations.length
  ]

}

// new handleGuitarClick
function handleGuitarClick(event) {
  let g = event.data;
  $.confirm({
    backgroundDismiss: true,
    boxWidth: '60%', //modal window 30% of screen
    boxHeight: '50%',
    useBootstrap: false,
    title: `<div class="popuptitle">
    <span class="popuptitletext">${g.title}</span>
    </div>`,
    //image height fixed at 400px 
    content: makeContent(g),
    buttons: {
      close: function () {
      },
    }
  });
}

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



let wave = (w) => {
  let WTopMargin = 5;

  //load font and table 
  w.preload = () => {
    myFont = w.loadFont('font/AllAgesDemo-2DPX.ttf');
    fenderStrat = w.loadImage('images/fender_strat.png');
    gibsonLP = w.loadImage('images/gibson_lp2.png');

    //create data structure for samples
    samples = {
      fender: {
        fft: null,
        top: 0,
        left: 800,
        sound: w.loadSound('sound/fender_sample.mp3')
      },
      gibson: {
        fft: null,
        top: 0,
        left: 800,
        sound: w.loadSound('sound/gibson_sample.mp3')
      }
    }
  }

  w.setup = () => {
    canvas = w.createCanvas(w.windowWidth, 1000);
    w.background(20);

    samples.fender.fft = new p5.FFT();
    samples.fender.sound.amp(0.2);
    samples.gibson.fft = new p5.FFT();
    samples.gibson.sound.amp(0.2);

    //text and images for sound comparison 
    w.textFont(myFont);
    w.fill(255);
    w.textSize(55);
    w.textAlign(w.CENTER);
    w.text("FENDER  VS  GIBSON      SOUND  AND  WAVE  FORM  COMPARISON", w.width / 2, WTopMargin + 200);
    w.textSize(22);
    w.textFont("Futura");
    w.textAlign(w.LEFT);
    w.text("Fender's bright attack vs Gibson's warm \nsustain divides rockstars into camps. \n \nConventional wisdom holds that Gibson's set \nneck transfers resonance between neck \nand body better than Fender's bolt-on neck. \nThe result is said to be more warmth and \nsustain in the set-neck guitar, and more twang \nin the bolt-on guitar. \n \nTest the conventional wisdom by comparing \nthe wave forms of a Fender Stratocaster and \nGibson Les Paul, both strummed in open E. \n \nThe p5.js FFT wave form analyzer shows \namplitude (volume) over time in red, and \nfrequency (pitch), from the lowest to highest \nthat humans can hear, in blue.", 1150, WTopMargin + 360);
    w.textSize(24);
    w.textStyle(w.ITALIC);
    w.textAlign(w.CENTER);
    w.text("Test a Fender Stratocaster against a Gibson Les Paul", w.width / 2, WTopMargin + 270);
    w.textStyle(w.NORMAL);
    w.textAlign(w.LEFT);
    w.textSize(18);
    w.text("Click guitar strings for play/pause", 210, WTopMargin + 342);
    w.textSize(20);
    w.text("Stratocaster", 210, WTopMargin + 560);
    w.text("Les Paul", 210, WTopMargin + 850);
    w.image(fenderStrat, 200, WTopMargin + 380);
    w.image(gibsonLP, 195, WTopMargin + 660);

    //legend for sound samples 
    w.fill(221, 105, 103);
    w.rect(798, WTopMargin + 570, 20, 20);
    w.fill(0, 73, 219);
    w.rect(798, WTopMargin + 610, 20, 20);
    w.fill(255);
    w.text("Amplitude", 830, WTopMargin + 587);
    w.text("Frequency", 830, WTopMargin + 627);


    //rectangles around sound samples 
    w.stroke(255);
    w.strokeWeight(4);
    w.fill(0);
    w.rect(798, WTopMargin + 348, 202, 202);
    samples.fender.top = WTopMargin + 350;
    w.rect(798, WTopMargin + 648, 202, 202);
    samples.gibson.top = WTopMargin + 650;

  }

  w.draw = () => {

    if (playSoundBrand === null) return;
    let sample = samples[playSoundBrand];
    let spectrum = sample.fft.analyze();
    w.noStroke();
    w.fill(0, 73, 219); // audio frequency spectrum is blue
    for (var i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, 0, 200);
      let h = -200 + map(spectrum[i], 0, 255, 200, 0);
      w.rect(x + sample.left, 200 + sample.top, 200 / spectrum.length, h)
    }

    let waveform = sample.fft.waveform();
    w.noFill();
    w.beginShape();
    w.stroke(221, 105, 103); // amplitude waveform is red
    w.strokeWeight(1);
    for (var i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, 198);
      let y = map(waveform[i], -1, 1, 0, 198);
      w.vertex(x + sample.left, y + sample.top);
    }
    w.endShape();

  }



  // fade sound if mouse is over canvas
  function togglePlay(brand) {
    let sound = samples[brand].sound;
    if (playSoundBrand !== null) {
      if (sound.isPlaying()) {
        sound.pause();
        playSoundBrand = null;
      }
    } else {
      playSoundBrand = brand;
      sound.loop();
    }

  }
  function mouseClicked() {


    //mouse positions for sound stuff 
    if ((mouseX >= 260 && mouseX <= 580) && (mouseY >= 435 && mouseY <= WTopMargin + 465)) {
      togglePlay("fender");
      //make rectangle green on play 
      w.fill(0);
      w.rect(798, WTopMargin + 348, 202, 202);
      w.stroke(162, 224, 184);
      w.strokeWeight(4);
      w.rect(798, WTopMargin + 348, 202, 202);
      samples.fender.top = topMargin + 2450;
    }
    else if ((mouseX >= 275 && mouseX <= 595) && (mouseY >= WTopMargin + 725 && mouseY <= WTopMargin + 755)) {
      togglePlay("gibson");
      w.fill(0);
      w.rect(798, WTopMargin + 648, 202, 202);
      w.stroke(183, 132, 67);
      w.strokeWeight(4);
      w.rect(798, WTopMargin + 648, 202, 202);
      samples.gibson.top = WTopMargin + 650;
    }
  }
}

let graphCanvas = new p5(graph);

let waveCanvas = new p5(wave);



//