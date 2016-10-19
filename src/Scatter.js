import React, {Component} from 'react';
import {
  select,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
  extent,
  range
} from 'd3'

const DIM = 400;

function image(canvas, data) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 280, 280);
  if (!data) {
    return;
  }
  for (var k=0; k<data.length; k++) {
    const j = Math.floor(k / 28);
    const i = k % 28;
    const pixel = data[k];
    if (pixel > 0) {
      ctx.fillStyle = `rgba(0,0,0,${pixel})`;
      ctx.fillRect(i*10, j*10, 10, 10);
    }
  }
}

function scatter() {
  const xScale = scaleLinear().range([5, DIM-5]);
  const yScale = scaleLinear().range([DIM-5, 5]);
  const color = scaleOrdinal(schemeCategory10)

  const domain = (data) => {
    const xd = extent(data, d => d[0]);
    const yd = extent(data, d => d[1]);
    xScale.domain(xd).nice();
    yScale.domain(yd).nice();
  }

  let svg = null; 

  const mount = (data, label, domNode, canvasNode, imageData) => {
    domNode.innerHTML = '';
    domNode.style.position = 'absolute';
    canvasNode.style.position = 'absolute';
    domNode.style.left=0;
    canvasNode.style.left = DIM+40+'px';
    canvasNode.style.top  = '100px';
    svg = select(domNode)

    domain(data);
    color.domain(range(10));

    svg.append("g")
      .classed("canvas", true)
      .selectAll("circle")
      .data(data)
        .enter()
        .append("circle")
        .attr("fill", (d,i) => color(label[i]))
        .attr("r", "5")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .on("mouseover", (d, i) => {
          const img = imageData[i];
          image(canvasNode, img);
        });

    svg.on("mouseleave", ()=> {
      image(canvasNode, null);
    });

    svg.append("g")
      .attr("transform", "translate(0, 440)")
      .selectAll("circle")
      .data(color.domain())
        .enter()
        .append("circle")
        .attr("fill", (d,i) => color(d))
        .attr("r", "5")
        .attr("cy", "0")
        .attr("cx", (d,i) => 10 + i * 20);

    svg.append("g")
      .attr("transform", "translate(0, 440)")
      .selectAll("text")
      .data(color.domain())
        .enter()
        .append("text")
        .text(d => d)
        .attr("y", "4")
        .attr("font-size", 10)
        .attr("x", (d,i) => 16 + i * 20);
  }
  const update = (data) => {
    domain(data);
    svg.select("g.canvas").selectAll("circle")
      .data(data)
      .transition()
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]));
  }

  return {mount, update};
}

export default class ScatterPlot extends Component {
  
  componentDidMount() {
    const {data} = this.props;
    if (!data) {
      this._mounted = false;
      return;
    }
    const {X, Y} = data;
    const {mount, update} = scatter();
    mount(X, Y, this.refs.svg, this.refs.canvas, this.props.images);
    this._update = update;
    this._mounted = true;
  }
  shouldComponentUpdate(nextProps) {
    return !!nextProps.shouldUpdate;
    // return this.props.data !== nextProps.data;
  }
  componentDidUpdate() {
    if (!this._mounted && this.props.data) {
      this.componentDidMount();
    } else if (this.props.data) {
      const {X, Y} = this.props.data;
      this._update(X);
    }
  }

  render() {
    return (
      <div style={{ position:'relative', width:DIM+320, margin:'auto'}}>
        <svg width={DIM} height={DIM + 240} ref="svg" />
        <canvas width="280" height="280" ref="canvas" />
      </div>
    );
  }
}
