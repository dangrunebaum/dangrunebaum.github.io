/*
COMPUTE INTEREST OVER TIME AGAINST INTEREST BY REGION  
Convert timeline CSV to JSON that includes only the weekly January 1 to May 13 relative figures.
Multiply each  figure against each week's country figure in the main JSON  
to compute color. 
*/
// Examine url to check for new query params 
// const urlParams = new URLSearchParams(window.location.search)
let path, svg, projection;
// w1 is the word that drives this display, default is cosplay 
let w1 = 'coronavirus';
// document.title = `${w1} search interest`

// Range of weeks for display 
const WEEKS = {
    min: "01-01",
    max: "05-13"
}
// Axis is an array of week values in order  
const AXIS = ["01-01", "01-08", "01-15", "01-22", "01-29", "02-05", "02-12", "02-19", "02-26", "03-04", "03-11", "03-18", "03-25", "04-01", "04-08", "04-15", "04-22", "04-29", "05-06", "05-13"];
// Asynchronous function that redraws map with values for each week
// Invoked by click on play button   
const playWeeks = async function () {//v is a Vue instance 
    for (let i = 0; i < AXIS.length; i++) {

        colorByWeek(AXIS[i]);
        await sleep(1000);
    }
}

let myVue; // Vue instance for slider 

// Provide for pausing as slider moves to new weeks 
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const GREYVALUE = -1;
const GREYCOLOR = 'rgb(235,235,235)';

// Tooltip shows country and search interest for each word pair
let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<span class='details'>" + d.properties.ADMIN + "<br></span>" + "<span>Search Interest: </span><span class='details'>" + (d.interestOne === GREYVALUE ? "0" : d.interestOne) + "</span>";
    })
// Define page layout 
const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 },
    MAPWIDTH = 1440 - MARGIN.left - MARGIN.right,
    MAPHEIGHT = 750 - MARGIN.top - MARGIN.bottom;

// Perceptually appropriate orange-brown values from 
// https://colorbrewer2.org/
const cbArray = ['rgb(235,235,235)', '#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'];

function color(interest1, week) { // Interest1 is 0-1 scaled relative value of word
    if (interest1 === undefined || interest1 === GREYVALUE) {
        return GREYCOLOR;// If value unknown make grey 
    }
    // weekInterest is Google search interest relative to the highest point
    // in time for a specific week
    let weekInterest = scaledInterestByWeek.coronavirus[week]
    // Interest1 is the regional week interest
    // Interest1 is scaled up by week interest then adjusted down by 0.35 
    // to create optimum perceptual color range
    interest1 = Math.round(interest1 * weekInterest * 0.25);//may need to change scale value 
    if (interest1 >= cbArray.length) interest1 = cbArray.length - 1
    return cbArray[interest1]
}
// Draw page 
function main(w1) {
    myVue = new Vue({
        el: '#app',
        data: function () {
            return {
                value: "01-01",
                weekInterest: '0',
                data: AXIS,
                options: { // Layout and features for slider 
                    // dotSize: 14,
                    width: '70%',
                }
            }
        },
        methods: {
            update: function () { // Color by week when week selected on slider 
                console.log("value", this.value)
                void colorByWeek(this.value)
            },
            play: function () { // Play button handler 
                playWeeks()
            },
        },
        // week slider for controlling which week is mapped 
        components: {
            'vueSlider': window['vue-slider-component'],
        }
    })

    // Create svg into which map is drawn  
    svg = d3.select("map")
        .append("svg")
        .attr("width", MAPWIDTH)
        .attr("height", MAPHEIGHT)
        .append('g')
        .attr('class', 'map');
    // Use Mercator projection, scale and position map 
    projection = d3.geoMercator()
        .scale(162)
        .translate([MAPWIDTH / 2, MAPHEIGHT / 1.5]);

    path = d3.geoPath().projection(projection);

    svg.call(tip);
    // Queue up data sources; when available call ready function 
    queue()
        .defer(d3.json, "data/countries.geojson") // data (geojson)
        .defer(d3.json, `data/coronavirus-by-country.json`) // interest (pair json file)
        .await(ready);
}

let globalInterest;
let myData;
let toCode;

