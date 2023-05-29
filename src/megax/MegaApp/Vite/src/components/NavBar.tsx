import * as React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <div className="flex space-x-4 m-3">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
    </div>
  );
}

export default NavBar;
