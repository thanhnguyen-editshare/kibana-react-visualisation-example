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

export default class Editor extends Component {
  componentDidMount () {
    // const { setValue } = this.props;
    // setValue({});
  }

  handleIndexChange = (e) => {
    const { setValue, vis } = this.props;
    const selectedIndexPatternId = e.currentTarget.value;
    const { savedObjectsCache } = indexPatternService;
    const selectedIndexPattern = savedObjectsCache.find(obj => obj.id == selectedIndexPatternId)
    console.log(selectedIndexPattern);
    // setValue({ indexPatternId: selectedIndexPatternId });
  }

  render () {
    const { savedObjectsCache } = indexPatternService;
    console.log('Editor props', this.props);
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h5>Select Index</h5>
              </EuiTitle>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <select onChange={this.handleIndexChange}>
                {savedObjectsCache.map(obj => {
                  return <option value={obj.id}>{obj.attributes.title}</option>;
                })}
              </select>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
};
