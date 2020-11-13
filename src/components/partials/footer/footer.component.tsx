import React from 'react';

import { footer } from 'src/assets/css/common.module.scss';

const Footer = (_props: React.ComponentProps<any>) => {
  return (
    <div className={footer}>
      <br />
      <span>© 2020-present, Built with</span>
      <span>&nbsp;</span>
      <a href="https://starterjs.dev/" target="_blank" rel="noreferrer">
        Starter.js
      </a>
    </div>
  );
};

export default Footer;
