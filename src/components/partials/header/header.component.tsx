import React from 'react';
import { Link } from 'react-router-dom';

import { header } from 'src/assets/css/common.module.scss';

const Header = (props: HeaderProps) => {
  const { headerData } = props;

  return (
    <div className={header}>
      {headerData?.links?.map((link: any) => (
        <span key={link.path}>
          <Link to={link.path}>{link.title}</Link>
          <span>&nbsp;&nbsp;&nbsp;</span>
        </span>
      ))}
      {headerData?.externalLinks?.map((link: any) => (
        <span key={link.path}>
          <a href={link.path} target="_blank" rel="noreferrer">
            {link.title}
          </a>
          <span>&nbsp;&nbsp;&nbsp;</span>
        </span>
      ))}
    </div>
  );
};

export interface HeaderProps {
  headerData: any;
}

export default Header;
