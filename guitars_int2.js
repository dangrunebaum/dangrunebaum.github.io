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


let graph = (p) => {

    p.preload = () => {
        //load font and table 
        myFont = p.loadFont('AllAgesDemo-2DPX.ttf');
        table = p.loadTable('guitars.csv', 'csv', 'header');
        // consoleString.log(table);
        //load images  
        fender = p.loadImage('images/fender_icon_green.png');
        gibson = p.loadImage('images/gibson_icon.png');
        fenderLogo = p.loadImage('images/Fender_logo_green.png');
        gibsonLogo = p.loadImage('images/Gibson_logo.png');
        numberOneIcon = p.loadImage('images/oneicon.png');
        arrow = p.loadImage('images/arrow.png');


    }

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth, 2000);
        p.background(0);

        setupAux();

    }

    function setupAux() {

        //title images and text
        p.noStroke();
        p.fill(200, 200, 100);
        p.textFont(myFont);
        p.textSize(70);
        p.textStyle(p.BOLD);
        p.fill(162, 224, 184);
        p.image(fenderLogo, (p.width / 2) - 450, 15);
        p.textAlign(p.CENTER);
        p.fill(255);
        p.text("VS", p.width / 2, 120);
        p.fill(183, 132, 67);
        p.image(gibsonLogo, (p.width / 2) + 130, 15);
        p.fill(255);
        p.textSize(30);
        p.textStyle(p.NORMAL);
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


        /*loop through dates, for every date depending on if the artist is a Fender
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
            if (toDisplay(g)) {

                guitarLocations.push(g);
                y += 40;

            }

        }

        //were played by ${lineCount} rockstars.
        let [fCount, gCount, lineCount] = guitarCounts();
        p.textSize(18);
        p.textAlign(p.LEFT);
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
        p.stroke(255);
        p.strokeWeight(1);
        p.line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
        p.noStroke();
        p.fill('pink');
        p.text(g.songTitle, g.x + 185, g.y + 25);
        p.fill(255);
        p.textFont(myFont);
        p.textAlign(LEFT);
        p.text("hit", g.x + 420, g.y + 25);
        p.image(numberOneIcon, g.x + 390, g.y);
      }
      else {
        //non #1 song titles and lines 
        p.stroke(255);
        p.strokeWeight(1);
        p.line(g.x + 105, g.y + 17, g.x + 178, g.y + 17);
        p.textAlign(LEFT);
        p.textFont("Futura");
        p.noStroke();
        p.textSize(20);
        p.fill(255);
        p.text(g.songTitle, g.x + 185, g.y + 25);
      }
    }
    //rockstar names next to guitars
    p.textFont("Futura");
    p.textAlign(RIGHT);
    p.noStroke();
    p.text(g.artist, g.x - 30, g.y + 25);
  }
  
  let wave = (w) => {

    w.setup = () => {
        canvas = w.createCanvas(w.windowWidth, 1500);

    }

    w.draw = () => {
        w.background(50);
        w.fill(255);
    }

}

let graphCanvas = new p5(graph);

let waveCanvas = new p5(wave);