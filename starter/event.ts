import path from 'path';

import { writeFile, readFile } from './lib/file-io';
import store from './lib/store';
import logger from './logger';

const displayAssets = (isServer: boolean) => {
  const { assetList } = store;
  const assetMap = {
    main: '',
    images: [] as string[],
    css: [] as string[],
    fonts: [] as string[],
    compressed: [] as string[],
    rest: [] as string[],
  };

  assetList.forEach((item: string) => {
    if ((isServer && item === 'index.js') || (!isServer && /^client.+js$/.test(item))) {
      assetMap.main = item;
    } else if (/\.(png|jpe?g|gif|svg|ico)$/.test(item)) {
      assetMap.images.push(item);
    } else if (/\.css$/.test(item)) {
      assetMap.css.push(item);
    } else if (/\.(ttf|woff2?)$/.test(item)) {
      assetMap.fonts.push(item);
    } else if (/\.(gz|br)$/.test(item)) {
      assetMap.compressed.push(item);
    } else {
      assetMap.rest.push(item);
    }
  });

  console.log();
  logger.log_(assetMap.main);
  if (assetMap.images.length > 0) {
    logger.warn_(`images (${assetMap.images.length})`);
  }
  if (assetMap.css.length > 0) {
    logger.warn_(`css (${assetMap.css.length})`);
  }
  if (assetMap.fonts.length > 0) {
    logger.warn_(`fonts (${assetMap.fonts.length})`);
  }
  if (assetMap.compressed.length > 0) {
    logger.warn_(`compressed (${assetMap.compressed.length})`);
  }
  console.log();
  assetMap.rest.sort();
  assetMap.rest.forEach(item => {
    logger.cyan(item);
  });
};

const eventDone = (isServer: boolean, serverStarted: boolean) => {
  const postponeTrigger = 1500;
  const delay = isServer && serverStarted ? postponeTrigger : 100;

  setTimeout(() => {
    const emitPath = path.resolve(process.cwd(), `build/.event/done`);

    const lastTriggerTime = readFile(emitPath) || '0';
    const timestamp = `${Date.now()}`;

    const diff = parseInt(timestamp, 10) - parseInt(lastTriggerTime, 10);
    if (!serverStarted || diff >= postponeTrigger) {
      writeFile(emitPath, timestamp);
    }
  }, delay);
};

export const done = (isServer: boolean) => {
  displayAssets(isServer);

  const pathList = ['build/.event/client', 'build/.event/server'];
  const index = isServer ? 1 : 0;
  const emitPath = path.resolve(process.cwd(), pathList[index]);
  const siblingPath = path.resolve(process.cwd(), pathList[1 - index]);

  const triggerPath = path.resolve(process.cwd(), `build/.event/done`);
  const serverStarted = !!readFile(triggerPath);

  let diff = 0;
  if (!serverStarted) {
    const timestamp = `${Date.now()}`;
    writeFile(emitPath, timestamp);

    const siblingStamp = readFile(siblingPath) || '0';

    diff = parseInt(timestamp, 10) - parseInt(siblingStamp, 10);
  }

  const diffBuildTimeCS = 15000; // N = 15sec
  // console.log("diff time", diff);

  if (diff < diffBuildTimeCS) {
    // trigger if sibling (client/server) emitted in last N seconds
    // or the server is already running
    eventDone(isServer, serverStarted);
  } else if (diff < 2.5 * diffBuildTimeCS) {
    // review (possibly increase) diffBuildTimeCS value
    logger.error('[WARN] Review event file: diffBuildTime = ' + diff + ' ms');
    logger.warn('Please try again..');
  } else {
    // NOTE: Please don't call eventDone() here to ensure that localServer starts
    // only after when both client and server builds are complete
  }
};

export const watchRun = () => {
  store.cleanup();
};

export const assetEmitted = (file: string, _content: any) => {
  // const sizeBytes = content.length;
  store.addAsset(file);
};
