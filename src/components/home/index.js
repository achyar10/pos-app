import React, { useState, useEffect } from 'react'
import Navbar from '../navbar'
import Pay from './Pay'
import Menu from './Menu'
import Product from './Product'
import History from './History'
import Member from './Member'

const Home = (props) => {

    const title = 'Home'

    useEffect(() => {
        document.title = title
    })

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const handleClose = () => setShow(false)
    const handleClose2 = () => setShow2(false)
    const handleClose3 = () => setShow3(false)
    const handleShow = () => setShow(true)
    const handleShow2 = () => setShow2(true)
    const handleShow3 = () => setShow3(true)
    const handleModalProduct = () => handleShow()
    const handleModalProduct2 = () => handleShow2()
    const handleModalProduct3 = () => handleShow3()

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
                        <Menu redirect={handleFinish} product={handleModalProduct} history={handleModalProduct2} member={handleModalProduct3} />
                    </div>
                </div>
                {/* <button className="btn btn-success" onClick={handlePrint}>Tes</button> */}
                <Product show={show} close={handleClose} />
                <History show={show2} close={handleClose2} />
                <Member show={show3} close={handleClose3} />
            </div>
        </div>
    )
}
export default Home