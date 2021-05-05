// initialize scrollama
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

// scrollama event handlers
function handleStepEnter(response) {
    console.log(response)
    // add css active pseudo class
    // response.element.classList.add('active')

    // get the data step attribute which has our "stacked, grouped, or percent value"
    var chartType = response.element.getAttribute("data-step")
    changeChart(chartType)

}

// kick things off by calling init function
init();

function changeChart(value) {

    if (value === 'olive') transitionOlive();
    else if (value === 'orange') transitionOrange();
    else if (value === 'blue') transitionBlue();

}

function transitionOlive() {

    d3.select('figure').append('svg')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 300)
        .attr('height', 150)
        .transition(1000)
        .style('fill', 'olive');

}


function transitionOrange() {

    d3.select('figure').append('svg')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 300)
        .attr('height', 150)
        .transition(1000)
        .style('fill', 'orange');

}


function transitionBlue() {

    d3.select('figure').append('svg')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 300)
        .attr('height', 150)
        .transition(1000)
        .style('fill', 'royalblue');

}

function handleStepExit(response) {
    console.log(response)
    d3.selectAll('svg')
        .remove();
    // response.element.classList.remove('active')
}


