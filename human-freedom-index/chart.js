/*
1nd radar takes form of click-through reverse countdown of countries. 
*/

async function drawRadar1() {

    // 1. Access data
    let dataset = await d3.json("freedom.json")
    // console.log(dataset)

    const freedomRankAccessor = d => d.freedomRank
    const countryAccessor = d => d.country
    dataset1 = dataset.sort((a, b) => countryAccessor(a) - countryAccessor(b))

    const metrics1 = [
        "Human Freedom Index",
        "Personal Freedom Index",
        "Economic Freedom Index",
    ]

    // 2. Create chart dimensions
    const width1 = 900
    let dimensions1 = {
        width1: width1,
        height1: width1,
        radius1: width1 / 2,
        margin1: {
            top1: 250,
            right1: 200,
            bottom1: 150,
            left1: 200,
        },
    }
    dimensions1.boundedWidth1 = dimensions1.width1 - dimensions1.margin1.left1 - dimensions1.margin1.right1
    dimensions1.boundedHeight1 = dimensions1.height1 - dimensions1.margin1.top1 - dimensions1.margin1.bottom1
    dimensions1.boundedRadius1 = dimensions1.radius1 - ((dimensions1.margin1.left1 + dimensions1.margin1.right1) / 2)

    // 3. Draw canvas
    const wrapper1 = d3.select("#wrapper1")
        .append("svg")
        .attr("width", dimensions1.width1)
        .attr("height", dimensions1.height1)

    const bounds1 = wrapper1.append("g")
        .style("transform", `translate(${dimensions1.margin1.left1}px, ${dimensions1.margin1.top1 - 100}px)`)

    // 4. Create scales
    // Domain takes min and max value of three metrics
    // and maps their extent onto the range of the boundedRadius  
    const metricScales1 = metrics1.map(metric => (
        d3.scaleLinear()
            .domain(d3.extent(dataset1, d => +d[metric]))
            .range([0, dimensions1.boundedRadius1])
            .nice()
    ))

    // 5. Draw peripherals

    // g to hold background circles, lines and text 
    const axis1 = bounds1.append("g")
    // d3.range() returns an array from zero to the specified end minus one 
    const gridCircles1 = d3.range(6).map((d, i) => (
        axis1.append("circle")
            .attr("cx", dimensions1.boundedRadius1)
            .attr("cy", dimensions1.boundedRadius1)
            .attr("r", dimensions1.boundedRadius1 * (i / 5))
            .attr("class", "grid-line")
    ))

    const tick1 = d3.range(1).map((d, i) => {
        axis1.append("text")
            .attr("x", dimensions1.boundedRadius1 - 8)
            .attr("y", dimensions1.boundedRadius1 * (i / 1) - 3)
            .text("10")
            .attr("class", "grid-line")
    })

    const gridLines1 = metrics1.map((metric, i) => {
        const angle1 = i * ((Math.PI * 2) / metrics1.length) - Math.PI * 0.5
        return axis1.append("line")
            .attr("x1", dimensions1.boundedWidth1 / 2)
            .attr("x2", Math.cos(angle1) * dimensions1.boundedRadius1 + dimensions1.boundedWidth1 / 2)
            .attr("y1", dimensions1.boundedHeight1 / 2)
            .attr("y2", Math.sin(angle1) * dimensions1.boundedRadius1 + dimensions1.boundedWidth1 / 2)
            .attr("class", "grid-line")
    })

    const labels1 = metrics1.map((metric, i) => {
        const angle1 = i * ((Math.PI * 2) / metrics1.length) - Math.PI * 0.5
        const x1 = Math.cos(angle1) * (dimensions1.boundedRadius1 * 1.1) + dimensions1.boundedWidth1 / 2
        const y1 = Math.sin(angle1) * (dimensions1.boundedRadius1 * 1.1) + dimensions1.boundedHeight1 / 2
        return axis1.append("text")
            .attr("x", x1)
            .attr("y", y1)
            .attr("class", "metric-label")
            .style("text-anchor",
                i == 0 || i == metrics1.length / 2 ? "middle" :
                    i < metrics1.length / 2 ? "start" :
                        "end"

            )
            .text(metric)
    })

    // 6. Draw data (usually peripherals come before)

    const line1 = bounds1.append("path")
        .attr("class", "line1")

    const drawLine1 = (country) => {
        const lineGenerator1 = d3.lineRadial()
            .angle((metric, i) => i * ((Math.PI * 2) / metrics1.length))
            .radius((metric, i) => metricScales1[i](+country[metric] || 0))
            .curve(d3.curveLinearClosed)

        const line1 = bounds1.select(".line1")
            .datum(metrics1)
            .attr("d", lineGenerator1)
            .style("transform", `translate(${dimensions1.boundedRadius1}px, ${dimensions1.boundedRadius1}px)`)
    }

    let activeCountryIndex = 0 // set country to 0
    const rank = d3.select("#rank")
    const country = d3.select("#country")
    const reversed = dataset.reverse() // reverse countdown  
    // Update rank and country text, and draw line by calling index n of dataset.
    const updateChart = () => {
        rank.text(freedomRankAccessor(dataset[activeCountryIndex]))
        country.text(countryAccessor(dataset[activeCountryIndex]))
        drawLine1(dataset[activeCountryIndex])
    }
    updateChart()

    // Update country on click by calling updateChart function. 
    // activeCountryIndex counter adds 1 for each button click,
    // until n/reversed.length is -162, making the remainder 0 again.
    d3.select("#show-next-country").on("click", e => {
        activeCountryIndex = (activeCountryIndex + 1) % reversed.length
        updateChart()
    })

}
drawRadar1()

