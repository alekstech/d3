import * as d3 from 'd3' 

// market capitalizations of largest car manufacturers, Jan 2020
const data = [
  {
    name: 'Tesla',
    symbol: 'TSLA',
    value: 783.11
  },
  {
    name: 'Toyota',
    symbol: 'TM',
    value: 208.21
  },
  {
    name: 'Volkswagen',
    symbol: 'VOW3.DE',
    value: 99.13
  },
  {
    name: 'BYD',
    symbol: '002594.SZ',
    value: 89.52
  },
  {
    name: 'NIO',
    symbol: 'NIO',
    value: 87.71
  },
  {
    name: 'Daimler',
    symbol: 'DAI.DE',
    value: 73.76
  },
  {
    name: 'General Motors',
    symbol: 'GM',
    value: 71.52
  },
  {
    name: 'BMW',
    symbol: 'BMW.DE',
    value: 54.90
  },
  {
    name: 'Ferrari',
    symbol: 'RACE',
    value: 53.06
  },
  {
    name: 'Volvo',
    symbol: 'VOLVF',
    value: 51.43
  },
]

const drawChart = function () {
  const paddingOuter = 10 // number of pixels for padding CSS property of the container (svg element)
  const paddingInner = 0.25 // space in between bars, as % of bar width
  const containerWidth = window.innerWidth - (2 * paddingOuter)
  const containerHeight = window.innerHeight - (2 * paddingOuter)
  const svgWidth = containerWidth
  const maximum = d3.max(data, datum => datum.value) // find highest value
  const xAxisWidth = 70 // width of the x axis (incl. label)
  const yAxisHeight = 60 // height of the x axis (incl. label)

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
      .range([xAxisWidth, svgWidth]) // [left edge, right edge]; leave room for y axis
      .round(false) // round start and stop of each band to integers
      .paddingInner(paddingInner) // proportion of the range that is reserved for blank space between bands
      .align(0.5) // center bands versus range

  const step = xScale.step() // width of a bar
  const barWidth = step - (paddingInner * step)
  
  const yScale = d3.scaleLinear()
    .domain([0, maximum])
    .range([containerHeight - yAxisHeight, 0]) // [bottom edge, top edge]; flip top and bottom
    .nice() // show one tick above the highest value

  const selection = d3.select('svg')

  const transition = selection.transition().duration(1000)

  selection
    .attr('width', () => svgWidth)
    .attr('height', () => containerHeight)
    .attr('style', () => `display: block; padding: ${paddingOuter}px;`)
  

  // save <rect> elements (the bars) in a variable
  const bars = selection
    .selectAll('rect')
    .data(data, datum => `key-${datum.symbol}`)

  bars.join(
      // newly added nodes
      enterSelection => {
        // return so it can be joined with update selection
        return enterSelection
          .append('rect')
          // attributes to transition FROM
          .attr('x', (datum, index) => xScale(index))
          .attr('height', 0)
          .attr('y', yScale(0)) // start at 0 of the y scale
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5 5')
          .attr('stroke', 'darkblue')
          .attr('fill', 'pink')
          .attr('class', 'bar')
      },
      updateSelection => updateSelection,
      // newly removed nodes
      exitSelection => {
        exitSelection.transition(transition)
          .attr('height', 0)
          .attr('y', datum => yScale(datum.value))
      }
    )
    .attr('width', barWidth)
    // transition attributes set after this
    .transition(transition)
    // calculate x-position based index
    .attr('x', (datum, index) => xScale(index))
    .attr('y', datum => yScale(datum.value))
    // set height based on the bound datum
    .attr('height', datum => yScale(0) - yScale(datum.value))

  // add text labels to every bar
  bars.join(
    enterSelection => {
      enterSelection
        .append("text")
        .text(datum => datum.value)
        .attr('x', (datum, index) => xScale(index) + barWidth / 2) // x offset of the bar plus half of its width
        .attr('y', datum => yScale(datum.value) + 15) // 15 px of white space between axis and bars
        .attr("font-family" , "sans-serif")
        .attr("font-size" , "14px")
        .attr("fill" , "black")
        .attr("text-anchor", "middle")
    }
  )

  // y axis
  selection
    .selectAll('g.y-axis')
    .data([0]) // dummy data (?)
    .join(
      enterSelection => {
        return enterSelection
          .append("g")
          .attr("transform", "translate(50, 0)")
          .attr('class', 'y-axis')
          .call(d3.axisLeft(yScale))
      },
      updateSelection => {
        updateSelection
          .call(d3.axisLeft(yScale))
      }
    )

  // x axis
  selection
    .selectAll('g.x-axis') // select existing, if any
    .data([0]) // add dummy data
    .join( // define the enter and update behaviour
      enterSelection => {
        return enterSelection
          .append("g")
          .attr("transform", `translate(0, ${containerHeight - yAxisHeight + 15})`)
          .attr('class', 'x-axis')
          .call(d3.axisBottom(xScale).tickFormat(index => data[index].name))
      },
      updateSelection => {
        updateSelection
          .attr("transform", `translate(0, ${containerHeight - yAxisHeight + 15})`)
          .call(d3.axisBottom(xScale).tickFormat(index => data[index].name))
      }
    )

  // text label for the x axis
  selection
    .selectAll('text.y-label') // select existing, if any
    .data([0]) // add dummy data
    .join( // define create and update behaviour
      enterSelection => {
        enterSelection
          .append("text")
          .attr("transform", `translate(${containerWidth / 2}, ${containerHeight})`)
          .attr('class', 'y-label')
          .style("text-anchor", "middle") // svg equivalent of text-align
          .text("Manufacturer")
      },
      updateSelection => {
        updateSelection
          .attr("transform", `translate(${containerWidth / 2}, ${containerHeight})`)
      }
    )

  // text label for the y axis
  selection
    .selectAll('text.x-label')
    .data([0])
    .join(
      enterSelection => {
        enterSelection
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0)
          .attr("x", 0 - (containerHeight / 2))
          .attr("dy", "1em")
          .attr('class', 'x-label')
          .style("text-anchor", "middle") // svg equivalent of text-align
          .text("Value, $B")
      },
      updateSelection => {
        return updateSelection
          .attr("x", 0 - (containerHeight / 2))
      }
    )
}

window.addEventListener("resize", drawChart)

drawChart()

// How would you make this chart accessible?