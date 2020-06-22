import React from 'react'
import Logo from '../../assets/img/logo.png'
import Person from '../../assets/img/cashier.png'
import {useSelector} from 'react-redux'
import './navbar.css'

const Navbar = (props) => {

    const session = useSelector(state => state.session)

    return (
        <nav className="navbar">
            <a className="navbar-brand text-white" href="/"><img src={Logo} height="40" alt="" /> DAHANTA POS</a>
            <div style={{position: 'absolute', right: 250}}>
                <img src={Person} height="40" alt="" />
                <span className="ml-2 text-white font-weight-bold" style={{ position: 'absolute', bottom: 0 }}>{session.name}</span>
            </div>
            <span className="fa fa-sign-out text-white icon-size" onClick={props.logout}></span>
        </nav>
    )
}
export default Navbar