// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;

// an array for Japanese deaths
//var deaths;

// minimum and maximum values for magnitude, depth
// var magnitudeMin, magnitudeMax;
// var depthMin, depthMax;

// minimum and maximum values for Japanese deaths
var deathMin, deathMax;

// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table;

//JapanTable as the data set 
var japanTable;

// my leaflet.js map
var mymap;

function preload() {
    // load the CSV data into our `table` and `japanTable` variables and clip out the header row
    table = loadTable("data/all_month.csv", "csv", "header");
    japanTable = loadTable("data/japan_major_quakes.csv", "csv", "header");
}

console.log(japanTable);


function setup() {
    // first, call our map initialization function (look in the html's style tag to set its dimensions)
    setupMap()
    magnitudeMax = getColumnMax("mag");
    // next, draw our p5 diagram that complements it
    createCanvas(1920, 600);
    background(0);
    
    // draw text for titles and bar chart 
    fill(255, 255, 255);
    noStroke()
    textSize(20)
    textFont("Avenir");
    text(`JAPAN'S DEADLIEST EARTHQUAKES 1900-PRESENT VS. CURRENT GLOBAL SEISMIC ACTIVITY`, 20, 30)
    textSize(16)
    text(`Japan's deadliest quakes`, 1170, 25)
    text(`Monthly global quakes`, 1420, 25)
    text(`DEADLIEST EARTHQUAKES WORLDWIDE 1900-PRESENT`, 20, 250)
    text(`There have been ${table.getRowCount()} global \nSeismic events this month`, 20, 60)
    text(`Largest Magnitude: ${getColumnMax("mag")}`, 20, 100)
    text(`2011 Tohoku earthquake, Japan's \nlargest-recorded Seismic event \nMagnitude: 9.0`, 20, 140);
    text(`Tangshan, China, 1976. 242,000 dead`, 20, 287)
    text(`Haiti, 2010. 222,570 dead`, 20, 312) 
    text(`Nanchang, China, 1927. 200,000 dead`, 20, 337) 
    text(`Haiyuan, China, 1920. 180,000 dead`, 20, 362)
    text(`Sumatra, Indonesia, 2004. 165,700 dead`, 20, 387)
    fill("#FFDB0D");
    text(`Kanto, Japan, 1923. 142,000 dead`, 20, 412)
    fill(255,255,255);
    text(`Ashgabat, Turkmenistan. 1948. 110,000 dead`, 20, 437)
    text(`Szechuan, China, 2008. 87,480 dead`, 20, 462)
    text(`Messina, Italy, 1908. 75,000 dead`, 20, 487)
    text(`Muzaffarabad, Pakistan, 2005. 73,340 dead`, 20, 512)
    textSize(12)
    text(`Sources: US Geological Survey, Japan Meteorological Agency, Statista`, 20, 590)


    // draw one circle for largest weekly quake and one for Japan's largest-recorded quake 
    fill("#FE2412");
    ellipse(350, 70, magnitudeMax * 6);
    fill("#FFDB0D");
    ellipse(350, 150, 54, 54);
    
    //draw key circles
    fill("#FFDB0D");
    ellipse(1150, 20, 20);
    fill("#FE2412");
    ellipse(1400, 20, 20);

    
    // draw bar chart for deadliest worldwide quakes 
    fill("#FE2412");
    rect(350, 275, 242*2, 20);
    rect(350, 300, 226*2, 20);
    rect(350, 325, 200*2, 20);
    rect(350, 350, 180*2, 20);
    rect(350, 375, 166*2, 20);
    fill("#FFDB0D");
    rect(350, 400, 142*2, 20);
    fill("#FE2412");
    rect(350, 425, 110*2, 20);
    rect(350, 450, 87*2, 20);
    rect(350, 475, 75*2, 20);
    rect(350, 500, 73*2, 20);
}

function setupMap(){
    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map').setView([38.00, 139.50], 3.0);
/*
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
*/
    // load a set of map tiles – choose from the different providers demoed here:
    // https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    apikey: '84f79b907f8c451d880219e3f07bbd73',
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZGFuZ3J1bmViYXVtIiwiYSI6ImNqbzM3dGh3bDB1ZXgzdnBoNjl3MDM4ZnQifQ.qT8VydwK8OtqWCYUUcaSIQ'
    }).addTo(mymap);

    // call our function (defined below) that populates the maps with markers based on the table contents
    drawDataPoints();
}

