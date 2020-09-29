/*
Make an array of top ten bestselling song singles. Instead of computing letter frequency,
use list of top ten keywords for each song. Left side of display shows song, right graph shows top ten keywords.
graph will list top ten keywords on y axis with bar chart showing keyword counts on x axis
*/

// declare margin and data variables
const margin = 100;
let data;

// load json file and execute callback fat arrow function on success
d3.json("./top-ten-singles.json").then(allData => {
  data = allData;
  // define song sections 
  const section = d3
    .select(".sections")//select first object (div) with class of .sections 
    .selectAll(".section")//create placeholders for divs with class of .section 
    .data(data)//provide definition for data 
    .join("div")//create divs, one for each data object  
    //set two classes, i.e. 'section section-0,1,2,3', allowing
    //operate on all section divs at once or individually, depending on class  
    .attr("class", (d, i) => "section section-" + i)
    .html(function (d) { return "<strong>" + d.title + "</strong>" + "<br><br>Artist: " + d.artist + "<br>Year: " + d.year + "<br>Sales: " + d.sales + "<br><br>" + d.lyrics });//print lyrics
// song titles redraw on scroll
  const songTitle = d3
    .select(".song-titles") 
    .selectAll(".song-title")
    .data(data)
    .join("p")
    .attr("class", (d, i) => "song-title song-title-" + i)
    .html(function (d) { return "<strong>" + d.title });//print title


  let sectionPositions = [];//create array of y positions 
  section.each(function () {
    // destructuring assignment, extracts top attribute 
    const { bottom } = this.getBoundingClientRect();//find top position of text section in relation to viewport
    sectionPositions.push(bottom); //push top positions into array 
  });
  console.log(sectionPositions)// different top positions 

  // function that gets called on scrolling 
  function position() {
    var pos = window.pageYOffset;//pos = y offset 
    console.log(pos)
    var sectionIndex = d3.bisect(sectionPositions, pos);//figure out closest section position to pos 
    sectionIndex = Math.min(section.size() - 1, sectionIndex);//prevent section index from being 1 greater than index
    // set state so that current index equals section index 
    if (state.currentIndex !== sectionIndex) {//if haven't changed sections don't do anything 
      setState({//if changed sections by scrolling, set state
        currentIndex: sectionIndex,
      });
    }
  }

  // position gets called on scroll 
  window.addEventListener("scroll", position);
  // first draw when sectionIndex is 0 
  draw();
});

// setup function creates bar chart elements, called at bottom  
function setup() {
  const viz = d3.select(".viz")
  const svg = viz
    .append("svg")
    .attr("height", 500)
    .attr("width", 500)
    .attr("fill", "brown")

  // append 'g' with class of bars 
  svg.append("g").attr("class", "bars");
  // add x and y axes 
  const xAxis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${margin})`);
  const yAxis = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin}, 0)`);

// explainer paragraph 
  var explainer = d3.select(".viz")
    .append("div")
    .attr("class", "explainer-2")
  explainer.html("Have pop lyrics changed? At left are the ten bestselling English-language singles of all time <a href='https://en.wikipedia.org/wiki/List_of_best-selling_singles'>(Wikipedia)</a>. Above, each song's ten most common keywords are shown by number of occurrences.")
}

// draw function is defined 
function draw() {
  const { currentIndex } = state;//destructuring assignment grabs currentIndex 
  const section = d3 //select one section and set class to current, depending on value of current index 
    .selectAll(".section")
    .classed("current", (d, i) => i === currentIndex);
  const songTitle = d3
    .selectAll(".song-title")
    .classed("current", (d, i) => i === currentIndex);

  let singleData = data.filter((d, i) => i === currentIndex)[0];
  const svg = d3.select("svg").data(singleData.keywords);//svg's data is assigned
  // x scale is 0-25
  const xScale = d3
    .scaleLinear()
    .domain([0, 40])
    .range([margin, 500 - margin]);
  // y scale is ordinal array of ten keywords 
  const yScale = d3
    .scaleBand()
    .paddingInner(0.1)
    //function creates ten bands, one for each keyword
    .domain(singleData.keywords.map(function (d) {
      return d[0];
    }))
    .range([margin, 500 - margin]);

  svg
    .select(".bars")
    .selectAll("rect.bar")
    .data(singleData.keywords)//svg's data is assigned
    .join("rect")
    .attr("class", "bar")
    .attr("x", xScale(0))
    .attr("y", function (d) {
      return yScale(d[0]);
    })
    .attr("height", yScale.bandwidth())
    .transition()
    .attr("width", d => {
      return xScale(d[1]) - margin
    })

  svg.select(".x-axis").call(d3.axisTop(xScale))
  // .style("font-size", "16px");
  svg.select(".y-axis").call(d3.axisLeft(yScale))
    .style("font-size", "16px");
}


// set initial state object, which contains currentIndex integer set to 0
let state = {
  currentIndex: 0,
};
//  set new state and call draw function 
function setState(nextState) {
  console.log(nextState);
  state = { ...state, ...nextState }; // override state with new index value (second arg overrides first)
  // call draw function when state updates 
  draw();
}
setup();
