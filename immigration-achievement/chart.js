async function drawChart() {

  // 1. Access data

  // Load data
  const dataset = await d3.json("./immigrants.json")
  // console.table(dataset)

  // access the sex of a simulated “person”
  const sexAccessor = d => d.sex
  const sexes = ["female", "male"]
  const sexIds = d3.range(sexes.length)

  // access the job of a simulated “person”
  const jobAccessor = d => d.job
  const jobNames = [
    "Other",
    "Professional",
    "Managerial"
  ]
  const jobIds = d3.range(jobNames.length)

  // access the ethnoracial identity of a simulated “person”
  const ethnoAccessor = d => d.ethnicity
  const ethnoNames = ["White", "Hispanic", "Black", "Asian"]
  const ethnoIds = d3.range(ethnoNames.length)
  const getStatusKey = ({ sex, ethnicity }) => [sex, ethnicity].join("--")

  // Stacked probabilities object used when assigning "person" to bucket
  const stackedProbabilities = {}
  dataset.forEach(startingPoint => {
    const key = getStatusKey(startingPoint)
    let stackedProbability = 0
    stackedProbabilities[key] = jobNames.map((job, i) => {
      stackedProbability += (startingPoint[job] / 100)
      if (i == jobNames.length - 1) {
        return 1
      } else {
        return stackedProbability
      }
    })
  })
  // console.log(stackedProbabilities)

  // Randomly set person's sex and ethnicity 
  let currentPersonId = 0
  function generatePerson(elapsed) {
    currentPersonId++
    const sex = getRandomValue(sexIds)
    const ethnicity = getRandomValue(ethnoIds)
    const statusKey = getStatusKey({
      sex: sexes[sex],
      ethnicity: ethnoNames[ethnicity],
    })
    // Find index where random number “fits” in probabilities array
    const probabilities = stackedProbabilities[statusKey]
    const job = d3.bisect(probabilities, Math.random())

    return {
      id: currentPersonId,
      sex,
      ethnicity,
      job,
      startTime: elapsed + getRandomNumberInRange(-0.1, 0.1),
      yJitter: getRandomNumberInRange(-15, 15)
    }
  }
  // console.log(generatePerson())

  // 2. Create chart dimensions
  const width = d3.min([
    window.innerWidth * 0.9,
    1200
  ])
  let dimensions = {
    width: width,
    height: 600,
    margin: {
      top: 10,
      right: 200,
      bottom: 10,
      left: 120,
    },
    pathHeight: 50,
    endsBarWidth: 15,
    endingBarPadding: 3,
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // 4. Create scales

  // X and Y scales for paths
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, dimensions.boundedWidth])
    .clamp(true)

  // Starting Y scale converts from ethno id to a y-position
  const startYScale = d3.scaleLinear()
    .domain([ethnoIds.length, -1])
    .range([0, dimensions.boundedHeight])

  // Ending Y scale converts from job id to a y-position
  const endYScale = d3.scaleLinear()
    .domain([jobIds.length, -1])
    .range([0, dimensions.boundedHeight])

  const yTransitionProgressScale = d3.scaleLinear()
    .domain([0.45, 0.55]) // x progress
    .range([0, 1]) // y progress
    .clamp(true)

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(ethnoIds))
    .range(["#12CBC4", "#B53471"])
    .interpolate(d3.interpolateHcl)

  // 5. Draw data

  // Draw paths - x array divided into 6 
  // link generator returns start y position for first 3 arrays, and end position for last 3 arrays
  const linkLineGenerator = d3.line()
    .x((d, i) => i * (dimensions.boundedWidth / 5)) //one-fifth of horizontal space for y-position transition
    .y((d, i) => i <= 2
      ? startYScale(d[0])
      : endYScale(d[1])
    )
    .curve(d3.curveMonotoneX)
  // Flatten into one array 
  const linkOptions = d3.merge(
    ethnoIds.map(startId => (
      jobIds.map(endId => (
        new Array(6).fill([startId, endId])
      ))
    ))
  )
  // console.log(linkOptions)

  // create a <path> for each lineOption
  const linksGroup = bounds.append("g")
  const links = linksGroup.selectAll(".category-path")
    .data(linkOptions)
    .enter().append("path")
    .attr("class", "category-path")
    .attr("d", linkLineGenerator)
    .attr("stroke-width", dimensions.pathHeight)

  // 6. Draw peripherals

  const startingLabelsGroup = bounds.append("g")
    .style("transform", "translateX(-20px)")

  // Ethnicity labels 
  const startingLabels = startingLabelsGroup.selectAll(".start-label")
    .data(ethnoIds)
    .enter().append("text")
    .attr("class", "label start-label")
    .attr("y", (d, i) => startYScale(i))
    .text((d, i) => sentenceCase(ethnoNames[i]))

  const startingBars = startingLabelsGroup.selectAll(".start-bar")
    .data(ethnoIds)
    .enter().append("rect")
    .attr("x", 20)
    .attr("y", d => startYScale(d) - (dimensions.pathHeight / 2))
    .attr("width", dimensions.endsBarWidth)
    .attr("height", dimensions.pathHeight)
    .attr("fill", colorScale)

  const endingLabelsGroup = bounds.append("g")
    .style("transform", `translateX(${
      dimensions.boundedWidth + 20
      }px)`)

  // Job labels 
  const endingLabels = endingLabelsGroup.selectAll(".end-label")
    .data(jobNames)
    .enter().append("text")
    .attr("class", "label end-label")
    .attr("y", (d, i) => endYScale(i) - 25)
    .text(d => d)

  // Femle markers are circles
  const femaleMarkers = endingLabelsGroup.selectAll(".female-marker")
    .data(jobIds)
    .enter().append("circle")
    .attr("class", "ending-marker female-marker")
    .attr("r", 5.5)
    .attr("cx", 5)
    .attr("cy", d => endYScale(d) + 5)

  // // Male markers are squares 
  // const trianglePoints = [
  //   "-7, 6",
  //   " 0, -6",
  //   " 7, 6",
  // ].join(" ")

  const maleMarkers = endingLabelsGroup.selectAll(".male-marker")
    .data(jobIds)
    .enter().append("rect")
    .attr("class", "ending-marker male-marker")
    .attr("width", 10)
    .attr("height", 10)
    // .attr("points", trianglePoints)
    .attr("transform", d => `translate(0, ${endYScale(d) + 15})`)

    const legendGroup = bounds.append("g")
