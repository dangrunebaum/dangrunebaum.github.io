<script>
    import data from '$data/flags-time-series.js'
    import { timeParse } from 'd3-time'
console.log(data)

// set the dimensions and margins of the graph
const margin = {top: 130, right: 20, bottom: 50, left: 40};
const width = 550 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

</script>