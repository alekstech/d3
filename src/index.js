import * as d3 from 'd3' 

const data = [ 45, 67, 96, 84, 41, ]

const drawChart = function () {
  const paddingOuter = 10 // number of pixels for padding CSS property of the container (svg element)
  const paddingInner = 0.1 // space in between bars, as % of bar width
  const containerWidth = window.innerWidth - (2 * paddingOuter)
  const containerHeight = window.innerHeight - (2 * paddingOuter)
  const svgWidth = containerWidth
  const maximum = d3.max(data, d => d) // find highest value

  // a scale is
  // - a visual encoding of position of quantitative data, such as
  //    - a position of dots on a scatterplot
  //    - bubble size
  //    - opacity of a colour
  //    - stroke width
  // - a function linking domain (dataset) and range (output)

  // types of scales
  // - linear - for time series, x = f(y) relationships
  // - sqroot - for circles
  // - power - for curves
  // - log - for datasets with outliers
  // - symlog - for history and prognoses
  // - categorical (ordinal) - for categories

  // domain = (outer bounds of) dataset, input data
  // range = (outer bounds of) output data, raw data translated to visual representation

  const xScale = d3.scaleBand() // split available width into equal bands
    .domain(Object.keys(data)) // dataset
      .range([0, svgWidth]) // [left edge, right edge]
      .round(false) // round start and stop of each band to integers
      .paddingInner(paddingInner) // proportion of the range that is reserved for blank space between bands
      .align(0.5) // center bands versus range

  const step = xScale.step()
  const barWidth = step - (paddingInner * step)
  
  const yScale = d3.scaleLinear()
    .domain([0, maximum])
    .range([0, containerHeight]) // [bottom edge, top edge], svg coordinates system is flipped

  const selection = d3.select('svg')

  const transition = selection.transition().duration(1000)

  selection
    .attr('width', () => svgWidth)
    .attr('height', () => containerHeight)
    .attr('style', () => `display: block; padding: ${paddingOuter}px;`)
    .selectAll('rect')
    .data(data, datum => `key-${datum}`) // key must be unique?, decides if node needs re-rendering on data change
    .join(
      // newly added nodes
      enterSelection => {
        // return so it can be joined with update selection
        return enterSelection.append('rect')
          // attributes to transition FROM
          .attr('x', (datum, index) => xScale(index))
          .attr('height', 0)
          .attr('y', 0)
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5 5')
          .attr('stroke', 'darkblue')
          .attr('fill', 'pink')
      },
      update => update,
      // newly removed nodes
      exitSelection => {
        exitSelection.transition(transition)
          .attr('height', 0)
          .attr('y', containerHeight)
      }
    )
    .attr('width', barWidth)
    // newly added nodes and newly updated nodes
    .transition(transition)
    // calculate x-position based index
    .attr('x', (datum, index) => xScale(index))
    // set height based on the bound datum
    .attr('height', datum => yScale(datum))
}

window.addEventListener("resize", drawChart)

drawChart()

// SVG coordinate system uses positive x, negative y quadrant (fourth quadrant)
// How would you transform this the chart so the bars 'point upwards'?