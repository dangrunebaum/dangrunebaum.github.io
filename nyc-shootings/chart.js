
// For each year and season, how many shootings are there in each borough 

async function drawHeatmap() {

  let dataset = await d3.csv("./NYPD_Shooting_Incident_Data__Historic_.csv")
  console.log(dataset)

  var bronxCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var brooklynCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var manhattanCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var queensCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var siCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  dataset.forEach(function (d) {
    var boro = d.BORO;
    var date = d.OCCUR_DATE;
    var year = date.substr(6, 9)

    if (boro === "BRONX" && year === "2006") {
      bronxCounter[0] += 1
    }
    if (boro === "BRONX" && year === "2007") {
      bronxCounter[1] += 1
    }
    if (boro === "BRONX" && year === "2008") {
      bronxCounter[2] += 1
    }
    if (boro === "BRONX" && year === "2009") {
      bronxCounter[3] += 1
    }
    if (boro === "BRONX" && year === "2010") {
      bronxCounter[4] += 1
    }
    if (boro === "BRONX" && year === "2011") {
      bronxCounter[5] += 1
    }
    if (boro === "BRONX" && year === "2012") {
      bronxCounter[6] += 1
    }
    if (boro === "BRONX" && year === "2013") {
      bronxCounter[7] += 1
    }
    if (boro === "BRONX" && year === "2014") {
      bronxCounter[8] += 1
    }
    if (boro === "BRONX" && year === "2015") {
      bronxCounter[9] += 1
    }
    if (boro === "BRONX" && year === "2016") {
      bronxCounter[10] += 1
    }
    if (boro === "BRONX" && year === "2017") {
      bronxCounter[11] += 1
    }
    if (boro === "BRONX" && year === "2018") {
      bronxCounter[12] += 1
    }
    if (boro === "BRONX" && year === "2019") {
      bronxCounter[13] += 1
    }

    if (boro === "BROOKLYN" && year === "2006") {
      brooklynCounter[0] += 1
    }
    if (boro === "BROOKLYN" && year === "2007") {
      brooklynCounter[1] += 1
    }
    if (boro === "BROOKLYN" && year === "2008") {
      brooklynCounter[2] += 1
    }
    if (boro === "BROOKLYN" && year === "2009") {
      brooklynCounter[3] += 1
    }
    if (boro === "BROOKLYN" && year === "2010") {
      brooklynCounter[4] += 1
    }
    if (boro === "BROOKLYN" && year === "2011") {
      brooklynCounter[5] += 1
    }
    if (boro === "BROOKLYN" && year === "2012") {
      brooklynCounter[6] += 1
    }
    if (boro === "BROOKLYN" && year === "2013") {
      brooklynCounter[7] += 1
    }
    if (boro === "BROOKLYN" && year === "2014") {
      brooklynCounter[8] += 1
    }
    if (boro === "BROOKLYN" && year === "2015") {
      brooklynCounter[9] += 1
    }
    if (boro === "BROOKLYN" && year === "2016") {
      brooklynCounter[10] += 1
    }
    if (boro === "BROOKLYN" && year === "2017") {
      brooklynCounter[11] += 1
    }
    if (boro === "BROOKLYN" && year === "2018") {
      brooklynCounter[12] += 1
    }
    if (boro === "BROOKLYN" && year === "2019") {
      brooklynCounter[13] += 1
    }

    if (boro === "MANHATTAN" && year === "2006") {
      manhattanCounter[0] += 1
    }
    if (boro === "MANHATTAN" && year === "2007") {
      manhattanCounter[1] += 1
    }
    if (boro === "MANHATTAN" && year === "2008") {
      manhattanCounter[2] += 1
    }
    if (boro === "MANHATTAN" && year === "2009") {
      manhattanCounter[3] += 1
    }
    if (boro === "MANHATTAN" && year === "2010") {
      manhattanCounter[4] += 1
    }
    if (boro === "MANHATTAN" && year === "2011") {
      manhattanCounter[5] += 1
    }
    if (boro === "MANHATTAN" && year === "2012") {
      manhattanCounter[6] += 1
    }
    if (boro === "MANHATTAN" && year === "2013") {
      manhattanCounter[7] += 1
    }
    if (boro === "MANHATTAN" && year === "2014") {
      manhattanCounter[8] += 1
    }
    if (boro === "MANHATTAN" && year === "2015") {
      manhattanCounter[9] += 1
    }
    if (boro === "MANHATTAN" && year === "2016") {
      manhattanCounter[10] += 1
    }
    if (boro === "MANHATTAN" && year === "2017") {
      manhattanCounter[11] += 1
    }
    if (boro === "MANHATTAN" && year === "2018") {
      manhattanCounter[12] += 1
    }
    if (boro === "MANHATTAN" && year === "2019") {
      manhattanCounter[13] += 1
    }

    if (boro === "QUEENS" && year === "2006") {
      queensCounter[0] += 1
    }
    if (boro === "QUEENS" && year === "2007") {
      queensCounter[1] += 1
    }
    if (boro === "QUEENS" && year === "2008") {
      queensCounter[2] += 1
    }
    if (boro === "QUEENS" && year === "2009") {
      queensCounter[3] += 1
    }
    if (boro === "QUEENS" && year === "2010") {
      queensCounter[4] += 1
    }
    if (boro === "QUEENS" && year === "2011") {
      queensCounter[5] += 1
    }
    if (boro === "QUEENS" && year === "2012") {
      queensCounter[6] += 1
    }
    if (boro === "QUEENS" && year === "2013") {
      queensCounter[7] += 1
    }
    if (boro === "QUEENS" && year === "2014") {
      queensCounter[8] += 1
    }
    if (boro === "QUEENS" && year === "2015") {
      queensCounter[9] += 1
    }
    if (boro === "QUEENS" && year === "2016") {
      queensCounter[10] += 1
    }
    if (boro === "QUEENS" && year === "2017") {
      queensCounter[11] += 1
    }
    if (boro === "QUEENS" && year === "2018") {
      queensCounter[12] += 1
    }
    if (boro === "QUEENS" && year === "2019") {
      queensCounter[13] += 1
    }

    if (boro === "STATEN ISLAND" && year === "2006") {
      siCounter[0] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2007") {
      siCounter[1] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2008") {
      siCounter[2] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2009") {
      siCounter[3] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2010") {
      siCounter[4] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2011") {
      siCounter[5] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2012") {
      siCounter[6] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2013") {
      siCounter[7] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2014") {
      siCounter[8] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2015") {
      siCounter[9] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2016") {
      siCounter[10] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2017") {
      siCounter[11] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2018") {
      siCounter[12] += 1
    }
    if (boro === "STATEN ISLAND" && year === "2019") {
      siCounter[13] += 1
    }

  });
  // console.log(bronxCounter);
  // console.log(brooklynCounter);
  // console.log(manhattanCounter);
  // console.log(queensCounter);
  // console.log(siCounter);


  seasonCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  dataset.forEach(function (d) {
    var date = d.OCCUR_DATE;
    var year = date.substr(6, 9);
    var month = date.substr(0, 2);

    if (year === "2006" && (month > "0" && month <= "03")) {
      seasonCounter[0] += 1

    }
    if (year === "2006" && (month > "03" && month <= "06")) {
      seasonCounter[1] += 1

    }
    if (year === "2006" && (month > "06" && month <= "09")) {
      seasonCounter[2] += 1

    }
    if (year === "2006" && (month > "09" && month <= "12")) {
      seasonCounter[3] += 1

    }
    if (year === "2007" && (month > "0" && month <= "03")) {
      seasonCounter[4] += 1

    }
    if (year === "2007" && (month > "03" && month <= "06")) {
      seasonCounter[5] += 1

    }
    if (year === "2007" && (month > "06" && month <= "09")) {
      seasonCounter[6] += 1

    }
    if (year === "2007" && (month > "09" && month <= "12")) {
      seasonCounter[7] += 1

    }
    if (year === "2008" && (month > "0" && month <= "03")) {
      seasonCounter[8] += 1

    }

    if (year === "2008" && (month > "03" && month <= "06")) {
      seasonCounter[9] += 1

    }
    if (year === "2008" && (month > "06" && month <= "09")) {
      seasonCounter[10] += 1

    }
    if (year === "2008" && (month > "09" && month <= "12")) {
      seasonCounter[11] += 1

    }
    if (year === "2009" && (month > "0" && month <= "03")) {
      seasonCounter[12] += 1

    }
    if (year === "2009" && (month > "03" && month <= "06")) {
      seasonCounter[13] += 1

    }
    if (year === "2009" && (month > "06" && month <= "09")) {
      seasonCounter[14] += 1

    }
    if (year === "2009" && (month > "09" && month <= "12")) {
      seasonCounter[15] += 1

    }
    if (year === "2010" && (month > "0" && month <= "03")) {
      seasonCounter[16] += 1

    }
    if (year === "2010" && (month > "03" && month <= "06")) {
      seasonCounter[17] += 1

    }

    if (year === "2010" && (month > "06" && month <= "09")) {
      seasonCounter[18] += 1

    }
    if (year === "2010" && (month > "09" && month <= "12")) {
      seasonCounter[19] += 1

    }
    if (year === "2011" && (month > "0" && month <= "03")) {
      seasonCounter[20] += 1

    }
    if (year === "2011" && (month > "03" && month <= "06")) {
      seasonCounter[21] += 1

    }
    if (year === "2011" && (month > "06" && month <= "09")) {
      seasonCounter[22] += 1

    }
    if (year === "2011" && (month > "09" && month <= "12")) {
      seasonCounter[23] += 1

    }
    if (year === "2012" && (month > "0" && month <= "03")) {
      seasonCounter[24] += 1

    }
    if (year === "2012" && (month > "03" && month <= "06")) {
      seasonCounter[25] += 1

    }
    if (year === "2012" && (month > "06" && month <= "09")) {
      seasonCounter[26] += 1

    }

    if (year === "2012" && (month > "09" && month <= "12")) {
      seasonCounter[27] += 1

    }
    if (year === "2013" && (month > "0" && month <= "03")) {
      seasonCounter[28] += 1

    }
    if (year === "2013" && (month > "03" && month <= "06")) {
      seasonCounter[29] += 1

    }
    if (year === "2013" && (month > "06" && month <= "09")) {
      seasonCounter[30] += 1

    }
    if (year === "2013" && (month > "09" && month <= "12")) {
      seasonCounter[31] += 1

    }
    if (year === "2014" && (month > "0" && month <= "03")) {
      seasonCounter[32] += 1

    }
    if (year === "2014" && (month > "03" && month <= "06")) {
      seasonCounter[33] += 1

    }
    if (year === "2014" && (month > "06" && month <= "09")) {
      seasonCounter[34] += 1

    }
    if (year === "2014" && (month > "09" && month <= "12")) {
      seasonCounter[35] += 1

    }

    if (year === "2015" && (month > "0" && month <= "03")) {
      seasonCounter[36] += 1

    }
    if (year === "2015" && (month > "03" && month <= "06")) {
      seasonCounter[37] += 1

    }
    if (year === "2015" && (month > "06" && month <= "09")) {
      seasonCounter[38] += 1

    }
    if (year === "2015" && (month > "09" && month <= "12")) {
      seasonCounter[39] += 1

    }
    if (year === "2016" && (month > "0" && month <= "03")) {
      seasonCounter[40] += 1

    }
    if (year === "2016" && (month > "03" && month <= "06")) {
      seasonCounter[41] += 1

    }
    if (year === "2016" && (month > "06" && month <= "09")) {
      seasonCounter[42] += 1

    }
    if (year === "2016" && (month > "09" && month <= "12")) {
      seasonCounter[43] += 1

    }
    if (year === "2017" && (month > "0" && month <= "03")) {
      seasonCounter[44] += 1

    }

    if (year === "2017" && (month > "03" && month <= "06")) {
      seasonCounter[45] += 1

    }
    if (year === "2017" && (month > "06" && month <= "09")) {
      seasonCounter[46] += 1

    }
    if (year === "2017" && (month > "09" && month <= "12")) {
      seasonCounter[47] += 1

    }
    if (year === "2018" && (month > "0" && month <= "03")) {
      seasonCounter[48] += 1

    }
    if (year === "2018" && (month > "03" && month <= "06")) {
      seasonCounter[49] += 1

    }
    if (year === "2018" && (month > "06" && month <= "09")) {
      seasonCounter[50] += 1

    }
    if (year === "2018" && (month > "09" && month <= "12")) {
      seasonCounter[51] += 1

    }
    if (year === "2019" && (month > "0" && month <= "03")) {
      seasonCounter[52] += 1

    }
    if (year === "2019" && (month > "03" && month <= "06")) {
      seasonCounter[53] += 1

    }

    if (year === "2019" && (month > "06" && month <= "09")) {
      seasonCounter[54] += 1

    }
    if (year === "2019" && (month > "09" && month <= "12")) {
      seasonCounter[55] += 1

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

  // }
  // const heatMapObj = {
  //   "BROOKLYN": {
  //     "2006": 568,
  //     "2007": 533,
  //     "2008": 519,
  //     "2009": 529,
  //     "2010": 525,
  //     "2011": 571,
  //     "2012": 531,
  //     "2013": 371,
  //     "2014": 446,
  //     "2015": 409,
  //     "2016": 308,
  //     "2017": 306,
  //     "2018": 313,
  //     "2019": 465
  //   }
  // }


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
    // .style("fill", function (d, i) { return "rgb(" + bronxCounter[i] / 4 + ", 20, " + bronxCounter[i] / 8 + ")" })
    // .style("fill", function (d, i) { return "rgb(" + bronxCounter[i] / 3.8 + ", 10, 10)" })
    .style("fill", function (d, i) { return "hsl(" + (100 - bronxCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 100)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    // .style("fill", function (d, i) { return "rgb(" + brooklynCounter[i] / 4 + ", 20, " + brooklynCounter[i] / 8 + ")" });
    // .style("fill", function (d, i) { return "rgb(" + brooklynCounter[i] / 3.8 + ", 10, 10)" })
    .style("fill", function (d, i) { return "hsl(" + (100 - brooklynCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 200)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    // .style("fill", function (d, i) { return "rgb(" + manhattanCounter[i] / 4 + ", 20, " + manhattanCounter[i] / 8 + ")" });
    // .style("fill", function (d, i) { return "rgb(" + manhattanCounter[i] / 3.8 + ", 10, 10)" })
    .style("fill", function (d, i) { return "hsl(" + (100 - manhattanCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 300)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    // .style("fill", function (d, i) { return "rgb(" + queensCounter[i] / 4 + ", 20, " + queensCounter[i] / 8 + ")" });
    // .style("fill", function (d, i) { return "rgb(" + queensCounter[i] / 3.8 + ", 10, 10)" })
    .style("fill", function (d, i) { return "hsl(" + (100 - queensCounter[i] / 10) + ", 60%, 50%)" })

  heatmap.append("rect")
    .attr("y", 400)
    .attr("width", 100)
    .attr("height", 100)
    .style("stroke", "none")
    // .style("fill", function (d, i) { return "rgb(" + siCounter[i] / 4 + ", 20, " + siCounter[i] / 8 + ")" });
    // .style("fill", function (d, i) { return "rgb(" + siCounter[i] / 3.8 + ", 10, 10)" })
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

  // for (var i = 117; i < 1500; i += 100) {

  //   wrapper2.append("text")
  // .attr("class", "legend-boros")
  // .attr("x", i)
  // .attr("y", 25)
  // .attr("text-anchor", "start")
  // .style("fill", "#8090a1")
  // .style("font-weight", "bold")
  // .text("w")

  // wrapper2.append("text")
  // .attr("class", "legend-boros")
  // .attr("x", i + 25)
  // .attr("y", 25)
  // .attr("text-anchor", "start")
  // .style("fill", "#8090a1")
  // .style("font-weight", "bold")
  // .text("s")

  // wrapper2.append("text")
  // .attr("class", "legend-boros")
  // .attr("x", i + 50)
  // .attr("y", 25)
  // .attr("text-anchor", "start")
  // .style("fill", "#8090a1")
  // .style("font-weight", "bold")
  // .text("s")

  // wrapper2.append("text")
  // .attr("class", "legend-boros")
  // .attr("x", i + 75)
  // .attr("y", 25)
  // .attr("text-anchor", "start")
  // .style("fill", "#8090a1")
  // .style("font-weight", "bold")
  // .text("f")

  // }

  yearCounter = [0, 0, 0, 0]
  dataset.forEach(function (d) {

    var date = d.OCCUR_DATE;
    var month = date.substr(0, 2);

    if (month > "0" && month <= "03") {
      yearCounter[0] += 1
    }
    if (month > "03" && month <= "06") {
      yearCounter[1] += 1
    }
    if (month > "06" && month <= "09") {
      yearCounter[2] += 1
    }
    if (month > "09" && month <= "12") {
      yearCounter[3] += 1
    }

  });
  console.log(yearCounter);

  // 6. Draw annual fluctuation 
  const colorScale = d3.scaleLinear()
    .domain([4028, 6061, 7284, 5002])
    //  .range(["rgb(113, 204, 51)", "rgb(204, 89, 51)", "rgb(204, 89, 51)", "rgb(113, 204, 51)"])
    //  .range(["hsl(" + (100 - 40.28) + ", 60%, 50%)", "hsl(" + (100 - 60.61) + ", 60%, 50%)", "hsl(" + (100 - 72.84) + ", 60%, 50%)", "hsl(" + (100 - 50.02) + ", 60%, 50%)"])
    .range(["hsl(" + (100 - (4028 / 120)) + ", 60%, 50%)", "hsl(" + (100 - (6061 / 120)) + ", 60%, 50%)", "hsl(" + (100 - (7284 / 120)) + ", 60%, 50%)", "hsl(" + (100 - (5002 / 120)) + ", 60%, 50%)"])

  const wrapper3 = d3.select("#wrapper3")
    .append("svg")
    .attr("width", 1500)
    .attr("height", 150)

  //  const bounds3 = wrapper3.append("g")
  //    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  const legendGroup = wrapper3.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)
  //  .attr("transform", `translate(${
  //    120
  //  },${
  //    dimensions.width < 800
  //    ? dimensions.boundedHeight - 30
  //    : dimensions.boundedHeight * 0.5
  //  })`)


  const defs = legendGroup.append("defs")
  const legendGradientId = "legend-gradient"
  const gradient = defs.append("linearGradient")
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
  const legendGradient = legendGroup.append("rect")
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