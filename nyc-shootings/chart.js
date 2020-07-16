
// For each year and season, how many shootings are there in each borough 

var ny;
async function drawHeatmap() {

  let dataset = await d3.csv("./NYPD_Shooting_Incident_Data__Historic_.csv")
  console.log(dataset)

  var bronxCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var brooklynCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var manhattanCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var queensCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var siCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  ny = [bronxCounter, brooklynCounter, manhattanCounter, queensCounter, siCounter];//array of arrays
  console.log(ny);
  const boroughs = {"BRONX": 0, "BROOKLYN": 1, "MANHATTAN": 2, "QUEENS": 3, "STATEN ISLAND": 4};//borough keys 

  dataset.forEach(function (d) {
    var boro = d.BORO;
    var date = d.OCCUR_DATE;
    var year = date.substr(6, 9)
    ny[boroughs[boro]][year - 2006]++; //ny[borough array number[calculate borough array number from]][year offset from 2006]

  });
  // console.log(bronxCounter);

  seasonCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  dataset.forEach(function (d) {
    var date = d.OCCUR_DATE;
    var year = date.substr(6, 9);
    var month = date.substr(0, 2);

    if (month > "0" && month <= "03") { //for q1 increment year's count by one  
      seasonCounter[(year - 2006) * 4]++
    }
    if (month > "03" && month <= "06") {
      seasonCounter[(year - 2006) * 4 + 1]++
    }
    if (month > "06" && month <= "09") {
      seasonCounter[(year - 2006) * 4 + 2 ]++
    }
    if (month > "09" && month <= "12") {
      seasonCounter[(year - 2006) * 4 + 3]++
    }

  });
  console.log(seasonCounter)

  let dimensions = {
    width: window.innerWidth * 0.99,
    height: 620,
    margin: {
      top: 25,
      right: 15,
      bottom: 40,
      left: 110,
    },
  }

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)


  var heatmap = bounds.append("svg")
    .attr("class", "heatmap")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)
    .selectAll("g")
    .data(bronxCounter)
    .enter()
    .append("g")
    .attr("transform", function (d, i) { return "translate(" + i * 100 + ", 25)"; });

  heatmap.append("rect")
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    .style("fill", function (d, i) { return "hsl(" + (100 - bronxCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 100)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    .style("fill", function (d, i) { return "hsl(" + (100 - brooklynCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 200)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    .style("fill", function (d, i) { return "hsl(" + (100 - manhattanCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 300)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    .style("fill", function (d, i) { return "hsl(" + (100 - queensCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 400)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    .style("fill", function (d, i) { return "hsl(" + (100 - siCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("text")
    .attr("x", 30)
    .attr("y", 50)
    .style("fill", "white")
    .text(function (d, i) { return bronxCounter[i] })

  heatmap.append("text")
    .attr("x", 30)
    .attr("y", 150)
    .style("fill", "white")
    .text(function (d, i) { return brooklynCounter[i] })

  heatmap.append("text")
    .attr("x", 30)
    .attr("y", 250)
    .style("fill", "white")
    .text(function (d, i) { return manhattanCounter[i] })

  heatmap.append("text")
    .attr("x", 30)
    .attr("y", 350)
    .style("fill", "white")
    .text(function (d, i) { return queensCounter[i] })

  heatmap.append("text")
    .attr("x", 30)
    .attr("y", 450)
    .style("fill", "white")
    .text(function (d, i) { return siCounter[i] })

  legendYears = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
  heatmap.append("text")
    .data(legendYears)
    .attr("class", "legend-years")
    .attr("x", 30)
    .attr("y", -15)
    .attr("dy", ".35em")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text(function (d) { return d; });

  // legendBoros = ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]
  wrapper.append("text")
    .attr("class", "legend-boros")
    .attr("x", 100)
    .attr("y", 100)
    .attr("text-anchor", "end")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text("Bronx")

  wrapper.append("text")
    .attr("class", "legend-boros")
    .attr("x", 100)
    .attr("y", 200)
    .attr("text-anchor", "end")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text("Brooklyn")

  wrapper.append("text")
    .attr("class", "legend-boros")
    .attr("x", 100)
    .attr("y", 300)
    .attr("text-anchor", "end")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text("Manhattan")

  wrapper.append("text")
    .attr("class", "legend-boros")
    .attr("x", 100)
    .attr("y", 400)
    .attr("text-anchor", "end")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text("Queens")

  wrapper.append("text")
    .attr("class", "legend-boros")
    .attr("x", 100)
    .attr("y", 500)
    .attr("text-anchor", "end")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text("Staten Island")


  let dimensions2 = {
    width: window.innerWidth * 0.99,
    height: 160,
    margin2: {
      top: 5,
      right: 15,
      bottom: 0,
      left: 110,
    },
  }

  dimensions2.boundedWidth = dimensions2.width
    - dimensions2.margin2.left
    - dimensions2.margin2.right
  dimensions2.boundedHeight = dimensions2.height
    - dimensions2.margin2.top
    - dimensions2.margin2.bottom

  const wrapper2 = d3.select("#wrapper2")
    .append("svg")
    .attr("width", dimensions2.boundedWidth)
    .attr("height", dimensions2.boundedHeight)

  const bounds2 = wrapper2.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)


  var seasonMap = bounds2.append("svg")
    .attr("class", "seasonMap")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)
    .selectAll("g")
    .data(seasonCounter)
    .enter()
    .append("g")
    .attr("transform", function (d, i) { return "translate(" + i * 25 + ", 5)"; });

  seasonMap.append("rect")
    .attr("width", 25)
    .attr("height", 100)
    .style("stroke", "none")
    .style("fill", function (d, i) { return "hsl(" + (100 - seasonCounter[i] / 10) + ", 60%, 50%)" })

  legendYears = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
  seasonMap.append("text")
    .data(legendYears)
    .attr("class", "legend-years")
    .attr("x", function (d, i) { return 30 + i * 75; })
    .attr("y", 115)
    .attr("dy", ".35em")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text(function (d) { return d; });

  wrapper2.append("text")
    .attr("class", "legend-boros")
    .attr("x", 100)
    .attr("y", 90)
    .attr("text-anchor", "end")
    .style("fill", "#8090a1")
    .style("font-weight", "bold")
    .text("All Boroughs")


  yearCounter = [0, 0, 0, 0]
  dataset.forEach(function (d) {

    var date = d.OCCUR_DATE;
    var month = date.substr(0, 2);

    if (month > "0" && month <= "03") {
      yearCounter[0]++
    }
    if (month > "03" && month <= "06") {
      yearCounter[1]++
    }
    if (month > "06" && month <= "09") {
      yearCounter[2]++
    }
    if (month > "09" && month <= "12") {
      yearCounter[3]++
    }

  });
  console.log(yearCounter);

  // 6. Draw annual fluctuation 
  const colorScale = d3.scaleLinear()
    .domain(yearCounter)
    .range(["hsl(" + (100 - (4028 / 120)) + ", 60%, 50%)", "hsl(" + (100 - (6061 / 120)) + ", 60%, 50%)", "hsl(" + (100 - (7284 / 120)) + ", 60%, 50%)", "hsl(" + (100 - (5002 / 120)) + ", 60%, 50%)"])

  const wrapper3 = d3.select("#wrapper3")
    .append("svg")
    .attr("width", 1500)
    .attr("height", 150)

  const legendGroup = wrapper3.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  const defs = legendGroup.append("defs")
  const legendGradientId = "legend-gradient"
  // const gradient = 
  defs.append("linearGradient")
    .attr("id", legendGradientId)
    .selectAll("stop")
    .data(colorScale.range())
    .enter().append("stop")
    .attr("stop-color", d => d)
    .attr("offset", (d, i) => `${
      i * 100 / 3
      }%`)

  const legendWidth = 1400
  const legendHeight = 100

  legendGroup.append("rect")
    .attr("x", -20)
    .attr("height", legendHeight)
    .attr("width", legendWidth)
    .style("fill", `url(#${legendGradientId})`)

  legendGroup.append("text")
    .attr("class", "legend-boros")
    .attr("x", 150)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text("Winter")

  legendGroup.append("text")
    .attr("class", "legend-boros")
    .attr("x", 500)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text("Spring")

  legendGroup.append("text")
    .attr("class", "legend-boros")
    .attr("x", 850)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text("Summer")

  legendGroup.append("text")
    .attr("class", "legend-boros")
    .attr("x", 1200)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text("Fall")

}

drawHeatmap()