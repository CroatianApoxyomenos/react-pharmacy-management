import React from "react";
import { LinkContainer } from "react-router-bootstrap";

function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <LinkContainer to="/">
          <a href="/" className="btn btn-ghost normal-case text-xl">
            George's Drug Store
          </a>
        </LinkContainer>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
}

export default Header;
