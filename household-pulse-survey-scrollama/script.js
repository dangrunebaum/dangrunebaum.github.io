
// Header parallax function
(function(){

    var parallax = document.querySelectorAll("header"),
        speed = 0.5;
  
    window.onscroll = function(){
      [].slice.call(parallax).forEach(function(el,i){
  
        var windowYOffset = -window.pageYOffset,
            elBackgrounPos = "10% " + (windowYOffset * speed) + "px";
  
        el.style.backgroundPosition = elBackgrounPos;
  
      });
    };
  
  })();
  
// initialize scrollama
var scroller = scrollama();

function init() {

    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.4,
            debug: true
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

}

// scrollama event handlers
function handleStepEnter(response) {
    console.log(response)
    // add css active pseudo class
    response.element.classList.add('active')

    // get the data step attribute which has our "stacked, grouped, or percent value"
    var chartType = response.element.getAttribute("data-step")
    changeChart(chartType)

}


function handleStepExit(response) {
    console.log(response)
    response.element.classList.remove('active')
    d3.selectAll('.line') // Remove lines but leave bars
        .transition() // Transition method
        .duration(300) // Set timing (ms)
        .ease(d3.easeLinear) // Set easing 
        .remove();

        // Stop labels from writing atop eachother
    d3.selectAll('.labels')
        .remove();
}

// kick things off by calling init function
init();

function changeChart(value) {

    // if (value === 'covid') transitionCovid();
    if (value === 'anxiety') transitionAnxiety();
    else if (value === 'depression') transitionDepression();
    else if (value === 'race') transitionRace();
    else if (value === 'age') transitionAge();
    else if (value === 'treatment') transitionTreatment();
    else if (value === 'covid')  transitionCovid();

}

// SVG defined globally
const margin = {
    left: 100,
    right: 200,
    top: 100,
    bottom: 100
}

const svgWidth = 1000
const svgHeight = svgWidth * 0.6

// Helper calculated variables for inner width & height
const height = svgHeight - margin.top - margin.bottom
const width = svgWidth - margin.left - margin.right

// Add SVG
const svg = d3.select('figure')
    .append('svg')
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // responsive width & height
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function transitionCovid() {

            
        // Remove old labels before drawing new ones
        d3.selectAll('.labels')
            .remove();
        // Draw the labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill', '#303030')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(1000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('COVID-19 Daily Case Count')
            .attr('class', 'labels')

}

// First chart change function shows anxiety line
function transitionAnxiety() {

    (async () => {

        const data = await d3.csv('./Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')


        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Anxiety Disorder" && d.Group === "National Estimate" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        const data2 = await d3.csv('./covid.csv')

        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)

        /////////////// Scales /////////////
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        // console.log(filterData.map(d => d.Value))
        // console.log(d3.extent(filterData, function (d) { return +d.Value; }))

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        // Remove old lines before adding new ones
        d3.selectAll('.line')
            .remove();

        // Draw the lines
        svg.selectAll("myline")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "indianred")
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing 
            .attr("stroke-width", 4)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveNatural)
                    .x(function (d) { return xScale(d['Time Period Label']); })
                    .y(function (d) { return yScale(d.Value); })
                    (d.values)
            })
            .attr('class', 'line')
        
        // Remove old labels before drawing new ones
        d3.selectAll('.labels')
            .remove();
        // Draw the labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill', 'indianred')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('Symptoms of Anxiety Disorder')
            .attr('class', 'labels')


    })()

}

function transitionDepression() {

    (async () => {


        const data = await d3.csv('./Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Depressive Disorder" && d.Group === "National Estimate" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)


        ////////////////////////////////////
        /////////////// Scales /////////////
        ////////////////////////////////////

        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        // console.log(filterData.map(d => d.Value))
        // console.log(d3.extent(filterData, function (d) { return +d.Value; }))

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        // Remove old lines before adding new ones
        d3.selectAll('.line')
            .remove();

        // Draw the lines
        svg.selectAll("myline")
            .data(sumstat)
            .enter()
            .append("path")
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing 
            .attr("fill", "none")
            .attr("stroke", "royalblue")
            .attr("stroke-width", 4)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveNatural)
                    .x(function (d) { return xScale(d['Time Period Label']); })
                    .y(function (d) { return yScale(d.Value); })
                    (d.values)
            })
            .attr('class', 'line')

        // Remove old labels before drawing new ones
        d3.selectAll('.labels')
            .remove();
            
        // Draw the labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill', 'royalblue')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('Symptoms of Depressive Disorder')
            .attr('class', 'labels')

    })()

}

function transitionRace() {

    (async () => {

        const data = await d3.csv('./Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Anxiety Disorder or Depressive Disorder" && d.Group === "By Race/Hispanic ethnicity" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)

        ////////////////////////////////////
        /////////////// Scales /////////////
        ////////////////////////////////////
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        // console.log(filterData.map(d => d.Value))
        // console.log(d3.extent(filterData, function (d) { return +d.Value; }))

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        // Color scale's keys = list of Group names
        const res = sumstat.map(function (d) { return d.key })
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(res)

        // Remove old lines before adding new ones
        d3.selectAll('.line')
            .remove();

        // Draw the lines
        svg.selectAll("myline")
            .data(sumstat)
            .enter()
            .append("path")
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing 
            .attr("stroke", d => color(d.key))
            .attr("fill", "none")
            .attr("stroke-width", 4)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveNatural)
                    .x(function (d) { return xScale(d['Time Period Label']); })
                    .y(function (d) { return yScale(d.Value); })
                    (d.values)
            })
            .attr('class', 'line')

        // Draw the labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill', '#303030')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing
            .style('fill-opacity', 1)
            .text('Symptoms of Anxiety or Depressive Disorders by Race')
            .attr('class', 'labels')

        // Remove old labels before drawing new ones
        d3.selectAll('.labels')
            .remove();

        svg.selectAll('mytext')
            .data(sumstat)
            .enter()
            .append('text')
            .attr("transform", function (d) {
                return "translate(" + (width + 5) + "," + yScale(d.values[d.values.length - 1].Value) + ")";
            })
            .attr("fill", function (d) { return color(d.key) })
            .style('font-size', '0.75em')
            .text(d => d.key)
            .attr('class', 'labels')

    })()

}

