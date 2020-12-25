import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Alert } from '../../helpers'
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
import PaketData from './ppob/PaketData'
import Pasca from './ppob/Pasca'
import Listrik from './ppob/Listrik'
import Telkom from './ppob/Telkom'
import Bpjs from './ppob/Bpjs'
import Tv from './ppob/Tv'

const PPOB = (props) => {

    const [modal, setModal] = useState(false)
    const [showPulsa, setPulsa] = useState(false)
    const [showPaket, setPaket] = useState(false)
    const [showPasca, setPasca] = useState(false)
    const [showListrik, setListrik] = useState(false)
    const [showTelkom, setTelkom] = useState(false)
    const [showBpjs, setBpjs] = useState(false)
    const [showTv, setTv] = useState(false)

    const handleShowPulsa = () => {
        setPulsa(true)
        setModal(true)
    }
    const handleClosePulsa = () => {
        setPulsa(false)
        setModal(false)
    }

    const handleShowPaket = () => {
        setPaket(true)
        setModal(true)
    }
    const handleClosePaket = () => {
        setPaket(false)
        setModal(false)
    }

    const handleShowPasca = () => {
        setPasca(true)
        setModal(true)
    }
    const handleClosePasca = () => {
        setPasca(false)
        setModal(false)
    }

    const handleShowListrik = () => {
        setListrik(true)
        setModal(true)
    }
    const handleCloseListrik = () => {
        setListrik(false)
        setModal(false)
    }

    const handleShowTelkom = () => {
        setTelkom(true)
        setModal(true)
    }
    const handleCloseTelkom = () => {
        setTelkom(false)
        setModal(false)
    }

    const handleShowBpjs = () => {
        setBpjs(true)
        setModal(true)
    }
    const handleCloseBpjs = () => {
        setBpjs(false)
        setModal(false)
    }

    const handleShowTv = () => {
        setTv(true)
        setModal(true)
    }
    const handleCloseTv = () => {
        setTv(false)
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
                            <div className="card pointer" onClick={handleShowPaket}>
                                <div className="card-body text-center">
                                    <img src={pulsa} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PAKET DATA</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card pointer" onClick={handleShowPasca}>
                                <div className="card-body text-center">
                                    <img src={pulsa} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">PASCABAYAR</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card pointer" onClick={handleShowListrik}>
                                <div className="card-body text-center">
                                    <img src={pln} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">LISTRIK PLN</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card pointer" onClick={handleShowTelkom}>
                                <div className="card-body text-center">
                                    <img src={telkom} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">TELKOM</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card pointer" onClick={handleShowBpjs}>
                                <div className="card-body text-center">
                                    <img src={bpjs} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">BPJS</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-2">
                            <div className="card pointer" onClick={handleShowTv}>
                                <div className="card-body text-center">
                                    <img src={tv} height="60" width="60" alt="pulsa" className="mx-auto d-block" />
                                    <h6 className="mt-2">TV KABEL</h6>
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
            <PaketData show={showPaket} close={handleClosePaket} />
            <Pasca show={showPasca} close={handleClosePasca} />
            <Listrik show={showListrik} close={handleCloseListrik} />
            <Telkom show={showTelkom} close={handleCloseTelkom} />
            <Bpjs show={showBpjs} close={handleCloseBpjs} />
            <Tv show={showTv} close={handleCloseTv} />
        </div>
    )
}

export default PPOB
