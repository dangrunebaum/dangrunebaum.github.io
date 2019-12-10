
//declare variables for graph, csv, fender and gibson icons, guitarLocations and decade arrays 
//graph sound;
const guitarTopMargin = 45;
let samples;
let playSoundBrand = null;
let table;
let fender;
let gibson;
let guitarLocations = [];

//click sound icon sends user to sound page
$("#sound").on("click", function () {
    window.location.href = 'sound.html';
});


//current value of filter selection
let filterSelection = "All";// $("#select-menu").val();
$("#filter-menu div").on("click",
    function (event) {
        event.preventDefault();
        // ZK: toggle class
        // https://api.jquery.com/toggleclass/
        $("#filter-menu").toggleClass("visible");
        if ($(this).hasClass("chosen")) return;
        $("#filter-menu div").removeClass("chosen");
        $(this).addClass("chosen");
        filterSelection = $(this).attr("value");
        clear();
        guitarLocations = [];
        $(".guitarRow").remove();
        setupAux();
        window.scroll(0, 0);
    })

//toggle filter menu visibility on click 
$("#menu").on("click", () => {
    $("#filter-menu").toggleClass("visible");
    if ($("#filter-menu").hasClass('visible')) {
        // $(document).css("overflow") = "hidden"
    } else {
        $('html').css('overflow', 'scroll'); //allow scroll when hidden 
    }
    event.preventDefault();
});

//filter function   
function toDisplay(g) {
    if (filterSelection === "All") return true;
    let [value, field] = filterSelection.split(",");
    return g[field] === value;
}

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
    // numberOneIcon = loadImage('images/oneicon_2.png');
    fenderStrat = loadImage('images/fender_strat.png');
    gibsonLP = loadImage('images/gibson_lp2.png');
    // arrow = loadImage('images/arrow.png');

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

    //variable for avoiding iPhone canvas size limit
    let _width = window.innerWidth * 2;
    let cnv = createCanvas(_width, 2400);
    cnv.parent("canvas");

    setupAux();
}

//function with graph 
function setupAux() {

    background(0);
    fill(255);
    textSize(20);
    let numFenders = 0;
    let numGibsons = 0;
    /*map year of manufacture onto graph, and get imageURL and description for modal.*/
    for (let r = 0, y = guitarTopMargin; r < table.getRowCount(); r++) {
        const yearValue = table.getNum(r, 3);
        const guitarYear = map(yearValue, 1940, 2000, 50, width - 270);
        const x = guitarYear;
        const imageURL = table.getString(r, 6);
        let description = table.getString(r, 7);
        let type = table.getString(r, 1);
        let songID = table.getString(r, 8);
        // console.log({ x, y });
        //push new object into array guitarLocations 
        //object contains upper left corner of guitar icon + title + URL for guitar image
        const g = {
            //x, y for guitar icon location, image, text, songID, type 
            x, y, imageURL, description, songID, type,
            title: [table.getString(r, 1), //title for modal includes make
            table.getString(r, 2), //model
            table.getString(r, 3)].join("       "), //and date, all joined
            numberOne: table.getString(r, 9), //number one hits 
            category: table.getString(r, 10), //guitar model 
            artist: table.getString(r, 0), //rockstar
            songTitle: table.getString(r, 4) //song title 
        };
        if (toDisplay(g)) { //if meets conditions of filter, push
            if (type === "Fender") numFenders++;
            else numGibsons++;
            guitarLocations.push(g);
            y += 50;

        }

    }
    //text fields for filter values
    const value = filterSelection.split(",")[0];
    if (filterSelection === "All" || value === "Other") {
        $("#filter-text").text(`${numFenders} Fenders and ${numGibsons} Gibsons`)
    } else {

        const count = numFenders + numGibsons;
        let fg = "Gibsons";
        if (value === "Fender" || value === "Stratocaster" || value === "Telecaster") {
            fg = "Fenders";
        }
        let selectionText = $("#filter-menu div.chosen").text() + ": ";
        if (selectionText.indexOf("All") === 0) selectionText = "";
        else {
            fg = "";
        }
        $("#filter-text").text(`${selectionText}${count} ${fg}`);
    }

    // loop through decades for x axis lines and text
    for (var t = 1940; t <= 2000; t += 10) {
        var tvalues = t;
        var tvalue = map(tvalues, 1940, 2000, 50, width - 100);
        fill(255);
        strokeWeight(1);
        stroke(60);
        line(tvalue, guitarTopMargin, tvalue, 50 * guitarLocations.length + 23);//check line length +405
        fill(255);
        noStroke();
        tvalue -= 20;
        textStyle(NORMAL);
        textSize(16);
        text(tvalues, tvalue, guitarTopMargin - 5);
        text(tvalues, tvalue, 40 + guitarLocations.length * 50);
        guitarsBottom = (425 + guitarLocations.length * 40);

    }

    //loop through guitars, add text per decade in gray after every tenth guitar
    //except when within ten of guitarLocations.length
    textSize(16);
    fill(60);
    guitarLocations.forEach(
        (g, i) => {
            if (i > 0 && i % 10 === 0 && guitarLocations.length - i >= 7) {
                for (var t = 1940; t <= 2000; t += 10) {
                    var tvalue = map(t, 1940, 2000, 50, width - 100);
                    text(t, tvalue - 20, g.y);
                }
            }
        }
    )

    //loop through guitarLocations object for row click field 
    guitarLocations.forEach(
        (g) => {
            let div = $('<div class="guitarRow"/>'); // create div for modal click
            //div is located at the top of the graph and is 99% of "width" wide and 40px tall
            div.css("top", g.y + 45);
            div.on("click", g, handleGuitarClick);
            // console.log(246, g.y);
            $("body").append(div);
            renderGuitarLine(g);
            //  console.log(249, g.y);

        });
}

// new handleGuitarClick
function handleGuitarClick(event) {
    let g = event.data;
    // let boxWidth = '100%';
    console.log(g.songID);
    // if(g.songID !== "0") {
    //     if(g.description.length > 400) boxWidth = '80%';
    // }
    $.confirm({ //div is inserted
        backgroundDismiss: true,
        boxWidth: '90%', //modal window 90% of screen
        boxHeight: '100%',
        useBootstrap: false,
        title: `<div class="popuptitletext"></div>`,
        typeAnimated: false,

        content: makeContent(g), //call makeContent function for modal 
        buttons: {
            close: function () {
                $('html').css('overflow', 'scroll');
            },
        },
    });
}

//filter brands for guitar count text 
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

            noStroke();
            fill('#B8A2E0');
            text(g.songTitle + " #1", g.x + 95, g.y + 33);
            fill(255);
            textFont(myFont);
            textAlign(LEFT);
        }
        else {
            //non #1 song titles and lines 
            stroke(255);
            strokeWeight(1);
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
    width="300" height="60" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    }
    return "";
}
