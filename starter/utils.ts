import path from 'path';

import { readFile } from './lib/file-io';

const getStatsJson = () => {
  const statsFile = path.resolve(process.cwd(), `build/loadable-stats.json`);
  const stats = readFile(statsFile) || '{}';
  return JSON.parse(stats);
};

export const getAssetName = (chunkName: string) => {
  const statsJson = getStatsJson();
  return statsJson?.assetsByChunkName[chunkName] || '';
};

export const getAssetData = (assetName: string) => {
  const assetFile = path.resolve(process.cwd(), `build/public${assetName}`);
  return readFile(assetFile) || '';
};
