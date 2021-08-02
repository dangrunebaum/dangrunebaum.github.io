async function drawLineChart() {
  // 1. Access data
  let dataset = [];
  dataset.push(await generateNewDataPoint()); // Merge new data point
  // 2. Create chart dimensions

  const yAccessor = (d) => d.close;
  // const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = (d) => new Date(d.time * 1000);
  // dataset = dataset.sort((a,b) => xAccessor(a) - xAccessor(b)).slice(0, 100)
  // dataset = dataset.slice(0, 100);

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw canvas

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // init static elements
  bounds.append("path").attr("class", "line");
  bounds
    .append("g")
    .attr("class", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  bounds.append("g").attr("class", "y-axis");

  const drawLine = (dataset) => {
    // Wait for at least 2 datapoints
    if (dataset.length < 2) return;
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0]);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth]);

    // 5. Draw data

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    // Draw line

    bounds.select(".line").attr("d", lineGenerator(dataset));

    // 6. Draw peripherals

    const yAxisGenerator = d3.axisLeft().scale(yScale);

    // const yAxis =

    bounds.select(".y-axis").call(yAxisGenerator);

    const xAxisGenerator = d3.axisBottom().scale(xScale);

    // const xAxis =

    bounds.select(".x-axis").call(xAxisGenerator);
  };
  drawLine(dataset);

  // update the line every 1 second
  setInterval(addNewSecond, 10000);
  async function addNewSecond() {
    dataset.push(await generateNewDataPoint()); // Merge new data point
    if (dataset.length > 100) {
      // If dataset is larger than 100 throw away first/oldest value
      dataset.shift();
    }
    drawLine(dataset);
  }

  async function generateNewDataPoint() {
    let p = await getBitcoinPrice(); // Once async function returns value, calculate one new point
    return {
      time: new Date().getTime() / 1000, // Add ten seconds
      close: p, // yAccessor is bitcoin price
    };
  }

  async function getBitcoinPrice() {
    const result = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    console.log(result.data.bitcoin.usd);
    return result.data.bitcoin.usd;
  }
}
drawLineChart();
