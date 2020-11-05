import path from 'path';

import { writeFile, readFile } from './lib/file-io';
import logger from './logger';

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
