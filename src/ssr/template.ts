import { checkProd } from 'src/utils/env.utils';

export const template = (content: string, initialData: any) => {
  const isProd = checkProd();

  const styleTags = isProd ? '<link rel="stylesheet" href="/assets/css/style.css">' : '';

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    ${styleTags}
    <title>My App</title>
  </head>
  <body>
    <div id="root">${content}</div>
    <script src="/client.js"></script>
  </body>
</html>`;

  return page;
};
