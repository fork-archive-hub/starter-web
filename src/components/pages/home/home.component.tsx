import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import { PropsRoot } from 'src/core/models/common.model';

import { heroText } from 'src/assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <>
        <h2 className={heroText}>My Web App</h2>
        <p>The modern way!</p>
        <ul>
          <li>
            <Link to={routes.cssStylesDemo.path}>Demo: CSS Styles</Link>
          </li>
          <li>
            <Link to="/demo/broken-link">Demo: Broken Link</Link>
          </li>
        </ul>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {}

export interface HomeState {}
