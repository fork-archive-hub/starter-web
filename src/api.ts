import express from 'express';
import cors from 'cors';

import { ServerResponse } from './core/models/response.model';

const app = express();
const PORT = process.env.portApi || 4000;

// hide powered by express
app.disable('x-powered-by');

app.use(cors());

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

// ------------------------

const sendResponse = (res: express.Response, data: any) => {
  const response: ServerResponse = { status: 'ok', data };
  return res.send(response);
};

app.get('/api/v1/data/about', (req, res) => sendResponse(res, aboutInfo));
app.get('/api/v1/data/demo/css-styles', (req, res) => sendResponse(res, cssStylesDemoInfo));
app.get('/api/v1/data/demo/css-in-js', (req, res) => sendResponse(res, cssInJsDemo));
app.get('/api/v1/data/home', (req, res) => sendResponse(res, homeInfo));
app.get('/api/v1/data/not-found', (req, res) => sendResponse(res, notFoundInfo));

app.get('/api/v1/data/header', (req, res) => sendResponse(res, headerInfo));
app.get('/api/v1/data/footer', (req, res) => sendResponse(res, footerInfo(req)));

app.get('/*', (req, res) => sendResponse(res, defaultInfo));

app.listen(PORT, () => {
  console.log(`\nAPI running at port ${PORT} 🎉\n`);
});
