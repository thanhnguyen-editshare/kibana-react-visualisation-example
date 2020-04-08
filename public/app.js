import { Schemas } from 'ui/vis/editors/default/schemas';
import { setup as visualizations } from '../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';
import ReactComponent from './ReactComponent';

visualizations.types.createReactVisualization(
  {
    name: 'kibana-react-visualisation-example',
    title: 'React Visualisation Example',
    icon: 'visControls',
    description: 'Test Visualisation.',
    visConfig: {
      component: ReactComponent,
      defaults: {
        counter: 0,
      },
    },
    editor: 'default',
    editorConfig: {
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Metric',
          min: 1,
          aggFilter: ['!derivative', '!geo_centroid'],
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        }, {
          group: 'buckets',
          name: 'segment',
          title: 'Bucket Split',
          min: 0,
          max: 1,
          aggFilter: ['!geohash_grid', '!filter']
        }
      ]),
    }
  }
);
