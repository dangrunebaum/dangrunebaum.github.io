async function drawRadar() {

    // 1. Access data
    let dataset = await d3.json("freedom.json")
    console.log(dataset)

    const freedomRankAccessor = d => d.freedomRank
    const countryAccessor = d => d.country
    dataset = dataset.sort((a, b) => countryAccessor(a) - countryAccessor(b))
    console.log(dataset)
    const metrics = [
        "Human Freedom Index",
        "Personal Freedom Index",
        "Economic Freedom Index",
    ]

    // 2. Create chart dimensions
    const width = 850
    let dimensions = {
        width: width,
        height: width,
        radius: width / 2,
        margin: {
            top: 250,
            right: 200,
            bottom: 150,
            left: 200,
        },
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    dimensions.boundedRadius = dimensions.radius - ((dimensions.margin.left + dimensions.margin.right) / 2)

    // 3. Draw canvas
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top - 40}px)`)

    // 4. Create scales
    // Domain takes min and max value of three metrics
    // and maps their extent onto the range of the boundedRadius  
    const metricScales = metrics.map(metric => (
        d3.scaleLinear()
            .domain(d3.extent(dataset, d => +d[metric]))
            .range([0, dimensions.boundedRadius])
            .nice()
    ))


    // 6. Draw peripherals

    // g to hold background circles, lines and text 
    const axis = bounds.append("g")
    // d3.range() returns an array from zero to the specified end minus one 
    const gridCircles = d3.range(6).map((d, i) => (
        axis.append("circle")
            .attr("cx", dimensions.boundedRadius)
            .attr("cy", dimensions.boundedRadius)
            .attr("r", dimensions.boundedRadius * (i / 5))
            .attr("class", "grid-line")
    ))

    const ticks = d3.range(1).map((d, i) => {
        axis.append("text")
            .attr("x", dimensions.boundedRadius - 8)
            .attr("y", dimensions.boundedRadius * (i / 1) - 3)
            .text("10")
            .attr("class", "grid-line")
    })

    const gridLines = metrics.map((metric, i) => {
        const angle = i * ((Math.PI * 2) / metrics.length) - Math.PI * 0.5
        return axis.append("line")
            .attr("x1", dimensions.boundedWidth / 2)
            .attr("x2", Math.cos(angle) * dimensions.boundedRadius + dimensions.boundedWidth / 2)
            .attr("y1", dimensions.boundedHeight / 2)
            .attr("y2", Math.sin(angle) * dimensions.boundedRadius + dimensions.boundedWidth / 2)
            .attr("class", "grid-line")
    })

    const labels = metrics.map((metric, i) => {
        const angle = i * ((Math.PI * 2) / metrics.length) - Math.PI * 0.5
        const x = Math.cos(angle) * (dimensions.boundedRadius * 1.1) + dimensions.boundedWidth / 2
        const y = Math.sin(angle) * (dimensions.boundedRadius * 1.1) + dimensions.boundedHeight / 2
        return axis.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("class", "metric-label")
            .style("text-anchor",
                i == 0 || i == metrics.length / 2 ? "middle" :
                    i < metrics.length / 2 ? "start" :
                        "end"

            )
            .text(metric)
    })

    // 5. Draw data

    const line = bounds.append("path")
        .attr("class", "line")

    const drawLine = (country) => {
        const lineGenerator = d3.lineRadial()
            .angle((metric, i) => i * ((Math.PI * 2) / metrics.length))
            .radius((metric, i) => metricScales[i](+country[metric] || 0))
            .curve(d3.curveLinearClosed)

        const line = bounds.select(".line")
            .datum(metrics)
            .attr("d", lineGenerator)
            .style("transform", `translate(${dimensions.boundedRadius}px, ${dimensions.boundedRadius}px)`)
    }

    let activeCountryIndex = 0
    const rank = d3.select("#rank")
    const country = d3.select("#country")
    const reversed = dataset.reverse()

    const updateChart = () => {
        rank.text(freedomRankAccessor(dataset[activeCountryIndex]))
        country.text(countryAccessor(dataset[activeCountryIndex]))
        drawLine(dataset[activeCountryIndex])
    }

    updateChart()

    d3.select("#show-next-country").on("click", e => {
        activeCountryIndex = (activeCountryIndex + 1) % reversed.length
        updateChart()
    })

}
drawRadar()