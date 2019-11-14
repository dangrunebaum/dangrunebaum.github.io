/*USE P5 .CSV  TOOLS TO MAKE NAME COLUMN ON LEFT MARGIN
PLACE GUITARS ICONS ON LINE ACCORDING TO ROW AND YEAR. FOR EACH ROW, IF GIBSON PLACE
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

//current value of filter selection
let filterSelection = $("#select-menu").val();
$("#select-menu").on("change",
    () => {
        filterSelection = $("#select-menu").val();
        clear();
        guitarLocations = [];
        $(".guitarRow").remove();
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
    numberOneIcon = loadImage('images/oneicon_2.png');
    fenderStrat = loadImage('images/fender_strat.png');
    gibsonLP = loadImage('images/gibson_lp2.png');
    arrow = loadImage('images/arrow.png');

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

    let cnv = createCanvas(windowWidth, 3250);

    //
    samples.fender.fft = new p5.FFT();
    samples.fender.sound.amp(0.2);
    samples.gibson.fft = new p5.FFT();
    samples.gibson.sound.amp(0.2);

    setupAux();

}

function setupAux() {

    background(0);

    //title images and text
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

    //subtitle and other accompanying top text 
    textFont("Futura");
    textStyle(ITALIC);
    textSize(24);
    textAlign(CENTER);
    noStroke();
    fill(255);
    text("The Fender/Gibson rivalry shaped the sound of rockstars in the \nMetropolitan Museum of Art's \"Play It Loud\" exhibition. Click to explore.", width / 2, topMargin + 60);
    fill(255);
    textAlign(LEFT);
    textSize(16);
    textStyle(NORMAL);
    text("Date of Manufacture", 131, topMargin + 170);
    textSize(20);
    image(arrow, 180, topMargin + 195);

    /*map year of manufacture onto graph, and get imageURL and description for modal.*/
    for (let r = 0, y = guitarTopMargin; r < table.getRowCount(); r++) {
        const yearValue = table.getNum(r, 3);
        const guitarYear = map(yearValue, 1940, 2000, 150, width - 300);
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
        if (toDisplay(g)) {

            guitarLocations.push(g);
            y += 40;

        }

    }

    let guitarsBottom;
    //loop through decades for x axis and lines
    for (var t = 1940; t <= 2000; t += 10) {
        var tvalues = t;
        var tvalue = map(tvalues, 1940, 2000, 150, width - 300);
        fill(255);
        strokeWeight(2);
        stroke(60);
        line(tvalue, 405, tvalue, 40 * guitarLocations.length + 405);
        fill(255);
        noStroke();
        tvalue -= 20;
        text(tvalues, tvalue, 395);
        text(tvalues, tvalue, 430 + guitarLocations.length * 40);
        guitarsBottom = (425 + guitarLocations.length * 40);
        if (filterSelection === "All") {
            fill(60);
            text(tvalues, tvalue, (395 + guitarsBottom) / 2 - 13);
        }
    }

    //count make and model of guitar, place next to dropdown select-menu
    let [fCount, gCount, lineCount] = guitarCounts();
    textSize(18);
    textAlign(LEFT);
    fill(255);
    text(`${fCount} Fenders and ${gCount} Gibsons`, 320, 338);


    textSize(20);
    fill(255);
    $("#select-menu").show();

    guitarLocations.forEach(
        (g) => {
            let div = $('<div class="guitarRow"/>'); // create div for highlight and modal click
            //div is located at the top of the graph and is 99% of "width" wide and 40px tall
            div.css("top", g.y - 5);
            div.on("click", g, handleGuitarClick);
            // console.log(246, g.y);
            $("body").append(div);
            renderGuitarLine(g);
            //  console.log(249, g.y);

        });
    setupBottom(guitarsBottom);

}

