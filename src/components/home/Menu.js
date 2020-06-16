import React, { useState } from 'react'
import member from '../../assets/img/member.png'
import history from '../../assets/img/history.png'
import product from '../../assets/img/product.png'
import open from '../../assets/img/open.png'
import clerek from '../../assets/img/clerek.png'
import ecommerce from '../../assets/img/ecommerce.png'
import { Modal, Button } from 'react-bootstrap'

const Menu = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            <div className="mt-2 text-bayar">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white">
                            <img src={member} alt="" height="70" className="mx-auto d-block" />
                            MEMBER
                        </div>
                    </div>
                    <div className="col-md-6 left">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white">
                            <img src={history} alt="" height="70" className="mx-auto d-block" />
                            HISTORY
                        </div>
                    </div>
                </div>
                <div className="row top">
                    <div className="col-md-6">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white">
                            <img src={product} alt="" height="70" className="mx-auto d-block" />
                            PRODUK
                        </div>
                    </div>
                    <div className="col-md-6 left">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white">
                            <img src={open} alt="" height="70" className="mx-auto d-block" />
                            OPEN HOLD
                        </div>
                    </div>
                </div>
                <div className="row top">
                    <div className="col-md-6">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white">
                            <img src={clerek} alt="" height="70" className="mx-auto d-block" />
                            CLERK
                        </div>
                    </div>
                    <div className="col-md-6 left">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white">
                            <img src={ecommerce} alt="" height="70" className="mx-auto d-block" />
                            PPOB
                        </div>
                    </div>
                </div>
                <button className="btn btn-danger btn-lg btn-bayar shadow" onClick={handleShow}>BAYAR</button>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    I will not close if you click outside me. Don't even try to press
                    escape key.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Menu