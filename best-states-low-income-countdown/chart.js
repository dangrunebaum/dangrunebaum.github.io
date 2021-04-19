/*
radar function takes form of click-through reverse countdown of countries. 
*/

async function drawRadar1() {

    // 1. Access data
    let dataset = await d3.csv("./HCI_B_W_Master Data.csv")

    const stateRankAccessor = d => d.StateRank
    const stateAccessor = d => d.State
    dataset1 = dataset.sort((a, b) => stateAccessor(a) - stateAccessor(b))

    const metrics1 = [
        "Cost",
        "Quality",
        "Access"
    ]

    // 2. Create chart dimensions
    const width1 = 600
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
 svgWidth = dimensions1.boundedWidth1 = dimensions1.width1 - dimensions1.margin1.left1 - dimensions1.margin1.right1
  svgheight = dimensions1.boundedHeight1 = dimensions1.height1 - dimensions1.margin1.top1 - dimensions1.margin1.bottom1
    dimensions1.boundedRadius1 = dimensions1.radius1 - ((dimensions1.margin1.left1 + dimensions1.margin1.right1) / 2)

    // 3. Draw canvas
    const wrapper1 = d3.select("#wrapper1")
        .append("svg")
        .attr("viewBox", `0 0 ${dimensions1.width1} ${dimensions1.height1}`)
        // .attr("width", dimensions1.width1)
        // .attr("height", dimensions1.height1)

    const bounds1 = wrapper1.append("g")
        .style("transform", `translate(${dimensions1.margin1.left1}px, ${dimensions1.margin1.top1 - 200}px)`)

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

    // const tick1 = d3.range(1).map((d, i) => {
    //     axis1.append("text")
    //         .attr("x", dimensions1.boundedRadius1 - 8)
    //         .attr("y", dimensions1.boundedRadius1 * (i / 1) - 3)
    //         .text("50")
    //         .attr("class", "grid-line")
    // })

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
            // .transition() // Transition method
            // .duration(300) // Set timing (ms)
            // .ease(d3.easeLinear) // Set easing
            .attr("d", lineGenerator1)
            .style("transform", `translate(${dimensions1.boundedRadius1}px, ${dimensions1.boundedRadius1}px)`)
    }

    let activeStateIndex = 0 // set state to 0
    const rank = d3.select("#rank")
    const state = d3.select("#state")
    const reversed = dataset.reverse() // reverse countdown  
    // Update rank and state text, and draw line by calling index n of dataset.
    const updateChart = () => {
        rank.text(stateRankAccessor(dataset[activeStateIndex]))
        state.text(stateAccessor(dataset[activeStateIndex]))
        drawLine1(dataset[activeStateIndex])
    }
    updateChart()

    // Update state on click by calling updateChart function. 
    // activeStateIndex counter adds 1 for each button click,
    // until n/reversed.length is -52, making the remainder 0 again.

    d3.select("#next-state").on("click", e => {
        activeStateIndex = (activeStateIndex + 1) % reversed.length
        updateChart()
    })

    // Define function for setInterval countdown
    function changeActiveStateIndex() {
        activeStateIndex = (activeStateIndex + 1) % reversed.length
        updateChart()
    }

    // Start countdown with click
    let myVar;
    d3.select('#start').on('click', e => {
        activeStateIndex = (activeStateIndex + 1) % reversed.length
         myVar = setInterval(changeActiveStateIndex, 1000)
        updateChart()
    })
    // Stop countdown with click
    d3.select('#stop').on('click', e => {
        clearInterval(myVar)
    })

}
drawRadar1()

