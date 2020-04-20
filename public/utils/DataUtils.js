import _ from 'lodash';

const DataUtils = {};

DataUtils.convertToChartData = (esResponse) => {
  const hits = _.get(esResponse, 'hits.hits', []);
  const groupedByLatLong = _.groupBy(hits, (doc) => doc.fields['region.coordinate']);
  const chartData = {}
  _.each(groupedByLatLong, (resources, key) => {
    const groupedByEntityType = _.groupBy(resources, (doc) => doc.fields['entityType.keyword'][0])
    const locData = chartData[key] = [];
    _.each(groupedByEntityType, (res, resourceType) => {
      locData.push({
        type: resourceType,
        value: res.length
      })
    });
  });
  return chartData;
}

export default DataUtils;
