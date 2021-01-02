import * as d3 from 'd3'
import data from './les-miserables.json'

// To visualise how elements interact
// in a network or a hierarchy

// alpha is the 'temperature' of the system

const width = 600
const height = 600

const scale = d3.scaleOrdinal(d3.schemeCategory10);

const drag = simulation => {
  
  function dragstarted(event) {
    if (!event.active) {
      simulation
        .alphaTarget(0.8)
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
      .on("end", dragended);
}

const links = data.links.map(d => Object.create(d));
const nodes = data.nodes.map(d => Object.create(d));

const simulation = d3
  .forceSimulation(nodes) // initialize physics
  .force("link", d3.forceLink(links) // show links between nodes
  .id(d => d.id)) // give each node an id
  .force("charge", d3.forceManyBody()) // add repulsion between nodes
  .force("center", d3.forceCenter(width / 2, height / 2)) // attract nodes to the center of the svg

const svg = d3.select("svg")
    .attr('width', width)
    .attr('height', height)

const link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", d => Math.sqrt(d.value));

const node = svg
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 5)
  .attr("fill", d => scale(d.group))
  .call(drag(simulation))

node.append("title")
    .text(d => d.id);

simulation.on("tick", () => {
  // update node positions
  node
    .attr("cx", d => d.x) // x coordinate of the center of a circle
    .attr("cy", d => d.y) // y coordinate of the center of a circle

  // update link positions
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
})

// force parameters
// - centering - attracts every node to a specific position
// - collision- consider nodes as circles with radius and try to avoid overlapping
// - links - pushes linked nodes together, according to a link distance
// - many-body - apply general attraction (if positive) or repulsion (if negative) between nodes
// - positioning - push each node towards a desired position

// check out playground at
// https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03