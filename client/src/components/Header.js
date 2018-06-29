import React from 'react';

const Footer = () => {
  return (
    <nav className="navbar navbar-expand-sm sticky-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            id="white-logo"
            src="/images/ghost-texts-heavy.svg"
            alt="White Logo"
          />
        </a>
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <a className="nav-link" href="/contact">
              Contact The Team
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Footer;
