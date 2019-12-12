
// load data in preload 
// in setup, loop through Culture column and clean and sort by value cString.g. "Chinese"
// count how many for each value
// sort by value
// only keep rows with top 10 value for Culture column  
// create data structure with only Culture, count and Object End Date values: {culture: Chinese, years: [1204, 1245, 1324, etc.]}
// bin dates by century?
// deal with BC (indicated with a "-") and AD dates
// save earliest and last dates for X axis
// draw lines and fills for each Culture object
// draw X and Y axes, marks, labels, key and title/subtitle 
// add tooltip and animate bar graph 

var marginTop = 150;
var marginLeft = 125;
var marginRight = 20;
var marginBottom = 30;
var graphWidth = 900;
var graphHeight = 500;
let dataShown;
var scale;
let data;
const colorArray = ["#CA99C6", "#62525F", "#E3CD9C", "#2D3029", "#5D0D00", "#C58663", "#DEA95B", "#FF7A42", "#FFD0B0", "#DE5744"];
let fr = 480; //start frame per second
let rectX = 0; //initialize rectX
let rectY = 0;
let rectZ = 0;
let rectA = 0;
let rectB = 0;
let rectC = 0;
let rectD = 0;
let rectE = 0;
let rectF = 0;
let rectG = 0;
//declare variable for csv 
let table;
let topTen;

//capture counts for unique culture names 
const o_cultures = {};

//declare variables for minYears, maxYears
let minYear;
let maxYear;

function preload() {

  //load table 
  table = loadTable("./metobjects-sorted.csv", "csv", "header");
  //consoleString.log(table);
}

function setup() {
  frameRate(fr); //attempt to refresh at starting FPS

  //data for transforming single values to other values 
  const nameMap = {
    Japan: "Japanese",
    India: "Indian",
    China: "Chinese"
  };
  //function for processing culture strings 
  function getStandardCulture(cString) {

    if (cString !== "" //cannot contain empty strings 
      && cString.indexOf("?") === -1 //cannot contain question mark 
      && cString.indexOf(" or ") === -1 //cannot contain or
      && cString.indexOf(" and ") === -1)//cannot contain and
    {
      let comma = cString.indexOf(","); //truncate string at comma
      if (comma !== -1) {
        cString = cString.substring(0, comma);
      }
      let semi = cString.indexOf(";"); //truncate string at semicolon 
      if (semi !== -1) {
        cString = cString.substring(0, semi);
      };

      let open = cString.indexOf(" (");//truncate string at " ("  
      if (open !== -1) {
        cString = cString.substring(0, open);
      };

      if (nameMap[cString]) { //transform repetitive culture values to alternative values 
        cString = nameMap[cString];
      }
      return cString;
    }
    else return null;
  }
  // process every culture string 	
  table.getRows().forEach(row => {
    e = row.getString("Culture");
    e = getStandardCulture(e);
    if (e === null) return;

    // if not empty create entry 
    if (!o_cultures[e]) {
      o_cultures[e] = 0; //initialize to 0
    }
    if (row.getNum("Object End Date") > 2019) return;
    o_cultures[e]++; //add 1

  });

  const counts = //create array of cultures and counts 

    Object.keys(o_cultures).map(
      (key) => [key, o_cultures[key]]
    );

  counts.sort(byCultureCount); //sort array descending 
  function byCultureCount(a, b) {
    return b[1] - a[1];
  }

  let topTen = counts.slice(0, 10);

  console.log(topTen);

  //create object for filtering rows in table by being in top ten cultures 
  let o_topTen = {};
  topTen.forEach(
    (element) => o_topTen[element[0]] = true
  );
  let minYear = Infinity;
  let maxYear = 0;

  // figure min and max year for topTen cultures 
  table.getRows().forEach(

    (row, index) => {

      let culture = row.getString("Culture");
      culture = getStandardCulture(culture);
      if (culture === null) return;
      if (o_topTen[culture]) {
        //			console.log(culture);
        let year = row.getNum('Object End Date');
        if (minYear > year) minYear = year;
        if (maxYear < year) maxYear = year;

      }
    }
  );
  // include all years beyond 2019
  if (maxYear > 2019) maxYear = 2019;

  //transform years to centuries 
  function toCentury(year) {
    return Math.round(year / 100);
  }

  //console.log({minYear, maxYear});

  const minCentury = toCentury(minYear);
  const maxCentury = toCentury(maxYear);

  //console.log(minCentury, maxCentury);

  //create century array from table 
  const centuryArray = [];
  table.getRows().forEach(

    (row, index) => {

      let culture = row.getString("Culture");
      culture = getStandardCulture(culture);
      if (culture === null) return;
      if (o_topTen[culture]) {
        //			console.log(culture);
        let year = row.getNum('Object End Date');
        if (year > 2019) return;
        //calculate century as zero based from min to max
        let century = toCentury(year) - minCentury;

        // initialize century array for first time we see century 
        if (centuryArray[century] === undefined) {
          centuryArray[century] = {
            cultureCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            total: 0,
            century: century + minCentury
          }

        } 	// count centuries 
        let cIndex = -1;
        for (let i = 0; cIndex === -1; i++) {
          if (culture === topTen[i][0]) cIndex = i;
        }

        centuryArray[century].cultureCounts[cIndex]++;
      }
    }
  );

  data = centuryArray;

  //basic draw tasks 
  createCanvas(2100, 1500);
  background(255);
  //  var x = 125
  var y = 150

  //draw background rectangle
  noStroke();
  fill("#eeeeee");
  rect(marginLeft,
    marginTop + 420 + graphHeight + 40,
    graphWidth + 600,
    -graphHeight - 60
  )

  for (var i = 0; i < 10; i++) {
    noStroke();
    fill(colorArray[i]);
    // rect(marginLeft, y + 30, topTen[i][1]*0.035, 20);
    textFont("Avenir");
    textStyle(BOLD);
    textAlign(RIGHT);
    textSize(20);
    text(topTen[i][0], marginLeft - 10, y + 45);
    let val = topTen[i][1];
    text(val, 1200, y + 48);

    y += 25
  }
  fill(255, 0, 0);
  rect(0, 0, 2200, 100);
  textStyle(NORMAL);
  textAlign(LEFT);
  textSize(50);
  fill("white");
  textFont("Bodoni");
  text("The Met: A Culture Timeline", 125, 62);
  textFont("Avenir");
  textSize(20);
  textStyle(BOLD);
  fill("black");
  text("145338 total objects", 1129, 448);
  textStyle(NORMAL);
  textSize(25);
  text("Top 10 Cultures in the Collection of the Metropolitan Museum of Art, by Object", 125, marginTop + 20);
  text("Top 10 Cultures by Percent over Time, 5000 BC to Present", 125, marginTop + 390);
  text("The vast size of the Metropolitan Museum of Art's collection presented the opportunity to utilize it as a lens for understanding the \ninteraction of civilizations over time. The goal of this project was to learn if its almost 500,000 objects contained a hidden story that could be \nuncovered with visualization techniques.The Top 10 Cultures represent 145,338 objects, or about one-third of the Met's Collection.", 125, marginTop + 1030);
  textSize(15);
  text("Century Units", 125, marginTop + 980);

  // d is an object that contains century and cultureCounts fields 
  data = data.map((d) => {
    if (d === undefined) return d;
    d.total = d.cultureCounts.reduce((agg, v) => agg + v, 0); //adds values in array. starts at zero, returns sum of array 
    d.cultureCounts = d.cultureCounts.map((v) => v * 100 / d.total);//replace culture counts with mapping of values into percentages
    return d;//returns d or data with 2 new fields modified 
  });
  //   console.log(JSON.stringify(data, null, 4));

  draw1()
}

