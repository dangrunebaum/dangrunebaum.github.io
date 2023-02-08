// SCROLLAMA SECTION //

// d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("#data_viz_1");
var article = scrolly.select("article");
var step = article.selectAll(".step");
// Initialize scrollama
var scroller = scrollama();
// Window resize listener event
function handleResize() {
  // Update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");
  var figureHeight = window.innerHeight / 2;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;
  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");
  // Tell scrollama to update new element dimensions
  scroller.resize();
}
// Scrollama event handlers
function handleStepEnter(response) {
  //   console.log(response);
  // response.element.classList.add('active')
  // Get the data step attribute
  var chartType = response.element.getAttribute("data-step");
  changeChart(chartType);
}
function init() {
  // Force resize on load to ensure proper dimensions are sent to scrollama
  handleResize();
  // Setup the scroller, initialize trigger observations, bind scrollama event handlers
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.5,
      debug: false,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
  // Setup resize event
  window.addEventListener("resize", handleResize);
}

function handleStepExit(response) {
  d3.select(".yAxis").remove();
  d3.select("#weeks").remove();
  // console.log(response);
  // response.element.classList.remove('active')
}

// Kick things off
init();

function changeChart(value) {
  // if (value === "top") return;
  if (value === "one") transitionOne();
  else if (value === "two") transitionTwo();
  else if (value === "three") transitionThree();
  else if (value === "four") transitionFour();
  else if (value === "five") transitionFive();
}

///////////// SVG SETUP ////////////

const margin = {
  left: 60,
  right: 60,
  top: 80,
  bottom: 50,
};

const svgWidth = 1000;
const svgHeight = svgWidth * 0.7;

const circleSvgWidth = 1500;
const circleSvgHeight = svgWidth;

// helper calculated variables for inner width & height
const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;

// append the svg object to a div
const svg = d3
  .select("#data_viz_1")
  .append("svg")
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // responsive width & height
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "figure");

// Legend
const newArr = ["Health Insurance", "Inflation"];
const color = d3.scaleOrdinal().domain(newArr).range(["#1c75ac", "#bda13e"]);
svg
  .selectAll("mydots")
  .data(newArr)
  .enter()
  .append("circle")
  .attr("class", "legend")
  .attr("opacity", 0)
  .attr("cx", function (d, i) {
    return i * 250;
  })
  .attr("cy", -40)
  .attr("r", 10)
  .style("fill", (d) => color(d));

svg
  .selectAll("mylabels")
  .data(newArr)
  .enter()
  .append("text")
  .attr("class", "legend")
  .attr("opacity", 0)
  .attr("x", function (d, i) {
    return i * 250 + 25;
  })
  .attr("y", -38)
  .style("fill", function (d) {
    return color(d);
  })
  .attr("font-size", "1.5em")
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  .text(function (d) {
    return d;
  });

// Y axis for percentage
const yScale = d3.scaleLinear().domain([0, 300]).range([height, 0]);
let sumstat;
let xScale;
let xAxis;
let line = svg.append("g");
const numberFormat = d3.format(",");
const parseTime = d3.timeParse("%Y");

// First chart shows 1999-2005
function transitionOne() {
  d3.selectAll(".xAxis").remove();
  d3.selectAll(".labels").remove();
  d3.selectAll(".legend").transition().duration(100).attr("opacity", 1);

  (async () => {
    //Data Wrangling
    const data = await d3.csv("./health-insurance-vs-cpi-zeroed.csv");

    // group the data, one line per group
    sumstat = d3
      .nest()
      .key((d) => d.Characteristic)
      .entries(data);

    // Scales
    // X axis turns year numbers into dates
    const parseTime = d3.timeParse("%Y");

    xScale = d3
      .scaleTime()
      .domain([parseTime("1999"), parseTime("2005")])
      .range([0, width]);

    xAxis = svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).ticks(5));

    yAxis = svg
      .append("g")
      .attr("class", "xAxis")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => numberFormat(d) + "%")
          .ticks(4)
          .tickSizeInner(-width) // Gridlines
      );

    // Draw items
    line
      .selectAll(".line")
      .data(sumstat)
      .join("path")
      .transition()
      .duration(1000)
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .attr("stroke-width", 5)
      .attr("d", function (d) {
        return d3
          .line()
          .curve(d3.curveNatural)
          .x(function (d) {
            return xScale(parseTime(+d.Year));
          })
          .y(function (d) {
            return yScale(d.Percent);
          })(d.values);
      })
      .attr("class", "line");
  })();

  // Hide line outside inner dimensions
  svg
    .append("rect")
    .attr("x", width)
    .attr("y", 0)
    .attr("width", margin.right)
    .attr("height", height)
    .attr("fill", "white");
}

