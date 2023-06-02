import * as React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <div className="flex space-x-4 m-3">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/service">Service</NavLink>
      <NavLink to="/about-us">About Us</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/logout">Logout</NavLink>
    </div>
  );
}

export default NavBar;
