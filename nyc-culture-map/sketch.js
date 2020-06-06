// an array for lat & long
var latitudes, longitudes;

// dots for the map
var circles = {};

var points = {};

var circle;

// table as the data set
var table;

// my leaflet.js map
var mymap;

//set dot fill color 
var ellipseColor;

var disciplines;

var layers = {};

var discipline;

var selectedGroup;

var div2;

colorObject = {
    "Architecture/Design": "#A83E38",
    "Botanical": "#B84E3D",
    "Crafts": "#C15F44",
    "Dance": "#BF7540",
    "Film/Video/Audio": "#C18F44",
    "Folk Arts": "#C2A947",
    "Humanities": "#C2BE47",
    "Literature": "#9BC144",
    "Multi-Discipline": "#73BF40",
    "Museum": "#40BF55",
    "Music": "#40BF97",
    "New Media": "#40B5BF",
    "Other": "#3E90BB",
    "Photography": "#3E64BB",
    "Science": "#5740BF",
    "Theater": "#8440BF",
    "Visual Arts": "#AE40BF",
    "Zoo": "#953255"
}

function preload() {
    // load CSV data into `table` and `japanTable` variables and clip out header row
    table = loadTable("data/DCLA_Cultural_Organizations.csv", "csv", "header");
}

function setup() {
    // call map initialization function (set dimensions in html style tag)
    setupMap()
    // draw p5 diagram that complements it
    // createCanvas(1920, 500);
    // background(0);
}

function setupMap() {

    // create map
    mymap = L.map('map').setView([40.75, -73.96], 13);

    // load map tiles from provider:
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

    // call function (defined below) that populates the map with markers based on table contents
    drawDataPoints();

    L.Control.textbox = L.Control.extend({
        onAdd: function (map) {
            var text = L.DomUtil.create('div');
            text.id = "info_text";
            text.innerHTML = "NYC Culture Map";
            return text;
        },

        onRemove: function (map) {
            // Nothing to do here
        }
    });
    L.Control.textbox2 = L.Control.extend({
        onAdd: function (map) {
            var text2 = L.DomUtil.create('div');
            text2.id = "info_text2";
            text2.innerHTML = "";
            return text2;
        },

        onRemove: function (map) {
            // Nothing to do here
        }
    });
    L.control.textbox = function (opts) { return new L.Control.textbox(opts); }
    L.control.textbox({ position: 'topleft' }).addTo(mymap);
    L.control.textbox2 = function (opts) { return new L.Control.textbox2(opts); }
  div2 = L.control.textbox2({ position: 'bottomleft' }).addTo(mymap);
}

function drawDataPoints() {

    // get the  arrays of interest
    orgs = table.getColumn("Organization");
    address = table.getColumn("Address");
    disciplines = table.getColumn("Discipline");
    latitudes = table.getColumn("Latitude");
    longitudes = table.getColumn("Longitude");

    // cycle through the parallel arrays and add a dot for each event with color from colorObject 
    for (var i = 0; i < disciplines.length; i++) {
        ellipseColor = colorObject[disciplines[i]];

        // create a new dot
        circle = L.circle([latitudes[i], longitudes[i]], {
            color: 'T',      // the dot stroke color
            fillColor: ellipseColor, // the dot fill color
            fillOpacity: 0.9,  // use some transparency so we can see overlaps
            radius: 30
        });
        // tooltip for cultural orgs 
        var tooltip = L.tooltip()
            .setLatLng([35.10, 139.50])
            .setContent(orgs[i] + ",  " + address[i] + ".  " + disciplines[i])
        circle.bindTooltip(tooltip);

        // if the circles object is undefined create circle object with disciplines
        // as values 
        if (circles[disciplines[i]] === undefined) {
            circles[disciplines[i]] = [];
            points[disciplines[i]] = [];
        }
        // circles object is created with disciplines as keys and
        // value is array of circles 
        circles[disciplines[i]].push(circle);
        points[disciplines[i]].push([latitudes[i], longitudes[i]]);
    }

    //loop through disciplines column
    for (let key in circles) {

        // create a layerGroup that contains all circles of each discipline 
        let layerGroup = L.layerGroup(circles[key])
        layers[key] = layerGroup;//put the values into another object called layers
        layerGroup.addTo(mymap);
    }
}

//jQuery function changes dots based on discipline selected group

$(document).ready(function () {
    $('button').click(function () {
         selectedGroup = $(this).val();

        //for keys in circles object
        for (let key in circles) {
            //remove all layers 
            mymap.removeLayer(layers[key])
        }
        //but if All Groups button is pressed add all layers 
        if (selectedGroup === "0") {
            for (let key in circles) {
                mymap.addLayer(layers[key]);
            }
            //if All Groups is pressed set div2 to empty string 
            div2._container.textContent = `${disciplines.length} Organizations`;
            div2._container.style.color = "white";
            //or else if another layer is pressed add only 
            //the layer where selectedGroup matches the key
        } else {
            mymap.addLayer(layers[selectedGroup])
            //and  set text content of div2 to selectedGroup and length of selectedGroup array in circles object
            div2._container.textContent = `${selectedGroup}: ${circles[selectedGroup].length} Organizations`;
            div2._container.style.color = colorObject[selectedGroup];
        }
    })
});