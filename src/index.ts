import express from 'express';

import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';
import { serverRender } from './server';
import { template } from './template';

const app = express();
const PORT = env.port || 3000;

const isProd = checkProd();

// hide powered by express
app.disable('x-powered-by');

// disallow caching of JavaScript/CSS bundles in dev mode
app.use((req, res, next) => {
  if (!isProd && req.url.match(/\.(js|css)$/i)) {
    res.setHeader('Cache-Control', 'no-store');
  }
  return next();
});

// serve static assets
app.use(express.static('build/public'));

app.get('/*', (req, res) => {
  const initialData = {};
  const { content } = serverRender(req.url, initialData);
  const response = template(content);
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`\nApp running at port ${PORT} 😎\n`);
});
