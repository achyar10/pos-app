import React, { useState, useEffect } from 'react'
import Navbar from '../navbar'
import Pay from './Pay'
import Menu from './Menu'
import Product from './Product'

const Home = (props) => {

    const title = 'Home'

    useEffect(() => {
        document.title = title
    })

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleLogout = () => {
        localStorage.removeItem('authJwt')
        props.history.push('/login')
    }

    const handleFinish = () => {
        window.location.href = '/'
    }

    const handleModalProduct = () => {
        handleShow()
    }

    return (
        <div className="bck">
            <Navbar logout={handleLogout} />
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-md-9">
                        <Pay />
                    </div>
                    <div className="col-md-3">
                        <Menu redirect={handleFinish} product={handleModalProduct} />
                    </div>
                </div>
                <Product show={show} close={handleClose} />
            </div>
        </div>
    )
}
export default Home