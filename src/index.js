import * as d3 from 'd3'
import canada from './canada-geojson.json'

var width = 900,
    height = 600;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const projection =
  d3
    .geoMercator()
    .scale(200) // zoom
    .center([-96.28, 62.24])

var pathGenerator = d3.geoPath()
  .projection(projection)

svg.selectAll("path")
  .data(canada.features)
  .enter().append("path")
  .attr("class", "boroughs")
  .attr("d", pathGenerator);