//add ISO values where needed 
function createToCode(geodata) {
    const to3 = [];

    geodata.features.forEach(
        (feature) => {
            to3.push([feature.properties.ADMIN, feature.properties.ISO_A3]);
        }
    );
    // Create a single js map between country names and country codes
    // This is needed because Google data uses country names and JSON data uses country codes
    // Some need to be edited for match to succeed
    const toCode = new Map(to3);
    toCode.set('United States', 'USA')
    toCode.set('Myanmar (Burma)', 'MMR')
    toCode.set('Tanzania', 'TZA')
    toCode.set('Hong Kong', 'HKG')
    toCode.set('Bosnia & Herzegovina', 'BIH')
    toCode.set('Czechia', 'CZE')
    toCode.set('Serbia', 'SRB')
    toCode.set('Côte d’Ivoire', 'CIV')
    toCode.set('Congo - Brazzaville', 'COG')
    toCode.set('Congo - Kinshasa', 'COD')
    toCode.set('Micronesia', 'FSM')
    toCode.set('Guinea-Bissau', 'GNB')
    toCode.set('Timor-Leste', 'TLS')
    toCode.set('North Macedonia', 'MKD')
    toCode.set('eSwatini', 'SWZ')
    return toCode
}
// Draw map after data is loaded 
function ready(error, data, interest) {
    globalInterest = interest;
    myData = data;
    toCode = createToCode(data);
    // Initialize interest values for every region to GREYVALUE, 
    // so missing values are treated as zero when coloring regions 
    data.features.forEach(function (d) { d.interestOne = GREYVALUE });
    svg.append("g") // Create and draw map 
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function (d) {
            return color(GREYVALUE);
        })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        // tooltip
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', function (d) {
            tip.show(d);
            d3.select(".d3-tip")
                .style("left", (d3.event.clientX + 20) + "px")
                .style("top", (d3.event.clientY - 20) + "px")
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
        })
        .on('mouseout', function (d) {
            tip.hide(d);

            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        });
    d3.select('.loading')
        .remove()
    svg.append("path")
        .datum(topojson.mesh(data.features,
            function (a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);

}
svg2 = d3.select("#graph")
.append("svg")
.attr("width", 200)
.attr("height", 100)

// .attr("top", 500)
// .attr("left", 100)

// Assign color based on keys in globalInterest 
function colorByWeek(week) {
    // Show interest out of 100
    myVue.value = week;
    myVue.weekInterest = Math.round(scaledInterestByWeek.coronavirus[week]) + ' out of 100'
    const interestOneByISO = {};
    Object.keys(globalInterest).forEach(
        countryName => {
            if (globalInterest[countryName][week] === 0)
            // Check if both values are 0, if so set to GREYVALUE
            {
                interestOneByISO[toCode.get(countryName)] = GREYVALUE
            } else {
                interestOneByISO[toCode.get(countryName)] =
                    globalInterest[countryName][week]
            }
        }
    )
    // Set interestOne property according to relative interest by week 
    myData.features.forEach(function (d) { d.interestOne = interestOneByISO[d.properties.ISO_A3] });

    d3.selectAll('.countries > path') // already drawn so select paths and set style depending on data values
        // 
        .transition()
        .duration(1000)
        .style("fill", function (d) {
            if (d.interestOne === GREYVALUE) { // are both values zero?
                return GREYCOLOR // when both values zero 
            }
            return color(d.interestOne, week); // otherwise
        })

     circle = svg2.append("circle")
        .attr("cx", 8 * AXIS.findIndex(v=>v===week) + 10)
        .attr("cy", function () { return -Math.round(scaledInterestByWeek.coronavirus[week] * .9 - 90)})
        .attr("r", 3)
        .style("fill", "#7f0000")
}
// Global interest by week 
let scaledInterestByWeek;
// Use local file with global interest data to initialize scaledInterestByWeek
fetch('data/coronavirus-weekly.json', { mode: 'no-cors' })
    .then(result => result.json())
    .then(
        (data) => {
            scaledInterestByWeek = data
            main(w1) // Display page 
        }
    )
    .catch((error) => console.log(error)) 