// Second chart shows 2005-10
function transitionTwo() {
  d3.selectAll(".labels").remove();
  (async () => {
    const data = await d3.csv("./health-insurance-vs-cpi-zeroed.csv");

    // Update d3 sumstat data structure
    sumstat = d3
      .nest()
      .key((d) => d.Characteristic)
      .entries(data);
    // Update x scale
    xScale = d3
      .scaleTime()
      .domain([parseTime("1999"), parseTime("2010")])
      .range([0, width]);

    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));

    // Draw items
    line
      .selectAll(".line")
      .transition()
      .duration(1000)
      .attr("d", function (d) {
        return d3
          .line()
          .curve(d3.curveNatural)
          .x(function (d) {
            return xScale(parseTime(+d.Year));
          })
          .y(function (d) {
            return yScale(d.Percent);
          })(d.values);
      })
      .attr("class", "line");
  })();
}

// Third chart shows 2010-15
function transitionThree() {
  d3.selectAll(".labels").remove();
  (async () => {
    const data = await d3.csv("./health-insurance-vs-cpi-zeroed.csv");

    // Update d3 sumstat data structure
    sumstat = d3
      .nest()
      .key((d) => d.Characteristic)
      .entries(data);

    xScale = d3
      .scaleTime()
      .domain([parseTime("1999"), parseTime("2015")])
      .range([0, width]);

    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));

    // Draw items
    line
      .selectAll(".line")
      .transition()
      .duration(1000)
      .attr("d", function (d) {
        return d3
          .line()
          .curve(d3.curveNatural)
          .x(function (d) {
            return xScale(parseTime(+d.Year));
          })
          .y(function (d) {
            return yScale(d.Percent);
          })(d.values);
      })
      .attr("class", "line");
  })();
}

// Fourth chart shows 2015-21
function transitionFour() {
  d3.selectAll(".labels").remove();

  (async () => {
    const data = await d3.csv("./health-insurance-vs-cpi-zeroed.csv");

    // Update d3 sumstat data structure
    sumstat = d3
      .nest()
      .key((d) => d.Characteristic)
      .entries(data);

    xScale = d3
      .scaleTime()
      .domain([parseTime("1999"), parseTime("2021")])
      .range([0, width]);

    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));

    // Draw items
    line
      .selectAll(".line")
      .transition()
      .duration(1000)
      .attr("d", function (d) {
        return d3
          .line()
          .curve(d3.curveNatural)
          .x(function (d) {
            return xScale(parseTime(+d.Year));
          })
          .y(function (d) {
            return yScale(d.Percent);
          })(d.values);
      })
      .attr("class", "line");

    // Create array of data points for data labels
    const arr1 = data.slice(22, 23);
    const arr2 = data.slice(-1);
    labelArr = arr1.concat(arr2);

    // Draw the data marks at the line ends
    svg
      .selectAll("labels")
      .data(labelArr)
      .join("text")
      .attr("class", "labels")
      .attr("fill", function (d) {
        return color(d.Characteristic);
      })
      .attr("transform", function (d) {
        return "translate(" + width + "," + yScale(d.Percent) + ")";
      })
      .attr("x", 5)
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("font-size", "1.2em")
      .attr("font-weight", 700)
      .text((d) => numberFormat(Math.round(d.Percent)) + "%")
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay(1000)
      .attr("opacity", 1);
  })();
}

