import serialize from 'serialize-javascript';

import { checkProd } from 'src/utils/env.utils';
import { InitialData } from 'src/core/models/response.model';
import { StyleElem } from 'src/core/models/common.model';
import { getAssetName, getAssetData } from 'starter/utils';

export const template = (
  content: string,
  scriptTags: string,
  linkTags: string,
  styleElems: StyleElem[],
  initialData: InitialData | null
) => {
  const isProd = checkProd();

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${serialize(initialData)}</script>` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'A modern approach';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  let scriptTop = '';
  let criticalCss = '';

  if (isProd) {
    scriptTop = `<script>${getAssetData(`/${getAssetName('scriptTop')}`)}</script>`;
    criticalCss = `<style>${styleElems.map(el => getAssetData(el.props.href)).join(' ')}</style>`;
  } else {
    linkTags = '';
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
  </body>
</html>`;

  return page;
};
