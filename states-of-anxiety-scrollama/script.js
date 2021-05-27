

// Header parallax function for dynamic image movement
(function () {

    var parallax = document.querySelectorAll("header"),
        speed = 0.5;

    window.onscroll = function () {
        [].slice.call(parallax).forEach(function (el, i) {

            var windowYOffset = -window.pageYOffset,
                elBackgrounPos = "10% " + (windowYOffset * speed) + "px";

            el.style.backgroundPosition = elBackgrounPos;

        });
    };

})();

// Initialize scrollama
var scroller = scrollama();

function init() {

    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.5,
            debug: true
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

}

// Scrollama event handlers
function handleStepEnter(response) {
    console.log(response)
    // Add css active pseudo class for style interactivity
    response.element.classList.add('active')

    // Geet the data step attribute which has our function values
    var chartType = response.element.getAttribute("data-step")
    changeChart(chartType)

    // Remove items before redrawing
    d3.selectAll('.line') // Remove lines
        .remove();

    d3.selectAll('rect') // Remove bars
        .remove();

    d3.selectAll('.labels') // Remove labels
        .remove();

    d3.selectAll('.legend') // Remove legend
        .remove();

    d3.selectAll('.axis') // Remove Y axis
        .remove();
}


function handleStepExit(response) {
    console.log(response)
    response.element.classList.remove('active')

    // Remove items before redrawing
    d3.selectAll('.line') // Remove lines
        .remove();

    d3.selectAll('rect') // Remove bars
        .remove();

    d3.selectAll('.labels') // Remove labels
        .remove();

    d3.selectAll('.legend') // Remove legend
        .remove();

    d3.selectAll('.axis') // Remove Y axis
        .remove();

}

// Kick things off by calling init function
init();

// Update chart function
function changeChart(value) {

    if (value === 'covid') transitionCovid();
    else if (value === 'anxiety') transitionAnxiety();
    else if (value === 'vaccine') transitionVaccine();
    else if (value === 'states') transitionStates();

}

// SVG defined globally
const margin = {
    left: 100,
    right: 50,
    top: 100,
    bottom: 150
}

const svgWidth = 1000
const svgHeight = svgWidth * 0.7

// Variables for inner width & height
const height = svgHeight - margin.top - margin.bottom
const width = svgWidth - margin.left - margin.right

// Add SVG
const svg = d3.select('figure')
    .append('svg')
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // responsive width & height
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append X axis and leave in place through all steps
function appendXscale() {

    (async () => {

        // Load anxiety data
        const data = await d3.csv('https://content-static.healthcare.inc/data/Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        const xScale = d3.scaleBand() // Scale for dates
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        // Append X axis
        svg.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")

        // Peripherals
        svg.append('text')
            .attr('x', 0)
            .attr('y', height + 130)
            .style('font-size', '1.5em')
            .text('2020')

        svg.append('text')
            .attr('x', width)
            .attr('y', height + 130)
            .style("text-anchor", "end")
            .style('font-size', '1.5em')
            .text('2021')


    })()
}
appendXscale();

// First chart shows Covid case count bars
function transitionCovid() {

    // Anonymous async function draws Covid case count bar chart
    (async () => {

        // Load anxiety data
        const data = await d3.csv('https://content-static.healthcare.inc/data/Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')
        // Load covid case count data
        const data2 = await d3.csv('https://content-static.healthcare.inc/data/covid.csv')


        // Scales and axes for covid
        const xScale2 = d3.scaleBand() // Scale for Covid case count
            .domain(data2.map(function (d) { return d.date; }))
            .range([0, width]);

        const yScale2 = d3.scaleLinear() // Scale for Covid case count
            // .domain(d3.extent(data2, function (d) { return +d.cases; }))
            .domain([0, 301000])
            .range([height, 0])

        // console.log(d3.extent(data2, function (d) { return +d.cases; }))

        d3.selectAll('rect') // Remove bars
            .remove();

        // Draw Covid bars
        svg.selectAll("covidBars")
            .data(data2)
            .enter()
            .append("rect")
            .attr("x", function (d) { return xScale2(d.date); })
            .attr("y", function (d) { return yScale2(0); })
            .attr("width", xScale2.bandwidth())
            .attr("height", function (d) { return (height) - yScale2(0); }) // always equal to 0
            .style("fill", "#69b3a2");

        // Animation
        svg.selectAll("rect")
            .transition()
            .duration(2000)
            .attr("y", function (d) { return yScale2(+d.cases); })
            .attr("height", function (d) { return height - yScale2(+d.cases); })
            .delay(function (d, i) { return (i * 5) })

        d3.selectAll('.labels') // Remove labels
            .remove();

        // Labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('COVID-19 Daily Case Count')
            .attr('class', 'labels')

        d3.selectAll('.legend') // Remove legend
            .remove();

        // Legend
        const legend = svg.append('g')
            .attr('class', 'legend')

        legend.append('line')
            .attr('x1', width / 2 - 70)
            .attr('y1', height + 125)
            .attr('x2', width / 2 - 10)
            .attr('y2', height + 125)
            .style('stroke-width', 4)
            .style("stroke", "#69b3a2");

        legend.append('text').attr('font-size', '1.25em')
            .attr('x', width / 2)
            .attr('y', height + 125)
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'start')
            .transition() // Transition method
            .duration(3000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .text('COVID-19 Cases')

        d3.selectAll('.labels') // Remove labels
            .remove();

        // Append Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale2)
                .ticks(3))
            .attr('class', 'axis')
            .call(g => g.select('g g.axis g.tick text')
            .remove()) // Remove 0 from y axis;

        // // Covid case count label
        svg.append('text')
            .attr('x', width - 140)
            .attr('y', -20)
            .style('font-size', '0.75em')
            .attr("fill", "#69b3a2")
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .delay(3000)
            .style('fill-opacity', 1)
            .text('Peak COVID-19')
            .attr('class', 'labels')

        svg.append('text')
            .attr('x', width - 140)
            .attr('dy', '-.75em')
            .style('font-size', '0.75em')
            .style('font-weight', 300)
            .attr("fill", "#69b3a2")
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .delay(3000)
            .style('fill-opacity', 1)
            .text('300,416 new cases')
            .attr('class', 'labels')

    })()

}


