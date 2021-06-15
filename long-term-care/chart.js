
// Header parallax function for dynamic image movement
(function () {

  var parallax = document.querySelectorAll("#header"),
      speed = 0.5;

  window.onscroll = function () {
      [].slice.call(parallax).forEach(function (el, i) {

          var windowYOffset = -window.pageYOffset,
              elBackgrounPos = "10% " + (windowYOffset * speed) + "px";

          el.style.backgroundPosition = elBackgrounPos;

      });
  };

})();

(async () => {


  ////////////////////////////////////
  ///////////// SVG Setup ////////////
  ////////////////////////////////////

  const margin = { top: 200, right: 150, bottom: 20, left: 180 }

  const svgWidth = 1000
  const svgHeight = svgWidth * 0.6

  // helper calculated variables for inner width & height
  const height = svgHeight - margin.top - margin.bottom
  const width = svgWidth - margin.left - margin.right

  // append the svg object to the body of the page
  const svg = d3.select("figure")
    .append("svg")
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // responsive width & height
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Append Div for tooltip to SVG
  const tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  ////////////////////////////////////
  ///////// Data Wrangling ///////////
  ////////////////////////////////////

  data = await d3.csv("https://content-static.healthcare.inc/data/projected-long-term-care-needs.csv")

  // List of subgroups = years of LTSS 
  const subgroups = data.columns.slice(2, 7)
  // console.log(subgroups)
  // List of groups = demographics
  const groups = d3.map(data, function (d) { return (d.Subgroup) }).keys()
  // console.log(groups)

  //stack the data per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  ////////////////////////////////////
  ///////// Scales ///////////////////
  ////////////////////////////////////

  // Add X axis
  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
  // svg.append("g")
  //   .call(d3.axisTop(xScale));

  // Add Y axis
  const yScale = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.2])
  svg.append("g")
    .call(d3.axisLeft(yScale))
  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    // .range(["#b38a58", "#264027", "#3c5233", "#6f732f", "#0d1f22"])
    // .range(["#1c75ac", "#d4bd6c", "#d89027", "#6f8695", "#1c448e"])
    // .range(["#bcbddc", "#9e9ac8", "#756bb1", "#54278f", "#3C1E64"]);
      .range(['#9e9ac8', '#FFA07A', '#FA8072', '#CD5C5C', '#B22222'])

  ////////////////////////////////////
  ///////// Draw Items ///////////////
  ////////////////////////////////////

  // The first bars show subgroup percentages
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
    .attr("y", function (d) { return yScale(d.data.Subgroup); })
    .attr("x", function (d) { return xScale(d[0]); })
    .attr("height", yScale.bandwidth())
    .attr("width", function (d) { return xScale(d[0]) + xScale(d[1]); })

  // The second set of bars is overlayed for darkened mouseover effect
  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", 'rgba(50,50,50, 0.001')
    .selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("y", function (d) { return yScale(d.data.Subgroup); })
    .attr("x", function (d) { return xScale(0); })
    .attr("height", yScale.bandwidth())
    .attr("width", function (d) { return xScale(width); })
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
    .attr('class', 'bars');

  ////////////////////////////////////
  ///////// Interactions /////////////
  ////////////////////////////////////

  function mouseover(d) {
    // let tipGroup = d.data.Group
    // let tipSubgroup = d.data.Subgroup
    let tipNone = d.data.None
    let tip1 = d.data["<1"]
    let tip199 = d.data["1-2"]
    let tip499 = d.data["2-5"]
    let tip5 = d.data[">5"]
    tooltipDiv.transition()
      .duration(100)
      .style("opacity", 1.0);
    tooltipDiv.html(
      "<b>" + "Long-Term Care Needs" + "</b>" + "<br>" +
      "None: " + tipNone + "%" + "<br>" +
      "<1 year: " + tip1 + "%" + "<br>" +
      "1-2 years: " + tip199 + "%" + "<br>" +
      "2-5 years: " + tip499 + "%" + "<br>" +
      ">5 years: " + tip5 + "%"
    )
      .style("left", (d3.event.pageX + 20) + "px")
      .style("top", (d3.event.pageY - 130) + "px")
  }

  function mouseout() {

    tooltipDiv.transition()
      .duration(500)
      .style("opacity", 0)

  }

  ////////////////////////////////////
  ///////// Legend ///////////////////
  ////////////////////////////////////

  const legend = svg.selectAll('circles')
    .data(stackedData)
    .enter()
    .append('circle')
    .attr('cx', function (d, i) { return i * 100 + 200; })
    .attr('cy', -25)
    .attr('r', 10)
    .attr("fill", d => color(d.key));

  svg.selectAll("labels")
    .data(subgroups)
    .enter()
    .append("text")
    .attr("x", function (d, i) { return i * 100 + 220; })
    .attr('y', -20)
    .style("fill", function (d) { return color(d); })
    .attr("text-anchor", "left")
    .style("font-family", "Proxima Nova")
    .style("font-weight", 700)
    .text(function (d) { return d })

  // svg.append('text')
  // .attr('x', width / 2)
  // .attr('y', -40)
  // .style("text-anchor", "middle")
  // .style('font-size', '1em')
  // .style('fill', '#303030')
  // .text('Percent of Population Turning 65 in 2020-2024');

  svg.append('text')
    .attr('x', width / 2 + 70)
    .attr('y', -80)
    .style("text-anchor", "middle")
    .style('font-size', '1.5em')
    .style("font-weight", 600)
    .text("65+ Adults' Projected Need for Long-Term Care (Years)");

          // Date accessor variable
          let today = new Date();
          const dateVariable = `${today.getFullYear()}${('0' + (today.getMonth()+1)).slice(-2)}${today.getDate()}`;
          console.log(dateVariable);

})()