let WTopMargin;
function setupBottom(guitarsBottom) {
    WTopMargin = guitarsBottom;

    //text line at end of graph  
    textAlign(LEFT);
    fill(255);
    text("   Fenders in vintage               .  Gibsons in classic            .", 114, WTopMargin + 37);
    fill(162, 224, 184);
    text("surf green", 300, WTopMargin + 37);
    fill(183, 132, 67);
    text("goldtop", 572, WTopMargin + 37);

    //text and images for sound comparison 
    textFont(myFont);
    fill(255);
    textSize(55);
    textAlign(CENTER);
    text("FENDER  VS  GIBSON      SOUND  AND  WAVE  FORM  COMPARISON", width / 2, WTopMargin + 200);
    textSize(22);
    textFont("Futura");
    textAlign(LEFT);
    text("Fender's bright attack vs Gibson's warm \nsustain divides rockstars into camps. \n \nConventional wisdom holds that Gibson's set \nneck transfers resonance between neck \nand body better than Fender's bolt-on neck. \nThe result is said to be more warmth and \nsustain in the set-neck guitar, and more twang \nin the bolt-on guitar. \n \nTest the conventional wisdom by comparing \nthe wave forms of a Fender Stratocaster and \nGibson Les Paul, both strummed in open E. \n \nThe p5.js FFT wave form analyzer shows \namplitude (volume) over time in red, and \nfrequency (pitch), from the lowest to highest \nthat humans can hear, in blue.", 1150, WTopMargin + 360);
    textSize(24);
    textStyle(ITALIC);
    textAlign(CENTER);
    text("Test a Fender Stratocaster against a Gibson Les Paul", width / 2, WTopMargin + 270);
    textStyle(NORMAL);
    textAlign(LEFT);
    textSize(18);
    text("Click guitar strings for play/pause", 210, WTopMargin + 342);
    textSize(20);
    text("Stratocaster", 210, WTopMargin + 560);
    text("Les Paul", 210, WTopMargin + 850);
    image(fenderStrat, 200, WTopMargin + 380);
    image(gibsonLP, 195, WTopMargin + 660);

    //legend for sound samples 
    fill(221, 105, 103);
    rect(798, WTopMargin + 570, 20, 20);
    fill(0, 73, 219);
    rect(798, WTopMargin + 610, 20, 20);
    fill(255);
    text("Amplitude", 830, WTopMargin + 587);
    text("Frequency", 830, WTopMargin + 627);


    //rectangles around sound samples 
    stroke(255);
    strokeWeight(4);
    fill(0);
    rect(798, WTopMargin + 348, 202, 202);
    samples.fender.top = WTopMargin + 350;
    rect(798, WTopMargin + 648, 202, 202);
    samples.gibson.top = WTopMargin + 650;

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

//filter brands 
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

//draw guitars 
function renderGuitarLine(g) {
    if (g.type === "Fender") {
        image(fender, g.x, g.y);
    } else {
        image(gibson, g.x, g.y);
    }
    //draw #1 song titles, lines and hit icons 
    textAlign(LEFT);
    textStyle(NORMAL);

    if (g.songTitle !== '') {
        if (g.numberOne == 1) {
            stroke(255);
            strokeWeight(1);
            line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
            noStroke();
            fill('pink');
            text(g.songTitle, g.x + 185, g.y + 25);
            fill(255);
            textFont(myFont);
            textAlign(LEFT);
            text("hit", g.x + 420, g.y + 25);
            image(numberOneIcon, g.x + 390, g.y + 5);
        }
        else {
            //non #1 song titles and lines 
            stroke(255);
            strokeWeight(1);
            line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
            textAlign(LEFT);
            textFont("Futura");
            noStroke();
            textSize(20);
            fill(255);
            text(g.songTitle, g.x + 185, g.y + 25);
        }
    }
    //rockstar names next to guitars
    textFont("Futura");
    textAlign(RIGHT);
    noStroke();
    text(g.artist, g.x - 30, g.y + 25);
}

//locate guitar 
function overGuitar() {
    let result = guitarLocations.find(
        (g) => (mouseX >= g.x && mouseX <= g.x + 100) && (mouseY >= g.y && mouseY <= g.y + 40)
    );
    // console.log(result, mouseX);
    return result;
}

function mouseClicked() {


    //mouse positions for sound stuff 
    if ((mouseX >= 260 && mouseX <= 580) && (mouseY >= WTopMargin + 435 && mouseY <= WTopMargin + 465)) {
        togglePlay("fender");
        // fill(0);
        // rect(798, topMargin + 2448, 202, 202);
        stroke(162, 224, 184);
        strokeWeight(4);
        rect(798, WTopMargin + 348, 202, 202);
        samples.fender.top = WTopMargin + 348;
    }
    else if ((mouseX >= 275 && mouseX <= 595) && (mouseY >= WTopMargin + 725 && mouseY <= WTopMargin + 755)) {
        togglePlay("gibson");
        // fill(0);
        // rect(798, topMargin + 2748, 202, 202);
        stroke(183, 132, 67);
        strokeWeight(4);
        rect(798, WTopMargin + 648, 202, 202);
        samples.gibson.top = WTopMargin + 648;
    }
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

//sound functions 
function draw() {
    //   background(0);
    if (playSoundBrand === null) return;
    let sample = samples[playSoundBrand];
    let spectrum = sample.fft.analyze();
    noStroke();
    fill(0, 73, 219); // audio frequency spectrum is blue
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

function windowResized() {
    location.reload();
}

// const start = new Date().getTime()

// console.log(new Date().getTime() - start)