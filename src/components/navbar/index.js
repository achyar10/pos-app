import React from 'react'
import Logo from '../../assets/img/logo.png'
import './navbar.css'

const Navbar = (props) => {

    return (
        <nav className="navbar">
            <a className="navbar-brand text-white" href="/"><img src={Logo} height="40" alt="" /> DAHANTA POS</a>
            <span className="fa fa-sign-out text-white icon-size" onClick={props.logout}></span>
        </nav>
    )
}
export default Navbar