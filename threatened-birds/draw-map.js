async function drawMap() {

  const countryShapes = await d3.json("./world-geojson.json")
  const dataset = await d3.csv("./birds.csv")

  const countryNameAccessor = d => d.properties["NAME"]
  const countryIdAccessor = d => d.properties["ADM0_A3_IS"]

  // const metric = "Individuals using the Internet (% of population)"

  let metricDataByCountry = {}
  dataset.forEach(d => {
    metricDataByCountry[d["Country Code"]] = +d["2018 [YR2018]"] || 0
  })
  console.log(metricDataByCountry)

  let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right


  const sphere = ({ type: "Sphere" })
  const projection = d3.geoEqualEarth()
    .fitWidth(dimensions.boundedWidth, sphere)

  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight
    + dimensions.margin.top
    + dimensions.margin.bottom

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)



  const bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions.margin.left
      }px, ${
      dimensions.margin.top
      }px)`)

  const metricValues = Object.values(metricDataByCountry)

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(metricValues))//d3.extent(metricValues)
    .range(['#f7f4f9', '#67001f'])

  const earth = bounds.append("path")
    .attr("class", "earth")
    .attr("d", pathGenerator(sphere))

  const graticuleJson = d3.geoGraticule10()

  const graticule = bounds.append("path")
    .attr("class", "graticule")
    .attr("d", pathGenerator(graticuleJson))

  const countries = bounds.selectAll(".country")
    .data(countryShapes.features)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)
    .attr("fill", d => {
      const metricValue = metricDataByCountry[countryIdAccessor(d)]
      if (typeof metricValue == "undefined" || metricValue === 0) return "lightgrey"
      return colorScale(metricValue)
    })

  const legendGroup = wrapper.append("g")
    .attr("transform", `translate(${
      120
      },${
      dimensions.width < 800
        ? dimensions.boundedHeight - 30
        : dimensions.boundedHeight * 0.5
      })`)

  const legendTitle = legendGroup.append("text")
    .attr("x", -70)
    .attr("y", -23)
    .attr("class", "legend-title")
    .text("Threatened Bird Species")

  const legendByline = legendGroup.append("text")
    .attr("x", -70)
    .attr("y", -5)
    .attr("class", "legend-byline")
    .text("by Country (2018)")

  const defs = wrapper.append("defs")
  const legendGradientId = "legend-gradient"

  const gradient = defs.append("linearGradient")
    .attr("id", legendGradientId)
    .selectAll("stop")
    .data(colorScale.range())
    .enter().append("stop")
    .attr("stop-color", d => d)
    .attr("offset", (d, i) => `${
      i * 100 / 2 // 2 is one less than our array's length
      }%`)

  const legendWidth = 150
  const legendHeight = 16
  const legendGradient = legendGroup.append("rect")
    .attr("x", -legendWidth / 2)
    .attr("height", legendHeight)
    .attr("width", legendWidth)
    .style("fill", `url(#${legendGradientId})`)

  // const metricValues = Object.values(metricDataByCountry)
  const metricValueExtent = d3.extent(metricValues)
  console.log(metricValueExtent)

  const legendValueRight = legendGroup.append("text")
    .attr("class", "legend-value")
    .attr("x", legendWidth / 2 + 10)
    .attr("y", legendHeight / 2)
    .text("175")

  const legendValueLeft = legendGroup.append("text")
    .attr("class", "legend-value")
    .attr("x", -legendWidth / 2 - 10)
    .attr("y", legendHeight / 2)
    .text("0")
    .style("text-anchor", "end")


  navigator.geolocation.getCurrentPosition(myPosition => {
    const [x, y] = projection([
      myPosition.coords.longitude,
      myPosition.coords.latitude
    ])
    const myLocation = bounds.append("circle")
      .attr("class", "my-location")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 0)
      .transition().duration(500)
      .attr("r", 10)
  })

  countries.on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")

  function onMouseEnter(datum) {
    tooltip.style("opacity", 1)

    const metricValue = metricDataByCountry[countryIdAccessor(datum)]

    tooltip.select("#country")
      .text(countryNameAccessor(datum))

    tooltip.select("#value")
      .text(metricValue)

    const [centerX, centerY] = pathGenerator.centroid(datum)
    const x = centerX + dimensions.margin.left
    const y = centerY + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
    + `calc(-100% + ${y}px)`
    + `)`)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
}

drawMap()