/*
2nd radar takes form of small multiples. Each chart is 250px and they form responsive
rows of SVGs that redraw depending on window size, thanks to CSS display: flex; flex-wrap: wrap; 
*/

async function drawRadar() {

    // 1. Access data
    let dataset = await d3.json("freedom.json")
    // console.log(dataset)

    const metrics = [
        "Human Freedom Index",
        "Personal Freedom Index",
        "Economic Freedom Index",
    ]

    dataset.forEach(drawCircle);

    function drawCircle(countryData) {

        // Create chart dimensions
        const width = 250
        let dimensions = {
            width: width,
            height: width,
            radius: width / 2,
            margin: {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30,
            },
        }
        dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
        dimensions.boundedRadius = dimensions.radius - ((dimensions.margin.left + dimensions.margin.right) / 2)

        const wrapper2 = d3.select("#wrapper2")
            .append("svg")
            .attr("width", dimensions.boundedWidth + 100)
            .attr("height", dimensions.boundedHeight + 100)

        const bounds = wrapper2.append("g")

        // 4. Create scales
        // Domain takes min and max value of three metrics
        // and maps their extent onto the range of the boundedRadius  
        const metricScales1 = metrics.map(metric => (
            d3.scaleLinear()
                .domain(d3.extent(dataset, d => +d[metric]))
                .range([0, dimensions.boundedRadius])
                .nice()
        ))

        const axis = bounds.append("g")
            .style("transform", `translate(${50}px, ${50}px)`)

        // d3.range() returns an array from zero to the specified end minus one 
        const gridCircles = d3.range(6).map((d, i) => (
            axis.append("circle")
                .attr("cx", dimensions.boundedRadius)
                .attr("cy", dimensions.boundedRadius)
                .attr("r", dimensions.boundedRadius * (i / 5))
                .attr("class", "grid-line")
        ))

        const gridLines = metrics.map((metric, i) => {
            const angle = i * ((Math.PI * 2) / metrics.length) - Math.PI * 0.5
            return axis.append("line")
                .attr("x1", dimensions.boundedWidth / 2)
                .attr("x2", Math.cos(angle) * dimensions.boundedRadius + dimensions.boundedWidth / 2)
                .attr("y1", dimensions.boundedHeight / 2)
                .attr("y2", Math.sin(angle) * dimensions.boundedRadius + dimensions.boundedWidth / 2)
                .attr("class", "grid-line")
        })

        // 5. Draw data

        // Sequential color palette based on Brewer scheme https://github.com/d3/d3-scale-chromatic
        var myColor = d3.scaleSequential(d3.interpolatePiYG)//d3.interpolatePRGn
            .domain([0, 161]);
        // .interpolator(d3.interpolateViridis);
        

        const line = bounds.append("path")
            .attr("class", "line")
            .attr("stroke", function (d) { return myColor(countryData.freedomRank) })
            .attr("fill", function (d) { return myColor(countryData.freedomRank) })

        const drawLine = (country) => {
            const lineGenerator = d3.lineRadial()
                .angle((metric, i) => i * ((Math.PI * 2) / metrics.length))
                .radius((metric, i) => metricScales1[i](+country[metric] || 0))
                .curve(d3.curveLinearClosed)

            const line = bounds.select(".line")
                .datum(metrics)
                .attr("d", lineGenerator)
                .style("transform", `translate(${dimensions.boundedRadius + 50}px, ${dimensions.boundedRadius + 50}px)`)
        }

        const country = axis.append("text")
            .attr("class", "metric-label2")
            .attr("x", dimensions.boundedRadius)
            .attr("y", dimensions.boundedRadius + 120)
            .attr("text-anchor", "middle")
            .text(countryData.country)
            .style("font-size", 20)
            .style("font-family", "Bai Jamjuree")
            .attr("fill", function (d) { return myColor(countryData.freedomRank) })

        const rank = axis.append("text")
            .attr("class", "metric-label2")
            .attr("x", dimensions.boundedRadius)
            .attr("y", dimensions.boundedRadius - 110)
            .attr("text-anchor", "middle")
            .text(countryData.freedomRank)
            .style("font-size", 20)
            .attr("fill", function (d) { return myColor(countryData.freedomRank) })

        drawLine(countryData)

    }

}
drawRadar()

