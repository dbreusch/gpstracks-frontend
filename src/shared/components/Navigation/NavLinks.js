// display navigation items (link/button) with awareness of login status
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn &&
                <li>
                    <NavLink to={`/${auth.userId}/places`}>MY TRACKS</NavLink>
                </li>
            }
            {auth.isLoggedIn &&
                <li>
                    <NavLink to="/places/new">ADD TRACK</NavLink>
                </li>
            }
            {!auth.isLoggedIn &&
                <li>
                    <NavLink to="/auth">AUTHENTICATE</NavLink>
                </li>
            }
            {auth.isLoggedIn &&
                <li>
                    <button onClick={auth.logout}>LOGOUT</button>
                </li>
            }
        </ul>
    );
};

export default NavLinks;
