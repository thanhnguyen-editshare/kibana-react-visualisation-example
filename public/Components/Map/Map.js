import React, { Component } from 'react';
import _ from 'lodash';
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

  componentDidUpdate () {
    this.renderGraph();
  }

  clearGraph () {
    this.svgEl.innerHTML = '';
  }

  renderGraph () {
    this.svg = d3.select(this.svgEl);
    this.container = d3.select(this.containerEl);
    this.mapContainer = d3.select(this.mapContainerEl);
    this.markerContainer = d3.select(this.markerContainerEl);
    this.createProjection();
    this.createPath();
    this.renderCountries();
    this.renderMarkers();
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
    this.mapContainer.selectAll("path.map-path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
      .enter()
        .append("path")
        .classed('map-path', true)
        .attr("d", this.path)
        .style("fill","black")

    var zoom = d3.behavior.zoom()
      .on("zoom", () => {
        this.container.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")")
        // this.setMarkerPos();
      });

    this.svg.call(zoom)
  }

  renderMarkers () {
    const { data = [] } = this.props;
    console.log('addMarkers', data);

    const markerContainers = this.markerContainer.selectAll('g.marker-container')
      .data(data)
      .enter()
      .append('g')
      .classed('marker-container', true)
      .attr("transform", (d) => {
        const coordinates = _.cloneDeep(d.coordinates).reverse();
        const x = this.projection(coordinates)[0],
          y = this.projection(coordinates)[1];
        return "translate(" + x + "," + y + ") scale(1)"
      });

    let pieKeys = [];
    _.each(data, d => {
      _.each(d.data, o => {
        pieKeys.push(o.type);
      });
    });
    pieKeys = _.uniq(pieKeys);
    console.log('pieKeys', pieKeys);

    const pie = d3.layout.pie()
      .value(function(d) {return d.value.value; });
    const width = 40, height = 40;
    var radius = Math.min(width, height) / 2

    const color = d3.scale.ordinal()
        .domain(pieKeys)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

    markerContainers.selectAll('path.pie-path')
      .data(d => {
        var data_ready = pie(d3.entries(d.data))
        return data_ready
      })
      .enter()
      .append('path')
      .attr('d', d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', function(d){
        return(color(d.data.value.type));
      })
      .attr("stroke", "lightgray")
      .style("stroke-width", "0.25px")
      .style("opacity", 0.9)

  }


  render () {
    const { data } = this.props;
    return (
      <svg ref={ref => this.svgEl = ref} width='100%' height='100%'>
        <g ref={ref => this.containerEl = ref}>
          <g ref={ref => this.mapContainerEl = ref}></g>
          <g ref={ref => this.markerContainerEl = ref}></g>
        </g>
      </svg>
    );
  }
}
