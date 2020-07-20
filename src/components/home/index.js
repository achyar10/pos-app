import React, { useState, useEffect } from 'react'
import Navbar from '../navbar'
import Pay from './Pay'
import Menu from './Menu'
import Product from './Product'
import History from './History'
import Member from './Member'
import Clerk from './Clerk'
import Hold from './Hold'
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
    const handleClose = () => setShow(false)
    const handleClose2 = () => setShow2(false)
    const handleClose3 = () => setShow3(false)
    const handleClose4 = () => setShow4(false)
    const handleClose5 = () => setShow5(false)
    const handleShow = () => setShow(true)
    const handleShow2 = () => setShow2(true)
    const handleShow3 = () => setShow3(true)
    const handleShow4 = () => setShow4(true)
    const handleShow5 = () => setShow5(true)
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

    const handleLogout = () => {
        if (window.confirm('Apakah anda akan menahan transaksi ini?')) {
            dispatch({ type: 'CLERK', payload: false })
            dispatch({ type: 'HOLD', payload: false })
            dispatch({ type: 'TRANS', payload: [] })
            dispatch({ type: 'MEMBER', payload: null })
            localStorage.removeItem('authJwt')
            props.history.push('/login')
        }
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
                        <Menu product={handleModalProduct} history={handleModalProduct2} member={handleModalProduct3} clerk={handleModalProduct4} hold={handleModalProduct5} />
                    </div>
                </div>
                <Product show={show} close={handleClose} />
                <History show={show2} close={handleClose2} />
                <Member show={show3} close={handleClose3} />
                <Clerk show={show4} close={handleClose4} />
                <Hold show={show5} close={handleClose5} />
            </div>
        </div>
    )
}
export default Home