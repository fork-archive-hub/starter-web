import serialize from 'serialize-javascript';

import { checkProd } from 'src/utils/env.utils';
import { InitialData } from 'src/core/models/response.model';
import { LinkElem, StyleElem } from 'src/core/models/common.model';
import { getAssetName, getAssetData, getTagsFromElems } from 'starter/utils';

export const template = (
  content: string,
  scriptTags: string,
  linkElems: LinkElem[],
  styleElems: StyleElem[],
  initialData: InitialData | null
) => {
  const isProd = checkProd();

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${serialize(initialData)}</script>` : '';
  const reloadScript = !isProd ? `<script src="/reload/reload.js"></script>` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'A modern approach';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  let scriptTop = '';
  let scriptBottom = '';
  let criticalCss = '';
  let linkTags = '';

  if (isProd) {
    scriptTop = `<script>${getAssetData(`/${getAssetName('scriptTop')}`)}</script>`;
    scriptBottom = `<script>${getAssetData(`/${getAssetName('scriptBottom')}`)}</script>`;
    criticalCss = `<style>${styleElems.map(el => getAssetData(el.props.href)).join(' ')}</style>`;
    linkTags = getTagsFromElems(linkElems);
  }

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    ${criticalCss}
    ${scriptTop}
    ${linkTags}
    <title>${title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${declareInitialData}
    ${scriptTags}
    ${reloadScript}
    ${scriptBottom}
  </body>
</html>`;

  return page;
};
