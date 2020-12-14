import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import { extractInitialData } from 'src/core/services/common.service';
import { getInitialData } from 'src/core/services/pages.service';
import { getGenericReqFromLocation } from 'src/utils/utils';
import { PropsRoot } from 'src/core/models/common.model';
import { HomePageData } from 'src/core/models/response.model';

import { heroText } from 'src/assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    const initialData = extractInitialData(this.props);
    if (initialData) {
      const { pageData } = initialData;
      this.state = { pageData };
    }
  }

  componentDidMount() {
    const req = getGenericReqFromLocation(this.props.location);
    getInitialData<HomePageData>(req).subscribe(initialData => {
      if (initialData) {
        const { pageData } = initialData;
        this.setState({ pageData });
      }
    });
  }

  render() {
    const { pageData } = this.state;
    const title = pageData?.title || '';
    const description = pageData?.description || '';

    return (
      <>
        <h2 className={heroText}>{title}</h2>
        <p>{description}</p>
        <ul>
          <li>
            <Link to={routes.cssStylesDemo.path}>Demo: CSS Styles</Link>
          </li>
          <li>
            <Link to={routes.cssInJsDemo.path}>Demo: CSS-in-JS (emotion)</Link>
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

export interface HomeState {
  pageData: HomePageData | null;
}