// Fifth chart attaches to step div and shows
// amount of work needed to pay for health insurance
function transitionFive() {
  // Remove before drawing to prevent multiple svgs' being attached
  // d3.select("#weeks").remove();

  const weeksSvg = d3
    .select("#weekChart")
    .append("svg")
    .attr("id", "weeks")
    .attr("viewBox", `0 0 350 150`); // responsive width & height;

  weeksSvg
    .selectAll("squares")
    .data([0, 1]) // for two weeks
    .join("rect")
    .attr("x", (d) => d * 50 + 50)
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", 40)
    .attr("fill", "#1c75ac")
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .delay(250)
    .attr("opacity", (d) => d / 7 + 0.3);

  weeksSvg
    .selectAll("squares")
    .data([0, 1, 2, 3, 4, 5]) // For six weeks
    .join("rect")
    .attr("x", (d) => d * 50 + 50)
    .attr("y", 50)
    .attr("width", 40)
    .attr("height", 40)
    .attr("fill", "#1c75ac")
    .attr("opacity", 0)
    .transition()
    .duration(2000)
    .delay(500)
    .attr("opacity", (d) => d / 7 + 0.3);

  weeksSvg
    .selectAll("years")
    .data([1999, 2021])
    .join("text")
    .attr("x", 0)
    .attr("y", (d, i) => i * 50 + 25)
    // .transition()
    // .duration(1000)
    .attr("font-size", "0.75em")
    .attr("fill", "black")
    .attr("font-weight", 700)
    .text((d) => d);
}
transitionOne(); // Initialize first function to show first chart on page load

////////// LAST CHART SHOWS HEALTH INSURANCE VS HEALTHCARE INFLATION ///////////////

// Append  svg object to a div for health insurance vs healthcare inflation
const svg2 = d3
  .select("#data_viz_2")
  .append("svg")
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // responsive width & height
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "figure");

(async () => {
  //Data Wrangling
  const data = await d3.csv("./health-insurance-vs-healthcare-spending.csv");

  // Update d3 sumstat data structure
  sumstat = d3
    .nest()
    .key((d) => d.Characteristic)
    .entries(data);
  // Scales
  const newArr2 = ["Health Insurance", "Healthcare"];
  const color2 = d3
    .scaleOrdinal()
    .domain(newArr2)
    .range(["#1c75ac", "lightseagreen"]);

  // X axis turns year numbers into dates
  const parseTime = d3.timeParse("%Y");

  xScale2 = d3
    .scaleTime()
    .domain([parseTime("1999"), parseTime("2020")])
    .range([0, width]);

  const yScale2 = d3.scaleLinear().domain([0, 300]).range([height, 0]);

  xAxis2 = svg2
    .append("g")
    .attr("class", "xAxis2")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale2).ticks(5));

  yAxis2 = svg2
    .append("g")
    .attr("class", "xAxis2")
    .call(
      d3
        .axisLeft(yScale2)
        .tickFormat((d) => numberFormat(d) + "%")
        .ticks(4)
        .tickSizeInner(-width) // Gridlines
    );

  // Draw items
  svg2
    .append("g")
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color2(d.key);
    })
    .attr("stroke-width", 5)
    .attr("d", function (d) {
      return d3
        .line()
        .curve(d3.curveNatural)
        .x(function (d) {
          return xScale2(parseTime(+d.Year));
        })
        .y(function (d) {
          return yScale2(d.Percent);
        })(d.values);
    });

  // Legend 2 for bottom chart
  svg2
    .selectAll("mydots")
    .data(newArr2)
    .enter()
    .append("circle")
    .attr("class", "legend2")
    .attr("cx", function (d, i) {
      return i * 250;
    })
    .attr("cy", -40)
    .attr("r", 10)
    .style("fill", (d) => color2(d));

  svg2
    .selectAll("mylabels")
    .data(newArr2)
    .enter()
    .append("text")
    .attr("class", "legend2")
    .attr("x", function (d, i) {
      return i * 250 + 25;
    })
    .attr("y", -38)
    .style("fill", function (d) {
      return color2(d);
    })
    .attr("font-size", "1.5em")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .text(function (d) {
      return d;
    });

  // Create array of data points for data labels
  const arr1 = data.slice(21, 22);
  const arr2 = data.slice(-1);
  labelArr = arr1.concat(arr2);

  // Draw the data marks at the line ends
  svg2
    .selectAll("labels")
    .data(labelArr)
    .join("text")
    .attr("fill", function (d) {
      return color2(d.Characteristic);
    })
    .attr("transform", function (d) {
      return "translate(" + width + "," + yScale(d.Percent) + ")";
    })
    .attr("x", 5)
    .attr("y", 0)
    .attr("dy", ".35em")
    .attr("font-size", "1.2em")
    .attr("font-weight", 700)
    .text((d) => numberFormat(Math.round(d.Percent)) + "%");
})();