function drawDataPoints(){


    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    //console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    // depthMin = 0.0;
    // depthMax = getColumnMax("depth");
    //console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        // create a new dot
        var circle = L.circle([latitudes[i], longitudes[i]], {
            color: 'T',      // the dot stroke color
            fillColor: '#FE2412', // the dot fill color
            fillOpacity: 0.60,  // use some transparency so we can see overlaps
            radius: magnitudes[i] * 6000


        });

        // place it on the map
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle);
    }

    panda();
}

// function removeAllCircles(){
//     // remove each circle from the map and empty our array of references
//     circles.forEach(function(circle, i){
//         mymap.removeLayer(circle);
//     })
//     circles = [];
// }

// get the maximum value within a column
function getColumnMax(columnName){
    // get the array of strings in the specified column
    var colStrings = table.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the max value by manually stepping through the list and replacing `m` each time we
    // encounter a value larger than the biggest we've seen so far
    var m = 0.0;
    for(var i=0; i<colValues.length; i++){
        if (colValues[i] > m){
            m = colValues[i];
        }
    }
    return m;

    // or do it the 'easy way' by using lodash:
    // return _.max(colValues);
}
function panda(){

//create popup text
    var tooltipText = [
"Great Kanto Earthquake, 1923. Magnitude 8.3. Intensity 6. 142,000 deaths.",
"Kita Tango Earthquake, 1927. Magnitude 7.3. Intensity 6. 3,200 deaths.",
"Sanriku earthquake, 1933. Magnitude 8.1. Intensity 5. 3,700 deaths.",
"Tottori Earthquake, 1943. Magnitude 7.2. Intensity 6. 1,100 deaths.",
"Tonankai Earthquake, 1944. Magnitude 8.1. Intensity 1,200 deaths.",
"Mikawa Earthquake, 1945. Magnitude 6.8. Intensity 5. 2,300 deaths.",
"Nankai Earthquake, 1946. Magnitude 8.1. Intensity 6. 1,400 deaths.",
"Fukui Earthquake, 1948. Magnitude 7.1. Intensity 6. 3,800 deaths.",
"Great Hanshin Earthquake, 1995. Magnitude 7.3. Intensity 7. 6,400 deaths.",
"Tohoku Earthquake, 2011. Magnitude 9.0. Intensity 7. 15,900 deaths.",

    ];

    //get the two arrays of interest from japanTable: magnitude and deaths
    magnitude = japanTable.getColumn("Magnitude");
    console.log(magnitude)

    // var deathMax = 0
    // deaths = japanTable.getColumn("Deaths");
    // deaths = deaths.map(function(str){
    //     var num = parseInt(str, 10)
    //     deathMax = Math.max(deathMax, num)
    //     return num
    // })
    // let max = 0;

    // for (let d=0;d<deaths.length;d++) {
        
    //     let deathCount = deaths[d];
    //     // console.log(deathCount,max,deathCount>max)
    //     if (deathCount > max) {
    //         max = deathCount;
    //     }
    //     console.log(max);
    // }

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("Magnitude");
    // console.log('magnitude range:', [magnitudeMin, magnitudeMax]);

    //get the latlongs 
    latitudes = japanTable.getColumn("Latitude");
    longitudes = japanTable.getColumn("Longitude");

    // var palette = Brewer.sequential('YlOrRd', Infinity, 0, deathMax);
    // console.log(deathMax);
    // console.log(deaths);
    //intensity [1] = 3;    
    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<magnitude.length; i++){
        // create a new dot
     //   var color = palette.colorForValue(deaths[i]);

        // console.log(deaths[i]);
        var circle = L.circle([latitudes[i], longitudes[i]], {
            color: 'T',      // the dot stroke color
            fillColor: '#FFDB0D', // the dot fill color
            fillOpacity: 0.60,  // use some transparency so we can see overlaps
            radius: magnitude[i] * 6000
        });
        
    
 //   circle.bindpopup(L.popup().setContent(latitudes[i]+' '+longitudes[i])); 
var tooltip1 = L.tooltip()
    .setLatLng([35.10, 139.50])
    .setContent(tooltipText[i])
  //  .openOn(mymap);
   circle.bindTooltip(tooltip1);
// var popup2 = L.popup()
//     .setLatLng([35.59, 134.89])
//     .setContent("Kita Tango earthquake, 1923. Magnitude 7.3. Intensity 6. 3,200 deaths.")
//     .openOn(mymap);

        // place it on the map
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle)
    }
}



