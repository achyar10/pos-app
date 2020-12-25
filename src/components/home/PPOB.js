import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import pulsa from '../../assets/img/pulsa.png'
import pln from '../../assets/img/pln.png'
import telkom from '../../assets/img/telkom.png'
import bpjs from '../../assets/img/bpjs.png'
import tv from '../../assets/img/tv.png'
import pdam from '../../assets/img/pdam.png'
import emoney from '../../assets/img/emoney.png'
import cicilan from '../../assets/img/cicilan.png'
import esamsat from '../../assets/img/esamsat.png'
import pbb from '../../assets/img/pbb.png'
import './home.css'
import Pulsa from './ppob/Pulsa'

const PPOB = (props) => {

    const [modal, setModal] = useState(false)
    const [showPulsa, setPulsa] = useState(false)
    
    const handleShowPulsa = () => {
        setPulsa(true)
        setModal(true)
    }
    const handleClosePulsa = () => {
        setPulsa(false)
        setModal(false)
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='xl' animation={false} className={(modal) ? 'hide' : ''}>
                <Modal.Header>
                    Menu PPOB
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-2">
                            <div className="card pointer" onClick={handleShowPulsa}>
                                <div className="card-body text-center">
                                    <img src={pulsa} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PULSA</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={pulsa} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PAKET DATA</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={pulsa} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PASCABAYAR</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={pln} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">LISTRIK PLN</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={telkom} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">TELKOM</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={bpjs} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">BPJS</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={tv} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">TV Kabel</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={pdam} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PDAM</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={cicilan} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">ANGSURAN</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={emoney} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">E-MONEY</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={esamsat} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">E-SAMSAT</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src={pbb} height="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PBB</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>Tutup</Button>
                </Modal.Footer>
            </Modal>
            <Pulsa show={showPulsa} close={handleClosePulsa} />
        </div>
    )
}

export default PPOB
