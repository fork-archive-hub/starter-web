import fs from 'fs';

import logger from '../logger';

export const readFile = (file: string) => {
  let contents = null;
  try {
    contents = fs.readFileSync(file, 'utf8');
  } catch (e) {} // eslint-disable-line
  return contents;
};

export const writeFile = (file: string, contents: string) => {
  try {
    const pos = file.lastIndexOf('/');
    const dir = file.substring(0, pos);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, contents);
  } catch (e) {
    logger.error(`ERROR while writing to ${file}`);
  }
};