// Second chart shows national anxiety line 
function transitionAnxiety() {

    (async () => {

        const data = await d3.csv('https://content-static.healthcare.inc/data/Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Anxiety Disorder" && d.Group === "National Estimate" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        /////////////// Scales /////////////
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        const line = d3.line()
            .curve(d3.curveNatural)
            .x(function (d) { return xScale(d['Time Period Label']); })
            .y(function (d) { return yScale(d.Value); })

        d3.selectAll('.line') // Remove lines
            .remove();

        // Draw the anxiety line
        const path = svg.append("path")
            .datum(filterData)
            .attr('d', line)
            .style('stroke', 'indianred')
            .attr('class', 'line');

        // Variable to hold total length for line animation
        const totalLength = path.node().getTotalLength();

        // Set properties of dash array and dash offset and initiate transition
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call transition method
            .duration(3000) // Set duration timing (ms)
            .ease(d3.easeLinear) // Set easing option
            .attr("stroke-dashoffset", 0)// Set final value of dash-offset for transition
            .attr("fill", "none")
            .attr("stroke", "url(#line-gradient)");

        d3.selectAll('.labels') // Remove labels
            .remove();

        // Labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('Symptoms of Anxiety Disorder, United States')
            .attr('class', 'labels')

        d3.selectAll('.legend') // Remove legend
            .remove();

        // Legend
        const legend = svg.append('g')
            .attr('class', 'legend')

        legend.append('line')
            .attr('x1', width / 2 - 70)
            .attr('y1', height + 125)
            .attr('x2', width / 2 - 10)
            .attr('y2', height + 125)
            .style('stroke-width', 4)
            .style("stroke", "indianred");

        legend.append('text').attr('font-size', '1.25em')
            .attr('x', width / 2)
            .attr('y', height + 125)
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'start')
            .transition() // Transition method
            .duration(3000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .text('Anxiety Symptoms, Last 7 Days')

        d3.selectAll('.axis') // Remove Y axis
            .remove();

        // Append Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale)
                .tickFormat(d => d + '%')
                .ticks(5))
            .attr('class', 'axis');

        d3.selectAll('.labels') // Remove labels
            .remove();

        svg.append('text')
            .attr('x', -150)
            .attr('y', -60)
            .attr("transform", "rotate(-90)")
            .style('text-anchor', 'middle')
            .text('Percent of Survey Population')
            .attr('class', 'labels')

    })()

}

