<script>
  // import data from "./data/flag-data.js";
  // console.log(data);

  let width = 2000;
  let height = 1200;

  // let margin = { top: 20, right: 40, left: 0, bottom: 20 };

  // import { scaleLinear } from "d3-scale";
  // $: xScale = scaleLinear()
  //   .domain([0, 100])
  //   .range([0, width - margin.left - margin.right]);

  // import { max, sort } from "d3-array";

  // const yScale = scaleLinear()
  //   .domain([0, max(data, (d) => d.hours)])
  //   .range([height - margin.top - margin.bottom, 0]);

  import Chord from "./components/Chord.svelte";
  // import Stream from './components/Stream.svelte'
  // import AxisX from "./components/AxisX.svelte";
  // import AxisY from "./components/AxisY.svelte";
  import Tooltip from "./components/Tooltip.svelte";
  let hoveredData;
  // $: console.log(hoveredData);
</script>
<!-- <h1>Study longer, score better</h1> -->
<div
  class="chart-container"
  bind:clientWidth={width}
>

  <svg {width} {height}>
    <!-- <Stream {width} {height}></Stream> -->
    <Chord {width} {height}></Chord>
    <!-- <AxisX {height} {xScale} {margin} />
    <AxisY {height} {width} {yScale} {margin} /> -->
    <!-- <g class="circles" transform="translate({margin.left} {margin.top})">
      {#each data.sort((a, b) => a.grade - b.grade) as student}
        <circle
          cx={xScale(student.grade)}
          cy={yScale(student.hours)}
          r={hoveredData && hoveredData == student ? "12" : "8"}
          opacity={hoveredData ? (hoveredData == student ? "1" : "0.3") : "1"}
          fill="purple"
          stroke="black"
          on:mouseover={() => {
            hoveredData = student;
          }}
            on:mouseleave={() => {
              hoveredData = null;
            }}
          on:focus={() => {
            hoveredData = student;
          }}
          tabindex="0"
        />
      {/each}
    </g> -->
  </svg>
  {#if hoveredData}
    <Tooltip data={hoveredData} {xScale} {yScale} />
  {/if}
</div>

<style>

  circle {
    transition: r 300ms ease, opacity 300ms ease;
    cursor: pointer;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
</style>
