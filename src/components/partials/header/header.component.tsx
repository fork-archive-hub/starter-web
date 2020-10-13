import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';

const Header = (_props: React.ComponentProps<any>) => {
  return (
    <div>
      <Link to={routes.home.path}>Home</Link>
      <span>&nbsp;&nbsp;&nbsp;</span>
      <Link to={routes.about.path}>About</Link>
      <span>&nbsp;&nbsp;&nbsp;</span>
      <a href="https://github.com/baadal/starter-web" target="_blank" rel="noreferrer">GitHub</a>
      <span>&nbsp;&nbsp;&nbsp;</span>
    </div>
  );
};

export default Header;