// Third chart shows anxiety against vaccines
function transitionVaccine() {

    (async () => {

        const data = await d3.csv('https://content-static.healthcare.inc/data/Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Anxiety Disorder" && d.Group === "National Estimate" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)

        // Scales for anxiety line
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        // Vaccine data 
        const data2 = await d3.csv('https://content-static.healthcare.inc/data/vaccines.csv')

        // Scales for vaccine bars
        const xScale2 = d3.scaleBand()
            .domain(data2.map(function (d) { return d.date; }))
            .range([620, width]);

        const yScale2 = d3.scaleLinear()
            .domain(d3.extent(data2, function (d) { return +d.total_vaccinations; }))
            .range([height, 0])

        d3.selectAll('rect') // Remove bars
            .remove();

        // Draw vaccine bars
        svg.selectAll("vaccineBars")
            .data(data2)
            .enter()
            .append("rect")
            .attr("x", function (d) { return xScale2(d.date); })
            .attr("y", function (d) { return yScale2(0); })
            .attr("width", xScale2.bandwidth())
            .attr("height", function (d) { return height - yScale2(0); }) // always equal to 0
            .style("fill", "royalblue")
            .style("opacity", 0.8);

        // Animate vaccine bars
        svg.selectAll("rect")
            .transition()
            .duration(2000)
            .attr("y", function (d) { return yScale2(+d.total_vaccinations); })
            .attr("height", function (d) { return height - yScale2(+d.total_vaccinations); })
            .delay(function (d, i) { return (i * 5) })

        d3.selectAll('.line') // Remove lines
            .remove();

        // Draw anxiety line
        svg.selectAll("myline")
            .data(sumstat)
            .enter()
            .append("path")
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing 
            .attr("fill", "none")
            .attr("stroke", "indianred")
            .attr("stroke-width", 4)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveNatural)
                    .x(function (d) { return xScale(d['Time Period Label']); })
                    .y(function (d) { return yScale(d.Value); })
                    (d.values)
            })
            .attr('class', 'line')

        d3.selectAll('.labels') // Remove labels
            .remove();

        // Labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('Symptoms of Anxiety Disorder and COVID-19 Vaccines')
            .attr('class', 'labels')

        d3.selectAll('.legend') // Remove legend
            .remove();

        // Legend
        const legend = svg.append('g')
            .attr('class', 'legend')

        legend.append('line')
            .attr('x1', 150)
            .attr('y1', height + 125)
            .attr('x2', 200)
            .attr('y2', height + 125)
            .style('stroke-width', 4)
            .style("stroke", "indianred");

        legend.append('text').attr('font-size', '1.25em')
            .attr('x', 210)
            .attr('y', height + 125)
            .attr('dominant-baseline', 'middle')
            .text('Anxiety Symptoms, Last 7 Days')

        legend.append('line')
            .attr('x1', 500)
            .attr('y1', height + 125)
            .attr('x2', 550)
            .attr('y2', height + 125)
            .style('stroke-width', 4)
            .style("stroke", "blue");

        legend.append('text').attr('font-size', '1.25em')
            .attr('x', 560)
            .attr('y', height + 125)
            .attr('dominant-baseline', 'middle')
            .text('COVID-19 Vaccines')

        d3.selectAll('.axis') // Remove Y axis
            .remove();

        // Append Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale)
                .tickFormat(d => d + '%')
                .ticks(5))
            .attr('class', 'axis');

        d3.selectAll('.labels') // Remove labels
            .remove();

        svg.append('text')
            .attr('x', -150)
            .attr('y', -60)
            .attr("transform", "rotate(-90)")
            .style('text-anchor', 'middle')
            .text('Percent of Survey Population')
            .attr('class', 'labels')

    })()

}

// Last function draws Wyoming line
function transitionStates() {

    (async () => {

        const data = await d3.csv('https://content-static.healthcare.inc/data/Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Anxiety Disorder" && d.State === "Wyoming" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)

        // Scales for Wyoming anxiety line
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        const line = d3.line()
            .curve(d3.curveNatural)
            .x(function (d) { return xScale(d['Time Period Label']); })
            .y(function (d) { return yScale(d.Value); })

        // Draw the Wyoming line
        const path = svg.append("path")
            .datum(filterData)
            .attr('class', 'line')
            .attr('d', line)
            .style('stroke', '#FFA45A')

        // Variable to hold total length for line animation
        const totalLength = path.node().getTotalLength();

        // Set properties of dash array and dash offset and initiate transition
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call transition method
            .duration(3000) // Set duration timing (ms)
            .ease(d3.easeLinear) // Set easing option
            .attr("stroke-dashoffset", 0)// Set final value of dash-offset for transition
            .attr("fill", "none")
            .attr("stroke", "url(#line-gradient)");

        d3.selectAll('.labels') // Remove labels
            .remove();

        // Labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('State Where Anxiety Eased the Most')
            .attr('class', 'labels')

        d3.selectAll('.legend') // Remove legend
            .remove();

        // Legend
        const legend = svg.append('g')
            .attr('class', 'legend')

        legend.append('line')
            .attr('x1', width / 2 - 70)
            .attr('y1', height + 125)
            .attr('x2', width / 2 - 10)
            .attr('y2', height + 125)
            .style('stroke-width', 4)
            .style("stroke", "#FFA45A");

        legend.append('text').attr('font-size', '1.25em')
            .attr('x', width / 2)
            .attr('y', height + 125)
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'start')
            .transition() // Transition method
            .duration(3000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .text('Wyoming')

        d3.selectAll('.axis') // Remove Y axis
            .remove();

        // Append Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale)
                .tickFormat(d => d + '%')
                .ticks(5))
            .attr('class', 'axis');

        d3.selectAll('.labels') // Remove labels
            .remove();

        svg.append('text')
            .attr('x', -150)
            .attr('y', -60)
            .attr("transform", "rotate(-90)")
            .style('text-anchor', 'middle')
            .text('Percent of Survey Population')
            .attr('class', 'labels')

    })()

}

