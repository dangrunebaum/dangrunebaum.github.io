
(async () => {

  ////////////////////////////////////
  ///////////// SVG Setup ////////////
  ////////////////////////////////////

  // margins for SVG
  const margin = {
    left: 120,
    right: 20,
    top: 100,
    bottom: 50
  }

  const svgWidth = 600
  const svgHeight = svgWidth * 1.0

  // helper calculated variables for inner width & height
  const width = svgWidth - margin.left - margin.right
  const height = svgHeight - margin.top - margin.bottom

  // Add SVG
  const svg = d3.select('figure')
    .append('svg')
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // responsive width & height
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  ////////////////////////////////////
  ///////// Data Wrangling ///////////
  ////////////////////////////////////

  // Parse the data
  let data = await d3.csv("./HCI_B_W_Master Data.csv")

  // List of subgroups = header of the csv file (cost, access, quality)
  var subgroups = data.columns.slice(1).slice(0, 3)

  // List of groups = states
  var groups = d3.map(data, d => d.State).keys()
  console.log(groups)

  // Stack the data --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  ////////////////////////////////////
  ///////// Scales ////////////////////
  ////////////////////////////////////

  // Add Y axis
  var y = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.2])
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 100]).nice()
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#00AEBE", "#21CF19", "#0B5BD6"])

  ////////////////////////////////////
  ///////// Draw ////////////////////
  ////////////////////////////////////

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("class", "bars")
    .attr("y", function (d) { return y(d.data.State); })
    .attr("x", function (d) { return x(d[0]); })
    .attr("width", function (d) { return (x(d[1]) - x(d[0])); })
    .attr("height", y.bandwidth())
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  ////////////////////////////////////
  /////////////// Legend /////////////
  ////////////////////////////////////

  function mouseover(d) {

    svg.append('text')
      .attr('class', 'score')
      .attr('x', x(d.data.ScoreRank) + 5)
      .attr('y', y(d.data.State) + 6)
      .style('fill', '#0B5BD6')
      .style('font-size', '0.5em')
      .style('font-weight', 600)
      .html(d.data.ScoreRank + ' points');

  }

  function mouseout() {

    d3.selectAll('.score')
      .attr('opacity', 0)

  }

  ////////////////////////////////////
  /////////////// Legend /////////////
  ////////////////////////////////////

  svg.selectAll("mydots")
    .data(subgroups)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return i * 120; })
    .attr('cy', -20)
    .attr("r", 7)
    .style("fill", d => color(d))

  svg.selectAll("mylabels")
    .data(subgroups)
    .enter()
    .append("text")
    .attr("x", function (d, i) { return i * 120 + 10; })
    .attr('y', -15)
    .style("fill", function (d) { return color(d); })
    .attr("text-anchor", "left")
    .style("font-family", "'Gill Sans', 'Gill Sans MT'")
    .text(function (d) { return d })

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -50)
    .style("text-anchor", "middle")
    .style('font-size', '1.5em')
    .style('fill', '#303030')
    .text('Best States for Low Income Healthcare')

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 50)
    .style("text-anchor", "middle")
    .style('font-size', '1em')
    .style('fill', '#303030')
    .text('Total Healthcare Points')

})()
