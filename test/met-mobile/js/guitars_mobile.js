
//declare variables for graph, csv, fender and gibson icons, guitarLocations and decade arrays 
//graph sound;
const guitarTopMargin = 20;
let samples;
let playSoundBrand = null;
let table;
let fender;
let gibson;
let guitarLocations = [];
$("#menu").on("click", function () {
    alert("hello");
});

//current value of filter selection
let filterSelection = "All";// $("#select-menu").val();
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

let numberOneIcon;

//declare spacing variables
// let leftMargin = 50;
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
    // fenderSound = loadImage('images/fendersound.png');
    // gibsonSound = loadImage('images/gibsonsound.png');

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

    let cnv = createCanvas(2400 * 375 / 812, 2400);
    cnv.parent("canvas");

    // fill("red");
    // rect(100,100, 500, 1500);
    //
    // samples.fender.fft = new p5.FFT();
    // samples.fender.sound.amp(0.2);
    // samples.gibson.fft = new p5.FFT();
    // samples.gibson.sound.amp(0.2);

    setupAux();

}
//function with graph 
function setupAux() {

    background(0);
    fill(255);
    textSize(20);

    /*map year of manufacture onto graph, and get imageURL and description for modal.*/
    for (let r = 0, y = guitarTopMargin; r < table.getRowCount(); r++) {
        const yearValue = table.getNum(r, 3);
        const guitarYear = map(yearValue, 1940, 2000, 50, width - 270);
        const x = guitarYear;
        const imageURL = table.getString(r, 6);
        let description = table.getString(r, 7);

        let songID = table.getString(r, 8);
        // console.log({ x, y });
        //push new object into array guitarLocations 
        //object contains upper left corner of guitar icon + title + URL for guitar image
        const g = {
            x, y, imageURL, description, songID, //x, y for guitar icon location, image, text, songID for modal 
            type: table.getString(r, 1), //guitar make
            title: [table.getString(r, 1), //title for modal includes make
            table.getString(r, 2), //model
            table.getString(r, 3)].join("       "), //and date, all joined
            numberOne: table.getString(r, 9), //number one hits 
            category: table.getString(r, 10), //guitar model 
            artist: table.getString(r, 0), //rockstar
            songTitle: table.getString(r, 4) //song title 
        };
        if (toDisplay(g)) { //if meets conditions of filter, push

            guitarLocations.push(g);
            y += 50;

        }

    }

    //spacing variable for sound stuff 
    let guitarsBottom;
    // loop through decades for x axis lines and text
    for (var t = 1940; t <= 2000; t += 10) {
        var tvalues = t;
        var tvalue = map(tvalues, 1940, 2000, 50, width - 250);
        fill(255);
        strokeWeight(2);
        stroke(60);
        line(tvalue, guitarTopMargin, tvalue, 50 * guitarLocations.length + 23);//check line length +405
        fill(255);
        noStroke();
        tvalue -= 20;
        textSize(16);
        text(tvalues, tvalue, guitarTopMargin - 5);
        text(tvalues, tvalue, 40 + guitarLocations.length * 50);
        guitarsBottom = (425 + guitarLocations.length * 40);
        // if (filterSelection === "All") {
        //     fill(60);
        //     text(tvalues, tvalue, (395 + guitarsBottom) / 2 - 13);
        // }
    }
    //loop through guitars, add text per decade in gray after every tenth guitar
    //except when within ten of guitarLocations.length
    textSize(16);
    fill(60);
    guitarLocations.forEach(
        (g, i) => {
            if (i > 0 && i % 10 === 0 && guitarLocations.length - i >= 7) {
                for (var t = 1940; t <= 2000; t += 10) {
                    var tvalue = map(t, 1940, 2000, 50, width - 250);
                    text(t, tvalue - 25, g.y);
                }
            }
        }
    )

    //count make and model of guitar, place next to dropdown select-menu
    // let [fCount, gCount, lineCount] = guitarCounts();
    // textSize(18);
    // textAlign(LEFT);
    // fill(255);
    // text(`${fCount} Fenders and ${gCount} Gibsons were played by ${lineCount} rockstars`, 320, 338);

    // //show select-menu 
    // textSize(20);
    // fill(255);
    // $("#select-menu").show();

    //loop through guitarLocations object for row highlight and modal 
    guitarLocations.forEach(
        (g) => {
            let div = $('<div class="guitarRow"/>'); // create div for highlight and modal click
            //div is located at the top of the graph and is 99% of "width" wide and 40px tall
            div.css("top", g.y + 45);
            div.on("click", g, handleGuitarClick);
            // console.log(246, g.y);
            $("body").append(div);
            renderGuitarLine(g);
            //  console.log(249, g.y);

        });
    //pass spacing variable into sound stuff function     
    // setupBottom(guitarsBottom);

}

