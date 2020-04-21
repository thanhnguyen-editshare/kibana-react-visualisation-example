import React, { Component } from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
  EuiFormRow,
  EuiComboBox,
  EuiFieldText,
  EuiFieldNumber
} from '@elastic/eui';

import { npStart } from 'ui/new_platform';
import { SearchSource } from '../../../src/legacy/ui/public/courier';
export const indexPatternService = npStart.plugins.data.indexPatterns;

export default class Editor extends Component {
  state = {}

  componentDidMount () {
    const { stateParams } = this.props;
    if (stateParams._indexId) {
      this.fetchIndex(stateParams._indexId);
    }
  }

  handleIndexChange = (selectedOption) => {
    if (selectedOption.length) {
      const selectedIndexPatternId = selectedOption[0].value;
      this.props.setValue('_indexId', selectedIndexPatternId);
      this.fetchIndex(selectedIndexPatternId);
    } else {
      this.props.setValue('_indexId', '');
    }
    this.props.setValue('_coordinateField', '');
    this.props.setValue('_valueField', '');
  }

  handleCoordinateFieldChange = (selectedOption) => {
    if (selectedOption.length) {
      const _coordinateField = selectedOption[0].value;
      this.props.setValue('_coordinateField', _coordinateField);
    } else {
      this.props.setValue('_coordinateField', '');
    }
  }

  handleValueFieldChange = (selectedOption) => {
    if (selectedOption.length) {
      const _valueField = selectedOption[0].value;
      this.props.setValue('_valueField', _valueField);
    } else {
      this.props.setValue('_valueField', '');
    }
  }

  fetchIndex = async (indexId) => {
    const indexPattern = await indexPatternService.get(indexId);
    console.log('indexPattern', indexPattern);
    this.setState({ indexPattern });
  }

  getFieldsOptions = () => {
    const { indexPattern } = this.state;
    const fields = _.get(indexPattern, 'fields', []);
    return _.map(fields, f => {
      return {
        label: f.name,
        value: f.name
      }
    });
  }

  render () {
    const { indexPattern = {} } = this.state;
    const { stateParams } = this.props;
    const { savedObjectsCache } = indexPatternService;
    console.log('Editor props', this.props, savedObjectsCache);
    const options = _.map(savedObjectsCache, obj => {
      return {
        label: obj.attributes.title,
        value: obj.id
      }
    });

    const fieldOptions = this.getFieldsOptions();

    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiFormRow>
                <div>
                  <label className="euiFormLabel euiFormRow__label">Index</label>
                  <EuiComboBox
                    placeholder='Select Index'
                    singleSelection={true}
                    options={options}
                    selectedOptions={_.filter(options, o => o.value === stateParams._indexId)}
                    onChange={this.handleIndexChange}
                  />
                </div>
              </EuiFormRow>
              {!!fieldOptions.length && (
                <React.Fragment>
                  <EuiFormRow>
                    <div>
                      <label className="euiFormLabel euiFormRow__label">Coordinate Field</label>
                      <EuiComboBox
                        placeholder='Select Coordinate Field'
                        singleSelection={true}
                        options={fieldOptions}
                        selectedOptions={_.filter(fieldOptions, o => o.value === stateParams._coordinateField)}
                        onChange={this.handleCoordinateFieldChange}
                      />
                    </div>
                  </EuiFormRow>
                  <EuiFormRow>
                    <div>
                      <label className="euiFormLabel euiFormRow__label">Value Field</label>
                      <EuiComboBox
                        placeholder='Select Value Field'
                        singleSelection={true}
                        options={fieldOptions}
                        selectedOptions={_.filter(fieldOptions, o => o.value === stateParams._valueField)}
                        onChange={this.handleValueFieldChange}
                      />
                    </div>
                  </EuiFormRow>
                </React.Fragment>
              )}
              <EuiFormRow>
                <div>
                  <label class="euiFormLabel euiFormRow__label">Pie Box Size</label>
                  <EuiFieldNumber value={stateParams._pieSize} onChange={(e) => {
                    this.props.setValue('_pieSize', e.currentTarget.value);
                  }}/>
                </div>
              </EuiFormRow>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
};
