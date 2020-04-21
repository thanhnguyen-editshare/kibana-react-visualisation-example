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
    this.setPrevProps();
  }

  componentDidUpdate () {
    const { visParams } = this.props;
    const { _indexId, _coordinateField, _valueField } = visParams;
    if (this._indexId != _indexId ||
      this._coordinateField != _coordinateField ||
      this._valueField != _valueField
    ) {
      this.fetchData();
    }
    this.setPrevProps();
  }

  setPrevProps () {
    const { visParams } = this.props;
    const { _indexId, _coordinateField, _valueField } = visParams;
    this._indexId = _indexId;
    this._coordinateField = _coordinateField;
    this._valueField = _valueField;
  }

  fetchData = async () => {
    const { visParams } = this.props;
    const { _indexId, _coordinateField, _valueField } = visParams;

    if (!_indexId || !_coordinateField || !_valueField) {
      this.setState({ chartData: [] });
    } else {
      const indexPattern = await indexPatternService.get(_indexId);
      const searchSource = new SearchSource();
      searchSource.setField('index', indexPattern);
      searchSource.setField('size', 10000);
      searchSource.setField('docvalue_fields', [_coordinateField, _valueField]);
      searchSource.setField('source', false);
      searchSource.setField('query', {"query":"","language":"kuery","queryLastTriggeredAt":"2020-04-20T05:16:05.046Z"});
      searchSource.fetch().then(res => {
        const chartData = DataUtils.convertToChartData(res, _coordinateField, _valueField);
        this.setState({ chartData });
      });
    }

  }

  render () {
    const { chartData } = this.state;
    const { visParams } = this.props;
    const { _pieSize } = visParams;
    console.log('Component props > ', this.props);
    return (
      <Map data={chartData} pieSize={_pieSize} />
    );
  }
};
