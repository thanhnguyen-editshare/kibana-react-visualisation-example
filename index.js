export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/kibana-react-visualisation-example/app'
      ]
    }
  });
}