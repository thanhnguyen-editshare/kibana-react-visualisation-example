import React from 'react';
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

export default function ReactComponent ({ visData, ...props }) {
  console.log('Component props > ', props);
  console.log('Component visData > ', visData);
  const { columns, rows } = visData;
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
            <table>
              <thead>
                <tr>
                  {columns.map(c => {
                    return <th>{c.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map(rowData => {
                  return (
                    <tr>
                      {columns.map(c => {
                        return <td>{rowData[c.id]}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
