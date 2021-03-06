import express from 'express';
import cors from 'cors';
import compression from 'compression';

import { ServerResponse } from './core/models/response.model';

const app = express();
const PORT = process.env.portApi || 4000;

// hide powered by express
app.disable('x-powered-by');

app.use(cors());
app.use(compression());

app.set('json spaces', 2);

// ------------------------

const aboutInfo = {
  title: 'About',
  description: 'React starter kit for building modern Web Apps.',
  seo: {
    title: 'About Starter App',
    description: 'React starter kit for building modern Web Apps',
  },
};

const cssStylesDemoInfo = {
  title: 'Demo: CSS Styles',
  seo: {
    title: 'Demo: CSS Styles',
    description: 'A demonstration for CSS styles',
  },
};

const cssInJsDemo = {
  title: 'Demo: CSS-in-JS (emotion)',
  seo: {
    title: 'Demo: CSS-in-JS',
    description: 'A demonstration for CSS-in-JS',
  },
};

const storeInfo = () => ({
  title: '<i>Demo:</i> State Store',
  timestamp: new Date().toISOString(),
  seo: {
    title: 'Demo: State Store',
    description: 'A demonstration for using state store',
  },
});

const homeInfo = {
  title: 'My Starter App',
  description: 'The modern way!',
  seo: {
    title: 'My Starter App',
    description: 'A modern way of building Web Apps',
  },
};

const notFoundInfo = {
  title: 'Page Not Found (404)',
  description: 'This page does not exist.',
  message: 'Return to Homepage',
  seo: {
    title: 'Page Not Found',
    description: 'This page does not exist',
  },
};

const defaultInfo = {
  info: 'backend starter api',
};

const headerInfo = {
  links: [
    {
      path: '/',
      title: 'Home',
    },
    {
      path: '/about',
      title: 'About',
    },
  ],
  externalLinks: [
    {
      path: 'https://github.com/baadal/starter-web',
      title: 'GitHub',
    },
  ],
};

const footerInfo = (req: express.Request) => {
  const resp = {
    links: [] as any[],
    externalLinks: [] as any[],
  };

  if (req.query.path === '/about') {
    resp.externalLinks.push({
      path: 'https://starterjs.dev/',
      title: 'Starter.js',
    });
  }

  return resp;
};

const getFibonacciNum = (n: string) => {
  const num = parseInt(n || '', 10);

  let fibonacciNum = '';
  if (!Number.isNaN(num)) {
    if (num === 0 || num === 1) {
      fibonacciNum = `${num}`;
    } else if (num > 1) {
      let fx = 0;
      let fn = 1;
      for (let i = 2; i <= num; i += 1) {
        const next = fx + fn;
        fx = fn;
        fn = next;
      }
      fibonacciNum = `${fn}`;
    }
  }

  return {
    title: 'Demo: Fibonacci Numbers',
    n: `${num}`,
    fn: fibonacciNum,
    seo: {
      title: 'Demo: Fibonacci Numbers',
      description: 'A demonstration for fibonacci numbers',
    },
  };
};

// ------------------------

const sendResponse = (res: express.Response, data: any) => {
  const response: ServerResponse = { status: 'ok', data };
  return res.send(response);
};

app.get('/api/v1/data/about', (req, res) => sendResponse(res, aboutInfo));
app.get('/api/v1/data/demo/css-styles', (req, res) => sendResponse(res, cssStylesDemoInfo));
app.get('/api/v1/data/demo/css-in-js', (req, res) => sendResponse(res, cssInJsDemo));
app.get('/api/v1/data/demo/state-store', (req, res) => sendResponse(res, storeInfo()));
app.get('/api/v1/data/demo/fibonacci/:n', (req, res) => sendResponse(res, getFibonacciNum(req.params.n)));
app.get('/api/v1/data/home', (req, res) => sendResponse(res, homeInfo));
app.get('/api/v1/data/not-found', (req, res) => sendResponse(res, notFoundInfo));

app.get('/api/v1/data/header', (req, res) => sendResponse(res, headerInfo));
app.get('/api/v1/data/footer', (req, res) => sendResponse(res, footerInfo(req)));

app.get('/*', (req, res) => sendResponse(res, defaultInfo));

app.listen(PORT, () => {
  console.log(`\nAPI running at port ${PORT} 🎉\n`);
});
