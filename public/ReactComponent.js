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

export default class ReactComponent extends Component {
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
      console.log('my res 1', res);
    });
  }

  render () {
    const { visData } = this.props;
    console.log('Component props > ', this.props);
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h2>Create React Visualisation Example</h2>
              </EuiTitle>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              sdaf
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
};
