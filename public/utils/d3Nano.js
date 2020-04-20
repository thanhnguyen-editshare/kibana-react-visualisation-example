let d3Nano = {};

import { select, selectAll, event } from 'd3-selection';
import { mercator } from 'd3-geo';

Object.assign( d3Nano, { select, selectAll, event, mercator } );

console.log( 'd3Nano:', d3Nano );

export default d3Nano;