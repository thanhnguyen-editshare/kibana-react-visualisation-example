import React, { Component } from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText
} from '@elastic/eui';

import { npStart } from 'ui/new_platform';
import { SearchSource } from '../../../src/legacy/ui/public/courier';
export const indexPatternService = npStart.plugins.data.indexPatterns;

import DataUtils from './utils/DataUtils';
import Map from './Components/Map';

export default class ReactComponent extends Component {
  state = {}

  componentDidMount () {
    this.fetchData();
  }

  fetchData = async () => {
    const { savedObjectsCache } = indexPatternService;
    const indexPatternId = savedObjectsCache.find(obj => obj.attributes.title === 'veritas-entity-stats').id;

    const indexPattern = await indexPatternService.get(indexPatternId);
    const searchSource = new SearchSource();
    searchSource.setField('index', indexPattern);
    searchSource.setField('size', 10000);
    searchSource.setField('docvalue_fields', ["region.coordinate", 'entityType.keyword']);
    searchSource.setField('source', false);
    searchSource.setField('query', {"query":"","language":"kuery","queryLastTriggeredAt":"2020-04-20T05:16:05.046Z"});
    searchSource.fetch().then(res => {
      const chartData = DataUtils.convertToChartData(res);
      this.setState({ chartData });
    });
  }

  render () {
    const { chartData } = this.state;
    // console.log('Component props > ', this.props);
    return (
      <Map data={chartData}/>
    );
  }
};
