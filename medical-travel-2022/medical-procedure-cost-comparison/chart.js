(async() => {

    ////////////////////////////////////
    ///////////// SVG Setup ////////////
    ////////////////////////////////////

    const margin = {
        top: 100,
        right: 10,
        bottom: 20,
        left: 176
    }

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

    data = await d3.csv("./medical-travel-procedure-costs-US-Mexico-Thai-Turkey.csv")

    data.forEach(
        d => {
                // Normalize to 100%
                d.US = +d.US_avg / (+d.US_avg + +d.Mexico_avg + +d.Thailand_avg + +d.Turkey_avg) * 100,
                d.Mexico = +d.Mexico_avg / (+d.US_avg + +d.Mexico_avg + +d.Thailand_avg + +d.Turkey_avg) * 100,
                d.Thailand = +d.Thailand_avg / (+d.US_avg + +d.Mexico_avg + +d.Thailand_avg + +d.Turkey_avg) * 100,
                d.Turkey = +d.Turkey_avg / (+d.US_avg + +d.Mexico_avg + +d.Thailand_avg + +d.Turkey_avg) * 100;
        });


    // List of subgroups = costs in 4 countries 
    const subgroups = ["US", "Mexico", "Thailand", "Turkey"]

    // List of groups = procedures
    const groups = d3.map(data, function(d) {
        return (d.Procedure)
    }).keys()

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
        .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c'])

    ////////////////////////////////////
    ///////// Draw Items ///////////////
    ////////////////////////////////////

    // The first bars show subgroup percentages
    svg.append("g")
        .selectAll("g")
        // Enter the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .enter().append("rect")
        .attr("y", d => yScale(d.data.Procedure))
        .attr("x", d => xScale(d[0]))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d[1]) - xScale(d[0]));

    // The second set of bars is overlayed for darkened mouseover effect
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", 'rgba(50,50,50, 0.001')
        .selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("y", function(d) {
            return yScale(d.data.Procedure);
        })
        .attr("x", function(d) {
            return xScale(0);
        })
        .attr("height", yScale.bandwidth())
        .attr("width", width)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .attr('class', 'bars');

    ////////////////////////////////////
    ///////// Interactions /////////////
    ////////////////////////////////////

    const formatComma = d3.format(",");
    function mouseover(d) {
        let tipUs = formatComma(d.data.US_avg)
        let tipMexico = formatComma(d.data.Mexico_avg)
        let tipThailand = formatComma(d.data.Thailand_avg)
        let tipTurkey = formatComma(d.data.Turkey_avg)
        tooltipDiv.transition()
            .duration(100)
            .style("opacity", 1.0);
        tooltipDiv.html(
                "<b>US: </b>" + "$" + tipUs + "<br>" +
                "<b>Mexico: </b>" + "$" + tipMexico + "<br>" +
                "<b>Thailand: </b>" + "$" + tipThailand + "<br>" +
                "<b>Turkey: </b>" + "$" + tipTurkey
            )
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 130) + "px")
    }

    function mouseout() {

        tooltipDiv.transition()
            .duration(200)
            .style("opacity", 0)

    }

    ////////////////////////////////////
    ///////// Legend ///////////////////
    ////////////////////////////////////

    const legend = svg.selectAll('circles')
        .data(stackedData)
        .enter()
        .append('circle')
        .attr('cx', (d, i) =>  i * 200 + 50)
        .attr('cy', -25)
        .attr('r', 10)
        .attr("fill", d => color(d.key));

    svg.selectAll("labels")
        .data(subgroups)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 200 + 70)
        .attr('y', -20)
        .style("fill", d => color(d))
        .attr("text-anchor", "left")
        .style("font-family", "Proxima Nova")
        .style("font-weight", 700)
        .text(d => d)

    svg.append('text')
        .attr('x', width / 2 )
        .attr('y', -70)
        .style("text-anchor", "middle")
        .style('font-size', '1.5em')
        .style("font-weight", 600)
        .style('fill', 'dimgray')
        .text("Procedure Costs: U.S. vs Mexico, Thailand and Turkey");

        svg
        .append("text")
        .attr("x", 0)
        .attr("y", svgHeight - 110)
        .style("font-family", "Proxima Nova,sans-serif")
        .style("font-size", "12px")
        .style("font-weight", 300)
        .style("fill", "dimgray")
        .text("HealthCare.com analysis of Medical Departures data");
})()