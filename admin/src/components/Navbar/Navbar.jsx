import React from "react";
import "./Navbar.css";
import navlogo from "../../assets/images/nav-logo.svg";
import navProfile from "../../assets/images/nav-profile.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={navlogo} className="nav-logo" alt="" />
      <img src={navProfile} className="nav-profile" alt="" />
    </div>
  );
};

export default Navbar;
