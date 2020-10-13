import express from 'express';
import fs from 'fs';

import { checkProd } from 'src/utils/env.utils';

const app = express();
const PORT = 3000;

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
  const filePath = process.cwd() + `/build/public/index.html`;
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.send('Please refresh!');
  }
});

app.listen(PORT, () => {
  console.log(`\nApp running at port ${PORT} 😎\n`);
});
