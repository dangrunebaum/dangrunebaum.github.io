var color = d3.scaleOrdinal()
  .domain(["United  States", "Asia", "Europe", "Africa", "Oceania", "N.America", "Latin America and the Caribbean"])
  .range(["#002868", "crimson", "lightsalmon", "olive", "plum", "CornflowerBlue", "teal"]);

var legendText = ["United States", "Asia", "Europe", "Africa", "Oceania", "N.America", "Latin America and the Caribbean"]

// Set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 80, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// Append the svg object to the wrapper
var svg = d3.select("#wrapper")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// Draw function 
async function drawScatter() {

  let data = await d3.json("./health-and-wealth.json")

  // Initialize x and y accessor functions 
  const xAccessor = d => d.GDP
  const yAccessor = d => d.lifespan

  // Add X axis at zero point 
  var x = d3.scaleLinear()
    .domain([0, 0])
    .range([0, 0]);
  svg.append("g")
    .attr("class", "myXaxis") // Give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0")

// Text for axes
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("fill", "#34495e")
    .style("font-size", "1.2em")
    .style("text-anchor", "middle")
    .html("GDP per Capita (logarithmic)")

  svg.append("text")
    .attr("x", -400)
    .attr("y", height / 2 - 400)
    .attr("fill", "#34495e")
    .style("font-size", "1.2em")
    .text("Healthy life expectancy at birth")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.GDP); })
    .attr("cy", function (d) { return y(d.lifespan); })
    .attr("r", 7)
    .style("fill", function (d) {
      if (d.Country === "United States")
        return "#002868"
      else { return color(d.Continent) };
    })

  // New X axis at data points 
  x.domain(d3.extent(data, xAccessor))
  x.range([0, width])
  svg.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

    // Initialize x and y scale functions 
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, width])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([height, 0])
      .nice()

  svg.selectAll("circle")
    .transition()
    .delay(function (d, i) { return (i * 8) })
    .duration(2000)
    .attr("cx", d => xScale(xAccessor(d)))//calls d fat arrow function with value of one element in the dataset 
    .attr("cy", d => yScale(yAccessor(d)))

  var legend = d3.select("#wrapper")
    .append("svg")
    .attr("class", "legend")
    .attr("width", 300)
    .attr("height", 200)
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll("g")
    .data(color.domain().slice())
    .enter()
    .append("g")
    .attr("transform", function (d, i) { return "translate(0," + i * 22 + ")"; });

  legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("stroke", "none")
    .style("fill", color);

  legend.append("text")
    .data(legendText)
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("fill", "#34495e")
    .text(function (d) { return d; });

    // Mouse handlers 
  svg.selectAll("circle")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

    // Select tooltip  and  define  mouse function 
  const tooltip = d3.select("#tooltip")
  function onMouseEnter(datum) {

    // Format  tooltip text
    const formatLifespan = d3.format(".1f")
    tooltip.select("#lifespan")
      .text(formatLifespan(datum.lifespan))

    const formatGdp = d3.format(".2f")
    tooltip.select("#gdp")
      .text(formatGdp(datum.GDP))

    // For each circle choose the right country
    // put the country in the text 
    tooltip.select("#country")
      .text(datum.Country)

    // Define x, y for rollover circles and tooltip 
    const x = xScale(xAccessor(datum))
    const y = yScale(yAccessor(datum))

    const dayDot = svg.append("circle")
    .attr("class", "tooltipDot")
    .attr("cx", xScale(xAccessor(datum)))
    .attr("cy", yScale(yAccessor(datum)))
    .transition()
    .duration(100)
    .attr("r", 8)
    .style("fill", "blue")
    .style("pointer-events", "none")

    // Position tooltip 
    tooltip.style("transform", `translate(`
      + `calc( ${x}px - 690px),`
      + `calc(100% + ${y}px - 1030px)`
      + `)`)
    tooltip.style("opacity", 0.9)
  }

  function onMouseLeave() {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }

}

drawScatter()