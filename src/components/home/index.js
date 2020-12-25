import React, { useState, useEffect } from 'react'
import Navbar from '../navbar'
import Pay from './Pay'
import Menu from './Menu'
import Product from './Product'
import History from './History'
import Member from './Member'
import Clerk from './Clerk'
import Hold from './Hold'
import Setting from './Setting'
import PPOB from './PPOB'
import { useDispatch } from 'react-redux'


const Home = (props) => {

    const title = 'POS - Dahanta'

    useEffect(() => {
        document.title = title
    })
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)
    const [show5, setShow5] = useState(false)
    const [show6, setShow6] = useState(false)
    const [show7, setShow7] = useState(false)
    const handleClose = () => setShow(false)
    const handleClose2 = () => setShow2(false)
    const handleClose3 = () => setShow3(false)
    const handleClose4 = () => setShow4(false)
    const handleClose5 = () => setShow5(false)
    const handleClose6 = () => setShow6(false)
    const handleClose7 = () => setShow7(false)
    const handleShow = () => setShow(true)
    const handleShow2 = () => setShow2(true)
    const handleShow3 = () => setShow3(true)
    const handleShow4 = () => setShow4(true)
    const handleShow5 = () => setShow5(true)
    const handleShow6 = () => setShow6(true)
    const handleShow7 = () => setShow7(true)
    const handleModalProduct = () => handleShow()
    const handleModalProduct2 = () => handleShow2()
    const handleModalProduct3 = () => handleShow3()
    const handleModalProduct4 = () => {
        handleShow4()
        dispatch({ type: 'CLERK', payload: true })
    }
    const handleModalProduct5 = () => {
        handleShow5()
        dispatch({ type: 'HOLD', payload: true })
    }
    const handleModalProduct6 = () => handleShow6()
    const handleModalProduct7 = () => handleShow7()

    const handleLogout = () => {
        dispatch({ type: 'CLERK', payload: false })
        dispatch({ type: 'HOLD', payload: false })
        dispatch({ type: 'TRANS', payload: [] })
        dispatch({ type: 'MEMBER', payload: null })
        localStorage.removeItem('authJwt')
        props.history.push('/login')
    }

    return (
        <div className="bck">
            <Navbar logout={handleLogout} setting={handleModalProduct6} />
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-md-9">
                        <Pay />
                    </div>
                    <div className="col-md-3">
                        <Menu product={handleModalProduct} history={handleModalProduct2} member={handleModalProduct3} clerk={handleModalProduct4} hold={handleModalProduct5} ppob={handleModalProduct7} />
                    </div>
                </div>
                <Product show={show} close={handleClose} />
                <History show={show2} close={handleClose2} />
                <Member show={show3} close={handleClose3} />
                <Clerk show={show4} close={handleClose4} />
                <Hold show={show5} close={handleClose5} />
                <Setting show={show6} close={handleClose6} />
                <PPOB show={show7} close={handleClose7} />
            </div>
        </div>
    )
}
export default Home