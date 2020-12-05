import path from 'path';
import FileType from 'file-type';
import mime from 'mime-types';

import { LinkElem, StyleElem, DomElem } from 'src/core/models/common.model';
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

export const filterLinkElems = (linkElems: LinkElem[], styleElems: StyleElem[]) => {
  const linkElemsMap = new Map<string, LinkElem>();
  const linkElemsFilter: LinkElem[] = [];
  const styleSheets = styleElems.map(el => el.props.href);

  linkElems.forEach(linkElem => {
    if (
      !linkElemsMap.has(linkElem.props.href) ||
      (linkElemsMap.get(linkElem.props.href)?.props.rel === 'prefetch' && linkElem.props.rel === 'preload')
    ) {
      linkElemsMap.set(linkElem.props.href, linkElem);
    }
  });
  linkElemsMap.forEach((value, key) => {
    if (styleSheets.includes(key) && value.props.rel === 'preload') {
      linkElemsFilter.push({
        type: value.type,
        props: { ...value.props, rel: 'prefetch' },
      });
    } else {
      linkElemsFilter.push(value);
    }
  });

  return linkElemsFilter;
};

export const getTagsFromElems = (elems: DomElem[]) => {
  const tags: string[] = [];

  elems.forEach(el => {
    const tag = [`<${el.type}`];
    Object.entries(el.props).forEach(([key, value]) => {
      tag.push(`${key}="${value}"`);
    });
    tags.push(tag.join(' ') + '>');
  });

  return tags.join('\n');
};

export const getMimeType = async (filename: string) => {
  let mimeType: string | false = false;

  try {
    const fileType = await FileType.fromFile(filename);
    mimeType = fileType?.mime || false;
  } catch (e) {} // eslint-disable-line

  if (!mimeType) {
    mimeType = mime.contentType(path.extname(filename));
  }

  return mimeType;
};