function draw1() {
  let drawn = false;
  //put data into arrays
  const centuries = data.map((x) => {
    return (x) ? x.century : null; //take each value from data, if  null return null 
  });
  const measures = data.map((x) => {
    return (x) ? x.cultureCounts : null; //take each value from data, if  null return null 
  });
  dataShown = measures;
  const vmax = 10;//length of cultureCounts arrays = 10


  //draw vertical axis
  scale = 10;
  let spacing = 50;
  line(marginLeft + spacing, marginTop + 420, marginLeft + spacing, marginTop + 420 + graphHeight);
  //10 ticks, spaced 50px apart
  var vTickScale = scale / 10; //each tick translates to this much increase in rating
  textAlign(CENTER, CENTER);
  for (var t = 0; t <= 10; t += 1) {
    line(marginLeft + spacing - 5,
      marginTop + 420 + graphHeight - spacing * t,
      marginLeft + spacing + 5,
      marginTop + 420 + graphHeight - spacing * t);
    textSize(16);
    text(vTickScale * t * 10, marginLeft + spacing - 25, marginTop + 420 + graphHeight - spacing * t);
  }

  //draw horizontal axis
  line(marginLeft + spacing,
    marginTop + 420 + graphHeight,
    marginLeft + spacing + graphWidth,
    marginTop + 420 + graphHeight);
  var hTickInt = 20; graphWidth / (centuries.length);
  spacing = 50;
  textSize(16);

  //ticks and text
  for (let t = 0; t < centuries.length; t++) {

    if (centuries[t] === undefined) continue;
    fill(0);
    stroke(0);
    line(marginLeft + spacing + t * hTickInt + hTickInt / 2,
      marginTop + 420 + graphHeight,
      marginLeft + spacing + t * hTickInt + hTickInt / 2,
      marginTop + 420 + graphHeight + 5);
    if (centuries[t] <= -25 || Math.abs(centuries[t]) % 2 === 1)//
      text(
        vTickScale * centuries[t],
        marginLeft + spacing + t * hTickInt + hTickInt / 2,
        marginTop + 420 + graphHeight + 25);
    let prev = 0;
    const delta = 20;
    const barwidth = 1.0;
    const width = barwidth * hTickInt;
    noStroke();
    const x1 = marginLeft + spacing + t * hTickInt - barwidth * hTickInt / 2 + hTickInt / 2;//bottom of graph 

    for (v = 0; v < vmax; v++) { //loop through cultures 
      fill(colorArray[v]);
      const y1 = marginTop + 400 + delta + graphHeight + prev;//prev is used to start this bar above previous bar 
      const height = -spacing * dataShown[t][v] / scale;
      prev += height;//remember top of last bar in order to draw bottom of next bar 

      if (height !== 0) {
        rect(
          x1,
          y1,
          width,
          height
        );

        //create divs for popup and tooltip
        if (!drawn) {
          let div = $("<div/>");
          div.css("position", "absolute").css("top", 569).css("left", x1 - 1).width(width).height(499);
          div.attr("century", centuries[t]);
          div.attr("total", data[t].total);
          div.hover(over, out);
          //              div.css("background", "red");
          $("body").append(div);
        }
        //drawn = true;
      }
    };
  }
  //create tooltip    
  function over(e) {
    // console.log("over", $(this).attr ("century"), $(this).attr("total"));
    let pos = $(this).position();
    console.log(pos);
    $(".tooltip").html(`Century: ${$(this).attr("century")}<br/>Objects: ${$(this).attr("total")}`).show();
    $(".tooltip").css("top", e.pageY + 5).css("left", pos.left + 5);
    $(this).addClass("wb");
  }
  function out() {
    $(".tooltip").hide();
    $(this).removeClass("wb");
  };

  translate(100, 0);
  rotate(PI / 2);
  translate(150, -100);
  rotate(PI / 2); //is added
  translate(0, -200);
  fill("black");
  rotate(PI / 2); //is added
  text("Percent", -475, -90);
  translate(250, 0);
  rotate(PI / 2); //is added
}

