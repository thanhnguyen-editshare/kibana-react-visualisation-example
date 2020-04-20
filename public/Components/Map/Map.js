import React, { Component } from 'react';
import d3 from 'd3';
import topology from './topology';
import './topojson';

d3.getEvent = () => require("d3-selection").event;

export default class Map extends Component {
  componentDidMount () {
    this.renderGraph();
  }

  renderGraph () {
    this.svg = d3.select(this.svgEl);
    this.createProjection();
    this.createPath();
    this.renderCountries();
  }

  createProjection () {
    this.projection = d3.geo.mercator()
      .scale(130)
      .translate( [this.svgEl.clientWidth / 2, this.svgEl.clientHeight / 1.5]);
    console.log('projection', this.projection);
  }

  createPath () {
    this.path = d3.geo.path()
      .projection(this.projection);
    console.log('createpath', this.path);
  }

  renderCountries () {
    var g = this.svg.append("g");

    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
      .enter()
        .append("path")
        .attr("d", this.path)
        .style("fill","black")

    /* d3.timer(function() {
      var angle = velocity * (Date.now() - then);
      projection.rotate([angle,0,0]);
      svg.selectAll("path")
        .attr("d", path.projection(projection));
    }); */

    var zoom = d3.behavior.zoom()
      .on("zoom", () => {
        g.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")")
      });

    this.svg.call(zoom)
  }

  render () {
    const { data } = this.props;
    return (
      <svg ref={ref => this.svgEl = ref} width='100%' height='100%' />
    );
  }
}
