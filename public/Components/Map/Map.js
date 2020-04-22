import React, { Component } from 'react';
import _ from 'lodash';
import d3 from 'd3';
import d3tip from 'd3-tip';
import topology from './topology';
import './topojson';

d3.getEvent = () => require("d3-selection").event;

export default class Map extends Component {
  componentDidMount () {
    this.renderGraph();
  }

  componentDidUpdate () {
    this.renderGraph();
  }

  renderGraph () {
    this.svg = d3.select(this.svgEl);
    this.container = d3.select(this.containerEl);
    this.mapContainer = d3.select(this.mapContainerEl);
    this.markerContainer = d3.select(this.markerContainerEl);
    this.createProjection();
    this.createPath();
    this.renderCountries();
    this.initMarkerColor();
    this.renderMarkers();
    this.renderLegends();
  }

  createProjection () {
    this.projection = d3.geo.mercator()
      .scale(130)
      .translate( [this.svgEl.clientWidth / 2, this.svgEl.clientHeight / 1.5]);
  }

  createPath () {
    this.path = d3.geo.path()
      .projection(this.projection);
  }

  renderCountries () {
    const mapPathSelection = this.mapContainer.selectAll("path.map-path")
      .data(topojson.object(topology, topology.objects.countries).geometries)

    mapPathSelection.enter()
        .append("path")
        .classed('map-path', true)

    mapPathSelection.exit().remove();

    this.mapContainer.selectAll("path.map-path")
      .attr("d", this.path)
      .style("fill","black")

    var zoom = d3.behavior.zoom()
      .on("zoom", () => {
        this.container.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")")
      });

    this.svg.call(zoom)
  }

  renderMarkers () {
    const { data = [], pieSize } = this.props;

    const tip = d3tip().attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        const rows = _.map(d.data, item => {
          return `<tr><td><span class="legend-rect" style="background: ${this.color(item.type)};"></span>${item.type}</td><td>${item.value}</td></tr>`
        })
        return `<table>${rows.join('')}</table>`;
      });

    this.svg.call(tip);

    const markerContainersSelection = this.markerContainer.selectAll('g.marker-container')
      .data(data)

    markerContainersSelection.enter()
      .append('g')
      .classed('marker-container', true)

    markerContainersSelection.exit().remove();

    this.markerContainer.selectAll('g.marker-container')
      .attr("transform", (d) => {
        const coordinates = _.cloneDeep(d.coordinates).reverse();
        const x = this.projection(coordinates)[0],
          y = this.projection(coordinates)[1];
        return "translate(" + x + "," + y + ") scale(1)"
      })
      .on('mouseover', tip.show)
      .on("mousemove", tip.show)
      .on('mouseout', tip.hide);

    const pie = d3.layout.pie()
      .value(function(d) {return d.value.value; });

    const width = parseInt(pieSize), height = parseInt(pieSize);
    const radius = Math.min(width, height) / 2

    const piePathSelection = this.markerContainer.selectAll('g.marker-container').selectAll('path.pie-path')
      .data(d => {
        var data_ready = pie(d3.entries(d.data))
        return data_ready
      })

    piePathSelection.enter()
      .append('path')
      .classed('pie-path', true);

    piePathSelection.exit().remove();

    this.markerContainer.selectAll('g.marker-container').selectAll('path.pie-path')
      .attr('d', d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', (d) => {
        return this.color(d.data.value.type);
      })
      .attr("stroke", "lightgray")
      .style("stroke-width", "0.25px")
      .style("opacity", 0.9)

  }

  initMarkerColor () {
    this.color = d3.scale.ordinal()
      .domain(this.getDataKeys())
      .range(["rgb(29, 92, 171)", "rgb(216, 61, 53)", "rgb(201, 173, 49)", "rgb(65, 147, 124)"])
  }

  getDataKeys () {
    const { data } = this.props;
    let pieKeys = [];
    _.each(data, d => {
      _.each(d.data, o => {
        pieKeys.push(o.type);
      });
    });
    return _.uniq(pieKeys);
  }

  renderLegends () {
    const selection = d3.select(this.legendContainerEl).selectAll('li.legend-item')
      .data(this.getDataKeys());

    const newLi = selection.enter()
      .append('li')
      .classed('legend-item', true);

    selection.exit().remove();

    newLi
      .append('span')
      .classed('legend-rect', true)

    newLi
      .append('span')
      .classed('legend-text', true)
      .text((d) => d);

    d3.select(this.legendContainerEl).selectAll('li.legend-item .legend-rect')
      .style({
        background: (d) => this.color(d)
      })
  }

  render () {
    const { data } = this.props;
    return (
      <React.Fragment>
        <svg ref={ref => this.svgEl = ref} width='100%' height='100%' className='map'>
          <g ref={ref => this.containerEl = ref}>
            <g ref={ref => this.mapContainerEl = ref}></g>
            <g ref={ref => this.markerContainerEl = ref}></g>
          </g>
        </svg>
        <ul ref={ref => this.legendContainerEl = ref} className='map-legend'></ul>
      </React.Fragment>
    );
  }
}

Map.defaultProps = {
  pieSize: 40
}