function draw() {
//animated bar chart
  var y = 145;
  rectX += 1; //move bar
  if (rectX >= 28141 * 0.035) {
    rectX = 28141 * 0.035;
  }
  noStroke();
  fill(colorArray[0])
  rect(marginLeft, y + 35, rectX, 20);
  y += 25;

  rectY += 1;
  if (rectY >= 22633 * 0.035) {
    rectY = 22633 * 0.035;
  }
  fill(colorArray[1])
  rect(marginLeft, y + 35, rectY, 20);
  y += 25;

  rectZ += 1;
  if (rectZ >= 22346 * 0.035) {
    rectZ = 22346 * 0.035;
  }
  fill(colorArray[2])
  rect(marginLeft, y + 35, rectZ, 20);
  y += 25;

  rectA += 1;
  if (rectA >= 20500 * 0.035) {
    rectA = 20500 * 0.035;
  }
  fill(colorArray[3])
  rect(marginLeft, y + 35, rectA, 20);
  y += 25;

  rectB += 1;
  if (rectB >= 15667  * 0.035) {
    rectB = 15667 * 0.035;
  }
  fill(colorArray[4])
  rect(marginLeft, y + 35, rectB, 20);
  y += 25;

  rectC += 1;
  if (rectC >= 10230  * 0.035) {
    rectC = 10230  * 0.035;
  }
  fill(colorArray[5])
  rect(marginLeft, y + 35, rectC, 20);
  y += 25;

  rectD += 1;
  if (rectD >= 10163  * 0.035) {
    rectD = 10163  * 0.035;
  }
  fill(colorArray[6])
  rect(marginLeft, y + 35, rectD, 20);
  y += 25;

  rectE += 1;
  if (rectE >= 7334  * 0.035) {
    rectE = 7334  * 0.035;
  }
  fill(colorArray[7])
  rect(marginLeft, y + 35, rectE, 20);
  y += 25;

  rectF += 1;
  if (rectF >= 5427 * 0.035) {
    rectF = 5427 * 0.035;
  }
  fill(colorArray[8])
  rect(marginLeft, y + 35, rectF, 20);
  y += 25;

  rectG += 1;
  if (rectG >= 2897 * 0.035) {
    rectG = 2897 * 0.035;
  }
  fill(colorArray[9])
  rect(marginLeft, y + 35, rectG, 20);
  y += 25;
}
