import { Schemas } from 'ui/vis/editors/default/schemas';
import { setup as visualizations } from '../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';
import ReactComponent from './ReactComponent';
import EditorComponent from './EditorComponent';
import './style.css';


visualizations.types.createReactVisualization(
  {
    name: 'kibana-react-visualisation-example',
    title: 'React Visualisation Example',
    icon: 'visControls',
    description: 'Test Visualisation.',
    visConfig: {
      component: ReactComponent
    },
    requestHandler: 'none',
    editorConfig: {
      // optionsTemplate: EditorComponent
    }
  }
);
