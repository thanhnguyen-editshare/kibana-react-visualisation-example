import React, { Component } from 'react';
import d3 from 'd3';
import topology from './topology';
import './topojson';

d3.getEvent = () => require("d3-selection").event;

const features = [{
  "type": "Feature",
  "id": "1",
  "geometry": {
    "type": "Point",
    "coordinates": [
      "55.30472",
      "25.25817"
    ],
    "properties": {
      "name": "United Arab Emirates",
      "countryCode": "AE",
      "value": "1.19"
    }
  }
}];

const j = 0;

export default class Map extends Component {
  componentDidMount () {
    this.renderGraph();
  }

  renderGraph () {
    this.svg = d3.select(this.svgEl);
    this.createProjection();
    this.createPath();
    this.renderCountries();
    this.addMarkers();
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
    const g = this.g = this.svg.append("g");

    g.selectAll("path.map-path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
      .enter()
        .append("path")
        .classed('map-path', true)
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
        // this.setMarkerPos();
      });

    this.svg.call(zoom)
  }

  addMarkers () {
    var vSize = d3.scale.linear()
      .domain([0,25])
      .range([0.5,8]);

    var vOp = d3.scale.linear()
      .domain([0,25])
      .range([0.25,0.75]);

    var randColour = ['#31558d', '#c52b2d'][Math.floor(Math.random() * 2)];

    var x = this.projection(features[j].geometry.coordinates)[0],
        y = this.projection(features[j].geometry.coordinates)[1];

    var marker = this.g.append("path")
      .attr("class", "marker")
      .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
      .attr("transform", "translate(" + x + "," + y + ") scale(0)")
      .transition()
      .delay(400)
      .duration(800)
      .ease("elastic")
      .attr("transform", "translate(" + x + "," + y + ") scale(.75)")
      //.on('mouseover', function(d){})
      ;
  }

  setMarkerPos = () => {
    var x = this.projection(features[j].geometry.coordinates)[0],
        y = this.projection(features[j].geometry.coordinates)[1];

    this.svg.selectAll('path.marker')
      .attr("transform", "translate(" + x + "," + y + ") scale(0)")
  }

  render () {
    const { data } = this.props;
    return (
      <svg ref={ref => this.svgEl = ref} width='100%' height='100%' />
    );
  }
}
