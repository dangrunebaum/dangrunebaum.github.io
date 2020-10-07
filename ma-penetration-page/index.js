const dataPromise = d3.csv("./noJuly20.csv");
const mapPromise = d3.json("./us.json");
Promise.all([dataPromise, mapPromise]).then(function (values) {
  ready(values)
});

function ready([data, map]) {
  // States defined here
  const stateName = "New York";

  // Subgroups from csv header = Eligibles, Enrolled (for stacking), y axis   
  var subgroups = data.columns.slice(9, 11)
  const s0 = subgroups[0];
  const s1 = subgroups[1];
  // console.log(subgroups)
  // Groups = monthly periods that define X axis
  var groups = d3.map(data, function (d) { return (d["Report Period"]) }).keys()
  // console.log(groups)
  groups = groups.filter(g => g !== "")//filter out empty strings from monthly periods 
  filteredData = data.filter(d => d["State Name"] === stateName)//include only data for Alabama
  // cleaned data array
  const toBeData = [];
  let yMax = 0;//yMax will be the total largest sum of Eligibles and Enrolled 
  let maxEligibles = 0;
  let maxEnrolled = 0;
  let minEnrolled;
  for (let group of groups) {
    const sums = {
      [s0]: 0,
      [s1]: 0
    }

    filteredData.filter(d => d["Report Period"] === group //value is array of data filtered for one period
      && (d[s0] !== ""
        || d[s1] !== ""))
      .forEach(d => {//create sums with 2 numbers, one for each subgroup for all groups
        if (d[s0] === "" || d[s1] === "") return;//if empty skip
        if (d[s0] === " * " || d[s1] === " * ") return;//if asterisk skip
        if (typeof d[s0] === "number") {// if number add 
          sums[s0] += d[s1];
        }
        else
          sums[s0] += parseInt(d[s0].replaceAll(",", "").trim());//remove comma
        if (typeof d[s1] === "number") {//if number add 
          sums[s1] += d[s0];
        }
        else
          sums[s1] += parseInt(d[s1].replaceAll(",", "").trim());
        if (group === "") {
          console.error(d);
        }
      })
    const thisSum = sums[s0] + sums[s1]//take sum at each step
    yMax = (yMax < thisSum) ? thisSum : yMax //choose between values depending on yMax
    maxEligibles = (maxEligibles < sums[s0]) ? sums[s0] : maxEligibles
    maxEnrolled = (maxEnrolled < sums[s1]) ? sums[s1] : maxEnrolled
    minEnrolled = (maxEnrolled > sums[s1]) ? sums[s1] : minEnrolled //check!
    toBeData.push({ Period: group, ...sums })
  }
  console.log({ yMax });
  console.log({ minEnrolled });

  d3.selectAll(".state")
    .append("text")
    .html(stateName)

  var formattedmaxEnrolled = d3.format(",.2r")(maxEnrolled)
  d3.selectAll(".enrolled")
    .append("text")
    .html(formattedmaxEnrolled)

  var formattedmaxEligibles = d3.format(",.2r")(maxEligibles)
  d3.select("#eligibles")
    .append("text")
    .html(formattedmaxEligibles)

  var formattedminEnrolled = d3.format(",.2r")(minEnrolled)
  d3.select("#minEnrolled")
    .append("text")
    .html(formattedminEnrolled)

  // Bar chart /////////////////////


  var margin = { top: 10, right: 30, bottom: 50, left: 80 },
    width = 800 - margin.left - margin.right,
    height = width * 0.6 - margin.top - margin.bottom;

  // append the svg object to the bars div
  var svg = d3.select("#bars")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Append Div for tooltip to SVG
  var tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add X axis
  var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.1])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat((interval, i) => {
      return i % 3 !== 0 ? " " : interval;
    }).tickSizeOuter(0))
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .style("font-weight", 700)
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");


  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

  svg.append("g")
    .style("font-weight", 700)
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup (Eligibles, Enrolled)
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#6d53dc', '#ab91c4'])

  //stack the data per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (toBeData)

  // Draw the bars
  svg.append("g")
    .selectAll("g")
    // Enter the stacked data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) { return color(d.key); })
    .selectAll("rect")
    // loop subgroup by subgroup (Eligibles, Enrolled) to add all rectangles
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("x", function (d) { return x(d.data.Period); })//draws correctly
    .attr("y", function (d) { return y(d[1]); })
    .attr("height", function (d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())

    .on("mouseover", function (d) {
      var eligibles = d.data[" Eligibles "];
      var enrolled = d.data[" Enrolled "];
      tooltipDiv.transition()
        .duration(100)
        .style("opacity", 1.0);
      tooltipDiv.html(
        "Enrolled" + ": " + enrolled + "<br>"
        + "Eligibles" + ": " + eligibles + "<br>"
        + d.data.Period)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 48) + "px")
      d3.select(this).attr('class', 'highlight');
      d3.select(this)
        .transition()     // adds animation
        .duration(400)
        .attr('stroke', 'black');
    })

    // fade out tooltip on mouse out               
    .on("mouseout", function (d) {
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0)
      d3.select(this).attr('class', 'bar');
      d3.select(this)
        .transition()     // animate mouseout 
        .duration(400)
        .attr('stroke', 'none')
      d3.selectAll('.val')
        .remove();
    });

  // Map /////////////////////

  const mapWidth = window.innerWidth * 0.7;
  const mapHeight = window.innerHeight * 0.7;

  var projection = d3.geoAlbers()
    .scale(1000)
    .translate([mapWidth / 2, mapHeight / 2]);

  var path = d3.geoPath()
    .projection(projection);

  var mapSvg = d3.select("#map").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight)
    .style("background-color", "#F0F8FF")
    .call(d3.zoom().on("zoom", function () {
      mapSvg.attr("transform", d3.event.transform)
    }))
    .append("g")
    
    
    mapSvg.append("text")
      .attr("y", 50)
      .attr("x", 50)
      .text("Scroll to zoom");
  console.log(data)
  var countyByFips = {};
  var penetrationByFips = {}; // Create empty object for holding dataset
  data.forEach(function (d) {
    countyByFips[d.FIPS] = d["County Name"] // Create property for each ID, give it county name
    penetrationByFips[d.FIPS] = d.Penetration === "" ? 0 : d.Penetration; // Create property for each ID, give it value from penetraton rate
  });
  // console.log(penetrationByFips);
  console.log(countyByFips)
  console.log(penetrationByFips)
  var color = d3.scaleThreshold()
    .domain([0.1, 0.2, 0.3, 0.4, 0.5])
    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

  mapSvg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(map, map.objects.counties).features) // Bind TopoJSON data elements
    .enter().append("path")
    .attr("d", path)
    .style("fill", function (d) {
      return color(
        parseFloat(penetrationByFips[d.id]) / 100); // get rate value for property matching data ID
      // pass rate value to color function, return color based on domain and range
    })

    .on("mouseover", function (d) {
      tooltipDiv.transition()
        .duration(100)
        .style("opacity", 1.0);
      d3.select(this).attr('class', 'highlight');
      d3.select(this)
        .transition()     // adds animation
        .duration(400)
        .attr('stroke', 'black')
      tooltipDiv.html(
        // set text to the matching map county id
        countyByFips[d.id] + " County" + '<br>' +
        "Penetration Rate" + ": " + penetrationByFips[d.id])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 48) + "px");
      console.log(parseFloat(penetrationByFips[d.id]) / 100)
    })

    // fade out tooltip on mouse out               
    .on("mouseout", function (d) {
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0)
      d3.select(this).attr('class', 'bar');
      d3.select(this)
        .transition()     // animate mouseout 
        .duration(400)
        .attr('stroke', 'none')
      d3.selectAll('.val')
        .remove();
    });

  // Table /////////////////////

  const table = d3.select("#table")
  const numberOfRows = 254
  // const colorScale = d3.scaleLinear()
  //   .domain([0, 70])//use d3.Max to get max penetration value 
  //   .range(["#f2f0f7", "#b6b6d1"]);

  filteredData = filteredData.filter(d => d["Report Period"] === "Jun-20")

  const columns = [
    {
      label: "County Name", type: "text", format: d => d["County Name"]
    },
    {
      label: "Eligible", type: "number", format: d => d[" Eligibles "]
    },
    {
      label: "Enrolled", type: "number", format: d => d[" Enrolled "]
    },
    {
      label: "Penetration Rate", type: "number", format: d => d.Penetration, background: d => color(
        parseFloat(d.Penetration) / 100)
    },
  ]

  table.append("thead").append("tr")
    .selectAll("thead")
    .data(columns)
    .enter().append("th")
    .text(d => d.label)
    .attr("class", d => d.type)

  const body = table.append("tbody")

  filteredData.slice(0, numberOfRows).forEach(d => {
    body.append("tr")
      .selectAll("td")
      .data(columns)
      .enter().append("td")
      .text(column => column.format(d))
      .attr("class", column => column.type)
      .style("background", column => column.background && column.background(d))
      .style("transform", column => column.transform && column.transform(d))
  })

}