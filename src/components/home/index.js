import React, { useState, useEffect } from 'react'
import Navbar from '../navbar'
import Pay from './Pay'
import Menu from './Menu'
import Product from './Product'
import History from './History'

const Home = (props) => {

    const title = 'Home'

    useEffect(() => {
        document.title = title
    })

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const handleClose = () => setShow(false)
    const handleClose2 = () => setShow2(false)
    const handleShow = () => setShow(true)
    const handleShow2 = () => setShow2(true)
    const handleModalProduct = () => handleShow()
    const handleModalProduct2 = () => handleShow2()

    const handleLogout = () => {
        localStorage.removeItem('authJwt')
        props.history.push('/login')
    }

    const handleFinish = () => {
        window.location.href = '/'
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
                        <Menu redirect={handleFinish} product={handleModalProduct} history={handleModalProduct2} />
                    </div>
                </div>
                <Product show={show} close={handleClose} />
                <History show={show2} close={handleClose2} />
            </div>
        </div>
    )
}
export default Home