.attr("class", "legend")
.attr("transform", `translate(${dimensions.boundedWidth}, 65)`)

const maleLegend = legendGroup.append("g")
.attr("transform", `translate(${
- dimensions.endsBarWidth * 1.5
+ dimensions.endingBarPadding
+ 1
}, 0)`)

maleLegend.append("rect")
.attr("width", 10)
.attr("height", 10)
.attr("transform", "translate(-12, -5)")
maleLegend.append("text")
.attr("class", "legend-text-left")
.text("Male")
.attr("x", -20)
maleLegend.append("line")
.attr("class", "legend-line")
.attr("x1", -dimensions.endsBarWidth / 2 + 1)
.attr("x2", -dimensions.endsBarWidth / 2 + 1)
.attr("y1", 12)
.attr("y2", 37)

const femaleLegend = legendGroup.append("g")
.attr("transform", `translate(${
- dimensions.endsBarWidth / 2
- 4
}, 0)`)
femaleLegend.append("circle")
.attr("r", 5.5)
.attr("transform", "translate(5, 0)")
femaleLegend.append("text")
.attr("class", "legend-text-right")
.text("Female")
.attr("x", 15)
.attr("y", 0)
femaleLegend.append("line")
.attr("class", "legend-line")
.attr("x1", dimensions.endsBarWidth / 2 - 3)
.attr("x2", dimensions.endsBarWidth / 2 - 3)
.attr("y1", 12)
.attr("y2", 37)

  // 7. Set up interactions

  // People array that will hold all simulated people
  const maximumPeople = 10000
  let people = []
  // <g> element that will hold all people markers
  const markersGroup = bounds.append("g")
    .attr("class", "markers-group")
  const endingBarGroup = bounds.append("g")
    .attr("transform", `translate(${dimensions.boundedWidth}, 0)`)

  // Draw people 
  function updateMarkers(elapsed) {
    const xProgressAccessor = d => (elapsed - d.startTime) / 10000
    if (people.length < maximumPeople) {
      people = [
        ...people,
        ...d3.range(2).map(() => generatePerson(elapsed)),
      ]
    }
    // console.log(people)

    // Position people markers at start
    const females = markersGroup.selectAll(".marker-circle")
      .data(people.filter(d => (
        xProgressAccessor(d) < 1
        && sexAccessor(d) == 0
      )), d => d.id)
    females.enter().append("circle")
      .attr("class", "marker marker-circle")
      .attr("r", 5.5)
      // .style("fill", "limegreen")
      .style("opacity", 0)
    females.exit().remove()

    const males = markersGroup.selectAll(".marker-triangle")
      .data(people.filter(d => (
        xProgressAccessor(d) < 1
        && sexAccessor(d) == 1
      )), d => d.id)
    males.enter().append("rect")
      .attr("class", "marker marker-triangle")
      .attr("width", 10)
      .attr("height", 10)
      .style("opacity", 0)
    males.exit().remove()

    const markers = d3.selectAll(".marker")

    markers.style("transform", d => {
      const x = xScale(xProgressAccessor(d))
      const yStart = startYScale(ethnoAccessor(d))
      const yEnd = endYScale(jobAccessor(d))
      const yChange = yEnd - yStart
      const yProgress = yTransitionProgressScale(xProgressAccessor(d))
      const y = yStart
        + (yChange * yProgress)
        + d.yJitter
      return `translate(${x}px, ${y}px)`
    })
      .attr("fill", d => colorScale(ethnoAccessor(d)))
      .transition().duration(100)
      .style("opacity", d => xScale(xProgressAccessor(d)) < 10 ? 0 : 1)

    const endingGroups = jobIds.map((endId, i) => (
      people.filter(d => (
        xProgressAccessor(d) >= 1
        && jobAccessor(d) == endId
      ))
    ))
    const endingPercentages = d3.merge(
      endingGroups.map((peopleWithSameEnding, endingId) => (
        d3.merge(
          sexIds.map(sexId => (
            ethnoIds.map(ethnoId => {
              const peopleInBar = peopleWithSameEnding.filter(d => (
                sexAccessor(d) == sexId
              ))
              const countInBar = peopleInBar.length
              const peopleInBarWithSameStart = peopleInBar.filter(d => (
                ethnoAccessor(d) == ethnoId
              ))
              const count = peopleInBarWithSameStart.length
              const numberOfPeopleAbove = peopleInBar.filter(d => (
                ethnoAccessor(d) > ethnoId
              )).length

              return {
                endingId,
                ethnoId,
                sexId,
                count,
                countInBar,
                percentAbove: numberOfPeopleAbove / (peopleInBar.length || 1),
                percent: count / (countInBar || 1),
              }
            })
          ))
        )
      ))
    )
    endingBarGroup.selectAll(".ending-bar")
      .data(endingPercentages)
      .join("rect")
      .attr("class", "ending-bar")
      .attr("x", d => -dimensions.endsBarWidth * (d.sexId + 1)
        - (d.sexId * dimensions.endingBarPadding)
      )
      .attr("width", dimensions.endsBarWidth)
      .attr("y", d => endYScale(d.endingId)
        - dimensions.pathHeight / 2
        + dimensions.pathHeight * d.percentAbove
      )
      .attr("height", d => d.countInBar
        ? dimensions.pathHeight * d.percent
        : dimensions.pathHeight
      )
      .attr("fill", d => d.countInBar
        ? colorScale(d.ethnoId)
        : "#dadadd"
      )

    endingLabelsGroup.selectAll(".ending-value")
      .data(endingPercentages)
      .join("text")
      .attr("class", "ending-value")
      .attr("x", d => (d.ethnoId) * 33
        + 47
      )
      .attr("y", d => endYScale(d.endingId)
        - dimensions.pathHeight / 2
        + 14 * d.sexId
        + 35
      )
      .attr("fill", d => d.countInBar
        ? colorScale(d.ethnoId)
        : "#dadadd"
      )
      .text(d => d.count)
  }
  d3.timer(updateMarkers)
}
drawChart()


// utility functions

const getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

const getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

const sentenceCase = str => [
  str.slice(0, 1).toUpperCase(),
  str.slice(1),
].join("")