function transitionAge() {

    (async () => {

        const data = await d3.csv('./Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Symptoms of Anxiety Disorder or Depressive Disorder" && d.Group === "By Age" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )


        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)

        ////////////////////////////////////
        /////////////// Scales /////////////
        ////////////////////////////////////
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        // console.log(filterData.map(d => d.Value))
        // console.log(d3.extent(filterData, function (d) { return +d.Value; }))

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        // Color scale's keys = list of Group names
        const res = sumstat.map(function (d) { return d.key })
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(res)

        // Remove old lines before adding new ones
        d3.selectAll('.line')
            .remove();

        // Draw the lines
        svg.selectAll("myline")
            .data(sumstat)
            .enter()
            .append("path")
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing 
            .attr("stroke", d => color(d.key))
            .attr("fill", "none")
            .attr("stroke-width", 4)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveNatural)
                    .x(function (d) { return xScale(d['Time Period Label']); })
                    .y(function (d) { return yScale(d.Value); })
                    (d.values)
            })
            .attr('class', 'line')

        // Remove old labels before drawing new ones
        d3.selectAll('.labels')
            .remove();
        // Draw the labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill', '#303030')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing

            .style('fill-opacity', 1)
            .text('Symptoms of Anxiety or Depressive Disorders by Age')
            .attr('class', 'labels')


        svg.selectAll('mytext')
            .data(sumstat)
            .enter()
            .append('text')
            .attr("transform", function (d) {
                return "translate(" + (width + 5) + "," + yScale(d.values[d.values.length - 1].Value) + ")";
            })
            .attr("fill", function (d) { return color(d.key) })
            .style('font-size', '0.75em')
            .text(d => d.key)
            .attr('class', 'labels')

    })()

}


function transitionTreatment() {

    (async () => {


        const data = await d3.csv('./Mental_Health_Care_in_the_Last_4_Weeks.csv')

        let filterData = data.filter(function (d) {
            return d.Indicator === "Needed Counseling or Therapy But Did Not Get It, Last 4 Weeks" && d.Group === "National Estimate" && d.Value !== ""
        });

        filterData.forEach(
            function (d) { d.Value = +d.Value; }
        )

        // Reshape data with keys set to Subgroups of each Group
        let sumstat = d3.nest()
            .key(function (d) { return d.Subgroup })
            .entries(filterData)

        ////////////////////////////////////
        /////////////// Scales /////////////
        ////////////////////////////////////

        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d['Time Period Label']; }))
            .range([0, width])
            .paddingInner(1)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filterData, function (d) { return d.Value; }))
            .range([height, 0])
            .nice();

        // Remove old lines before adding new ones
        d3.selectAll('.line')
            .remove();

        // Draw the lines
        svg.selectAll("myline")
            .data(sumstat)
            .enter()
            .append("path")
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing 
            .attr("fill", "none")
            .attr("stroke", "salmon")
            .attr("stroke-width", 4)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveNatural)
                    .x(function (d) { return xScale(d['Time Period Label']); })
                    .y(function (d) { return yScale(d.Value); })
                    (d.values)
            })
            .attr('class', 'line')

        // Remove old labels before drawing new ones
        d3.selectAll('.labels')
            .remove();
        // Draw the labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -50)
            .style('text-anchor', 'middle')
            .style('font-size', '1.5em')
            .style('fill', 'salmon')
            .style('fill-opacity', 0)
            .transition() // Transition method
            .duration(2000) // Set timing (ms)
            .ease(d3.easeLinear) // Set easing      
            .style('fill-opacity', 1)
            .text("Needed Counseling or Therapy But Did Not Get It, Last 4 Weeks")
            .attr('class', 'labels')

    })()

}

// Anonymous async function draws Covid case count bar chart
(async () => {

    // Data wrangling
    const data = await d3.csv('./Indicators_of_Anxiety_or_Depression_Based_on_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv')

    const data2 = await d3.csv('./covid.csv')

    // Scales
    const xScale2 = d3.scaleBand()
        .domain(data2.map(function (d) { return d.date; }))
        .range([0, width]);

    const xScale = d3.scaleBand()
        .domain(data.map(function (d) { return d['Time Period Label']; }))
        .range([0, width])
        .paddingInner(1)

    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    const yScale2 = d3.scaleLinear()
        .domain(d3.extent(data2, function (d) { return +d.cases; }))
        .range([height, 0])

    // Draw bars
    svg.selectAll("mybar")
        .data(data2)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xScale2(d.date); })
        .attr("y", function (d) { return yScale2(+d.cases); })
        .attr("width", xScale2.bandwidth())
        .attr("height", function (d) { return height - yScale2(d.cases); })
        .style("fill", "#69b3a2");

    svg.append('text')
        .attr('x', width - 125)
        .attr('y', -20)
        .style('font-size', '1.0em')
        .style("fill", "#69b3a2")
        .text('Peak COVID-19');

    // svg.append('text')
    //     .attr('x', width - 120)
    //     .attr('dy', '-.75em')
    //     .style('font-size', '0.75em')
    //     .style('font-weight', 300)
    //     .text('300,416 new cases')

})()