//sound stuff function 
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
    textSize(20);
    textFont("Futura");
    textAlign(LEFT);
    text("Fender's bright attack vs Gibson's warm \nsustain divides rockstars into camps. \n \nConventional wisdom holds that Gibson's set \nneck transfers resonance between neck \nand body better than Fender's bolt-on neck. \nThe result is said to be more warmth and \nsustain in the set-neck guitar, and more twang \nin the bolt-on guitar. \n \nTest the conventional wisdom by comparing \nthe wave forms of a Fender Stratocaster and \nGibson Les Paul, both strummed in open E. \n \nThe p5.js FFT wave form analyzer shows \namplitude (volume) over time in red, and \nfrequency (pitch), from the lowest to highest \nthat humans can hear, in blue. \n \nWhat do the wave forms tell you about \nFender and Gibson's tone?", 1150, WTopMargin + 360);
    textSize(24);
    textStyle(ITALIC);
    textAlign(CENTER);
    text("Test a Fender Stratocaster against a Gibson Les Paul", width / 2, WTopMargin + 270);
    textAlign(LEFT);
    textSize(20);
    text("Click strings for play/pause", 210, WTopMargin + 342);
    textSize(20);
    textStyle(NORMAL);
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


    //rectangles around sound samples, lines inside  
    stroke(255);
    strokeWeight(6);
    fill(0);
    rect(798, WTopMargin + 348, 202, 202);
    samples.fender.top = WTopMargin + 350;
    rect(798, WTopMargin + 648, 202, 202);
    samples.gibson.top = WTopMargin + 650;
    strokeWeight(1);
    stroke(0, 73, 219);
    line(802, WTopMargin + 455, 996, WTopMargin + 455);
    line(802, WTopMargin + 755, 996, WTopMargin + 755);
    stroke(221, 105, 103);
    line(802, WTopMargin + 445, 996, WTopMargin + 445);
    line(802, WTopMargin + 745, 996, WTopMargin + 745);

    //add divs for strings mouseover 
    $("#Fstring.strings").css("left", 260).css("top", WTopMargin + 425);
    $("#Gstring.strings").css("left", 275).css("top", WTopMargin + 715);
}
// new handleGuitarClick
function handleGuitarClick(event) {
    let g = event.data;
    // let boxWidth = '100%';
    console.log(g.songID);
    // if(g.songID !== "0") {
    //     if(g.description.length > 400) boxWidth = '80%';
    // }
    $.confirm({
        backgroundDismiss: true,
        boxWidth: '90%', //modal window 90% of screen
        boxHeight: '100%',
        useBootstrap: false,
        title: `<div class="popuptitletext"></div>`,

        content: makeContent(g), //call makeContent function for modal 
        buttons: {
            close: function () {
            },
        },
        //resize image to override Firefox 
        // onOpen: function () {
        //     $(".popupimage").css("height", "180px"); //image height fixed at 200px
        // }
    });
}

//filter brands for guitar count sentence 
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
        image(fender, g.x, g.y, 81, 27);
    } else {
        image(gibson, g.x, g.y, 81, 27);
    }
    //draw #1 song titles, lines and hit icons 
    textAlign(LEFT);
    textStyle(NORMAL);
    textSize(14);
    if (g.songTitle !== '') {
        if (g.numberOne == 1) {
            // stroke(255);
            // strokeWeight(1);
            // line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
            noStroke();
            fill('#B8A2E0');
            text(g.songTitle + " #1", g.x + 95, g.y + 33);
            fill(255);
            textFont(myFont);
            textAlign(LEFT);
            //      text("number one hit", g.x + 200, g.y + 33); //adjust with song title 
            //          image(numberOneIcon, g.x + 310, g.y + 33);
        }
        else {
            //non #1 song titles and lines 
            stroke(255);
            strokeWeight(1);
            // line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
            textAlign(LEFT);
            textFont("Futura");
            noStroke();
            fill(255);
            text(g.songTitle, g.x + 95, g.y + 33);
        }
    }
    //rockstar names next to guitars
    fill(255);
    textFont("Futura");
    textAlign(LEFT);
    textSize(16);
    textStyle(BOLD);
    noStroke();
    text(g.artist, g.x + 95, g.y + 16);
}

//locate guitar for mouseover--still used? 
// function overGuitar() {
//     let result = guitarLocations.find(
//         (g) => (mouseX >= g.x && mouseX <= g.x + 100) && (mouseY >= g.y && mouseY <= g.y + 40)
//     );
//     // console.log(result, mouseX);
//     return result;
// }

//mouse click function 
function mouseClicked() {

    //mouse positions for sound stuff 
    if ((mouseX >= 260 && mouseX <= 580) && (mouseY >= WTopMargin + 425 && mouseY <= WTopMargin + 475)) {
        togglePlay("fender");
        // fill(0);
        // rect(798, topMargin + 2448, 202, 202);
        stroke(162, 224, 184);
        strokeWeight(6);
        rect(798, WTopMargin + 348, 202, 202);
        samples.fender.top = WTopMargin + 348;
    }
    else if ((mouseX >= 275 && mouseX <= 595) && (mouseY >= WTopMargin + 715 && mouseY <= WTopMargin + 765)) {
        togglePlay("gibson");
        // fill(0);
        // rect(798, topMargin + 2748, 202, 202);
        stroke(183, 132, 67);
        strokeWeight(6);
        rect(798, WTopMargin + 648, 202, 202);
        samples.gibson.top = WTopMargin + 648;
    }
}

//populate popup with image, frame, song and description  
function makeContent(guitarLocation) {
    return `<div class="popup">
    <div class="popuptitle">${guitarLocation.title}</div>
    <img class="popupimage" 
    style="border-color: ${guitarLocation.type === 'Gibson' ? 'rgb(183, 132, 67)' : 'rgb(162, 224, 184)'}"
    src="${guitarLocation.imageURL}"/>
    <div class="sd">
    <p>${guitarLocation.description}</p>
    </div>
    ${makeIframe(guitarLocation.songID)}
  </div>`
}
//spotify iFrame call 
function makeIframe(songIDStr) {
    if (songIDStr !== "0") {
        return `<iframe src="https://open.spotify.com/embed/track/${songIDStr}" 
    width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
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

// scroll testing
// window.addEventListener('scroll', function() {
//     window.scroll(pageYOffset,pageYOffset) // X coordinate, Y coordinate
//     //window.scroll(pageYOffset*0.5,pageYOffset) // example to show you half speed scrolling across

//   });
