import { StringIndexable } from 'src/core/models/common.model';
import { RouteInfo } from 'src/core/models/route.model';

const routes: StringIndexable<RouteInfo> = {
  about: {
    path: '/about',
    source: '/api/v1/data/about',
  },
  cssStylesDemo: {
    path: '/demo/css-styles',
    source: '/api/v1/data/demo/css-styles',
  },
  cssInJsDemo: {
    path: '/demo/css-in-js',
    source: '/api/v1/data/demo/css-in-js',
  },
  home: {
    path: '/',
    source: '/api/v1/data/home',
  },
  default: {
    name: 'NOT_FOUND',
    path: '/*',
    source: '/api/v1/data/not-found',
  },
};

export default routes;
