import React from "react";
import { NavLink} from "react-router-dom";
import "./NavLinks.css"
const NavLinks = props=>{
    return <ul className="nav-links">
    <li>
        <NavLink to="/" exact>All USERS</NavLink>
    </li>
    <li>
        <NavLink to="/u1/places">My PLACES</NavLink>
    </li>
    <li>
        <NavLink to="/places/new">ADD PLACE</NavLink>
    </li>
    <li>
        <NavLink to="/auth">AUTHENTICATION</NavLink>
    </li>
    </ul>
};

export default NavLinks;