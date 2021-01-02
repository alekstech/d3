import * as d3 from 'd3'
import data from './les-miserables.json'

// To visualise how elements interact
// in a network or a hierarchy

const width = 600
const height = 600

// ordinal scale = colour coding; used for categories
// https://github.com/d3/d3-scale#api-reference
const scale = d3.scaleOrdinal(d3.schemeCategory10);

// allow user to move the svg around
const drag = simulation => {
  
  function dragstarted(event) {
    if (!event.active) {
      simulation
        .alphaTarget(0.8) // https://medium.com/@sxywu/understanding-the-force-ef1237017d5
        .restart()
    }
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
}

const links = data.links.map(d => Object.create(d)) // co-occurences
const nodes = data.nodes.map(d => Object.create(d)) // characters

// set up the graph
const simulation = d3
  .forceSimulation(nodes) // define the 'galaxy'
  .force("link", d3.forceLink(links) // show links between nodes
  .id(d => d.id)) // give each node an id
  .force("charge", d3.forceManyBody()) // add gravity to each node
  .force("center", d3.forceCenter(width / 2, height / 2)) // attract nodes to the center of the svg

const svg = d3.select("svg")
    .attr('width', width)
    .attr('height', height)

// visualise links between characters
const link = svg
  .append("g") // group, used to cascade CSS properties
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links) // every circle is bound to a character
  .join("line") // ~ render(); adds, updates and removes nodes
  .attr("stroke-width", d => Math.sqrt(d.value)) // try removing Math.sqrt

// display characters as coloured circles
const node = svg
  .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
    .attr("r", 5)
    .attr("fill", d => scale(d.group)) // the scale defines node colur based on what group the character belongs to
  .call(drag(simulation))

// Is this making the visualization accessible?
node.append("title")
    .text(d => d.id) // title is equivalent to the `alt` on an <img>

// The simulation re-renders with each tick
// until alphaTarget is reached and the layout stops
simulation.on("tick", () => {
  // place circles on the svg
  node
    .attr("cx", d => d.x) // x coordinate of the center of circle
    .attr("cy", d => d.y) // y coordinate of the center of circle

  // draw lines between circles
  link
    .attr("x1", d => d.source.x) // line start x
    .attr("y1", d => d.source.y) // line start y
    .attr("x2", d => d.target.x) // line end x
    .attr("y2", d => d.target.y) // line end y
})

// a force simulation like this has these parameters
// - centering - attracts every node to a specific position
// - collision - (try to) lay out circles without overlapping
// - links - link strength is how close the nodes are together
// - many-body - either a way to give each node gravity, or a joke param, not sure yet
// - positioning - push each node towards a desired position

// check out playground at
// https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03