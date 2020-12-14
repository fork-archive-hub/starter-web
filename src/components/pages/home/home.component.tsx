import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import { PropsRoot } from 'src/core/models/common.model';
import { HomePageData } from 'src/core/models/response.model';

import { heroText, punchline } from 'src/assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';
    const description = pageData?.description || '';

    return (
      <>
        <h2 className={heroText}>{title}</h2>
        <p className={punchline}>{description}</p>
        <ul>
          <li>
            <Link to={routes.cssStylesDemo.path}>Demo: CSS Styles</Link>
          </li>
          <li>
            <Link to={routes.cssInJsDemo.path}>Demo: CSS-in-JS (emotion)</Link>
          </li>
          <li>
            <Link to={routes.stateStoreDemo.path}>Demo: State Store</Link>
          </li>
          <li>
            <Link to="/demo/fibonacci/10">Demo: Fibonacci Numbers</Link>
          </li>
          <li>
            <Link to="/demo/broken-link">Demo: Broken Link</Link>
          </li>
        </ul>
        <p className={punchline}>Performance</p>
        <ul>
          <li>
            <a href="https://web.dev/measure/" target="_blank" rel="noreferrer">
              Lighthouse
            </a>
          </li>
          <li>
            <a href="https://gtmetrix.com/" target="_blank" rel="noreferrer">
              GTmetrix
            </a>
          </li>
        </ul>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {
  pageData: HomePageData | null;
}

export interface HomeState {}
