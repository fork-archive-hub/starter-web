import React from 'react';

import { footer } from 'src/assets/css/common.module.scss';

const Footer = (props: FooterProps) => {
  const { footerData } = props;
  const link = footerData?.externalLinks[0];

  return (
    <div className={footer}>
      {link && (
        <span>
          <br />
          <span>© 2020-present, Built with</span>
          <span>&nbsp;</span>
          <a href={link.path} target="_blank" rel="noreferrer">
            {link.title}
          </a>
        </span>
      )}
    </div>
  );
};

export interface FooterProps {
  footerData: any;
}

export default Footer;
