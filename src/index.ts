import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import reload from 'reload';
import { XMLHttpRequest } from 'xmlhttprequest';

import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';
import allRoutes from 'src/ssr/all-routes';
import { getMimeType } from 'starter/utils';
import { COMPRESSION_FILES_REGEX } from 'starter/const';

// support for XMLHttpRequest on node
(global as any).XMLHttpRequest = XMLHttpRequest;

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

// static compression for static assets
if (isProd) {
  app.get(COMPRESSION_FILES_REGEX, async (req, res, next) => {
    const acceptEncoding = req.header('accept-encoding') || '';
    const filename = path.resolve(process.cwd(), `build/public${req.url}`);
    const mimeType = await getMimeType(filename);

    if (/\bbr\b/.test(acceptEncoding)) {
      if (fs.existsSync(filename + '.br')) {
        req.url += '.br';
        res.set('Content-Encoding', 'br');
        if (mimeType) res.set('Content-Type', mimeType);
        return next();
      }
    }
    if (/\bgzip\b/.test(acceptEncoding)) {
      if (fs.existsSync(filename + '.gz')) {
        req.url += '.gz';
        res.set('Content-Encoding', 'gzip');
        if (mimeType) res.set('Content-Type', mimeType);
        return next();
      }
    }
    return next();
  });
}

// serve static assets
app.use(express.static('build/public'));

// create our own http server rather than using one given by express
const server = http.createServer(app);

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`\nApp running at port ${PORT} 😎\n`);
  });
};

const reloadServer = () => {
  reload(app)
    .then(() => startServer())
    .catch((error: any) => {
      console.error('[ERROR] Reload could not start server!', error);
    });
};

if (isProd) {
  startServer();
} else {
  reloadServer();
}

// must be last so that Reload can set route '/reload/reload.js' by now
allRoutes(app);
