<script>
  import { chordDirected, ribbon } from "d3-chord";
  import { union, descending } from "d3-array";
  import { arc } from "d3-shape";
  import { format } from "d3-format";
  import data from "../data/flag-data.js";
  /*  
  sample data 
  {
    "source": "Atypical directorships",
    "target": "Mass registration",
    "value": 475234
  }
  */
  // console.log(data.sort((a, b) => b.value - a.value))

  const formatComma = format(",");

  let names;
  let chords;
  let ribbons;
  let arcs;
  let chordTransform;
  let width = 800;
  let height = width;
  let transformRadius;
  const marginOffset = 150; // margin offsets relative to the radius
  const bandThickness = 20; // thickness of the color band representing each dataset
  const outerRadius = Math.min(width, height) * 0.5 - marginOffset; //  connect to margin
  const innerRadius = outerRadius - bandThickness;
  const colors = [
    "#A81748",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#ffff33",
    "#a65628",
  ];

  // Outer segments of circle
  const chordGenerator = chordDirected()
    .padAngle(20 / innerRadius)
    .sortSubgroups(descending)
    .sortChords(descending);

  // From "long data" format compute a dense matrix from the weighted links in data. Pass into chord generator.
  const getChordData = () => {
    names = Array.from(union(data.flatMap((d) => [d.source, d.target]))); // flags
    const index = new Map(names.map((name, i) => [name, i])); // assign index numbers to flags
    const matrix = Array.from(index, () => new Array(names.length).fill(0)); // create matrix 7 wide and 7 long
    console.log(matrix)
    for (const { source, target, value } of data)
      matrix[index.get(source)][index.get(target)] += value;
    chords = chordGenerator(matrix);
    console.log(chords);
  };

  // Ribbons to link circle segments
  const ribbonGenerator = ribbon()
    .radius(innerRadius)
    .padAngle(1 / innerRadius);

  const generateRibbons = () => {
    ribbons = chords.map((ribbon, i) => {
      ribbon.path = ribbonGenerator(ribbon);
      return ribbon;
    });
  };

  // Arcs for each circle segment
  const arcGenerator = arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const generateArcs = () => {
    arcs = chords.groups.map((arc, i) => {
      arc.path = arcGenerator(arc);
      return arc;
    });
  };

  // Center viz in chart
  const getChordTransform = () => (chordTransform = [width / 2, height / 2]);

  // Position labels outside viz, rotate text past 180 degrees
  const textTransform = (arc) => {
    const theta = (((arc.startAngle + arc.endAngle) / 2) * 180) / Math.PI;
    transformRadius = outerRadius * 1.03;
    const textTransform = `rotate(${
      theta - 90
    }deg) translate(${transformRadius}px,0px) rotate(${
      theta < 180 ? 0 : 180
    }deg)`;
    const textAnchor = theta < 180 ? "start" : "end";
    return [textTransform, textAnchor];
  };
  // Reactive center text variable
  let text = "475234 shared flags";
  $: text;
  $: getChordTransform(), getChordData(), generateRibbons(), generateArcs();
</script>

<!-- center -->
<g transform={`translate(${chordTransform})`}>
  <!-- ribbons -->

  <!-- gradient for first ribbon only -->
  {#each ribbons.slice(0, 1) as ribbon, i}
    <defs>
      <linearGradient id="gradient-{i}" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color={colors[ribbon.source.index]} />
        <stop offset="100%" stop-color={colors[ribbon.target.index]} />
      </linearGradient>
    </defs>
  {/each}
  <!-- remaining gradients -->
  {#each ribbons as ribbon, i}
    {#if ribbon.source.index > ribbon.target.index}
      <defs>
        <linearGradient id="gradient-{i}" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color={colors[ribbon.source.index]} />
          <stop offset="100%" stop-color={colors[ribbon.target.index]} />
        </linearGradient>
      </defs>
    {:else if ribbon.source.index < ribbon.target.index && ribbon.source.index !== "0" && ribbon.target.index !== "1"}
      <defs>
        <linearGradient id="gradient-{i}" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color={colors[ribbon.target.index]} />
          <stop offset="100%" stop-color={colors[ribbon.source.index]} />
        </linearGradient>
      </defs>
    {/if}
    <!-- draw paths -->
    <path
      on:mouseover={() => (text = ribbon.source.value + " shared flags")}
      d={ribbon.path}
      fill="url('#gradient-{i}')"
      fill-opacity={0.9}
    >
    </path>
    <!-- center text -->
    <text class="centerText" fill="white">
      {formatComma(parseInt(text)) + " flag pairs"}
    </text>
  {/each}
  <!-- outer arcs -->
  {#each arcs as arc, i}
    <!-- {console.log(arc)} -->
    {@const textTransformArray = textTransform(arc)}
    <path d={arc.path} fill={colors[i]}></path>
    <!-- labels -->
    <text
      style={`transform:${textTransformArray[0]}`}
      text-anchor={textTransformArray[1]}>{names[arc.index]}</text
    >
  {/each}
</g>

<style>
  .centerText {
    font-size: 1rem;
    transform: translateX(-50px);
  }
</style>
