import React from 'react';

import { CssStylesDemoData } from 'src/core/models/response.model';

import { demo, gradientDemo, modernFont } from './css-styles.module.scss';

class CssStylesDemo extends React.Component<CssStylesDemoProps, CssStylesDemoState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';

    return (
      <>
        <h2>{title}</h2>
        <div className={demo}>
          <div className={gradientDemo}>linear-gradient (Vendor prefixes)</div>
          <br />
          <div className={modernFont}>font-family: system-ui (Modern font)</div>
          <br />
          <div>
            <a href="//g.co">Hover Me!</a> (New syntax)
          </div>
        </div>
      </>
    );
  }
}

export interface CssStylesDemoProps {
  pageData: CssStylesDemoData | null;
}

export interface CssStylesDemoState {}

export default CssStylesDemo;
