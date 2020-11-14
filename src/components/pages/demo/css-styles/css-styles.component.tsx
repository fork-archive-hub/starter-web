import React from 'react';

import { demo, gradientDemo, modernFont } from './css-styles.module.css';

class CssStylesDemo extends React.Component<any, any> {
  render() {
    return (
      <>
        <h2>Demo: CSS Styles</h2>
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

export default CssStylesDemo;
