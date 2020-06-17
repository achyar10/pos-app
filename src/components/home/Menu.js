import React, { useState, useEffect } from 'react'
import member from '../../assets/img/member.png'
import history from '../../assets/img/history.png'
import product from '../../assets/img/product.png'
import open from '../../assets/img/open.png'
import clerek from '../../assets/img/clerek.png'
import ecommerce from '../../assets/img/ecommerce.png'
import { numberFormat, reduce } from '../../helpers'
import { Modal, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Menu = (props) => {

    const [show, setShow] = useState(false)
    const [pay, setPay] = useState('1')
    const [cash, setCash] = useState()
    const [cashback, setCashback] = useState(0)
    const [sedekah, setSedekah] = useState(0)
    const [debit, setDebit] = useState()
    const [code, setCode] = useState('')
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [bank, setBank] = useState()
    const [disable, setDisable] = useState(true)
    const [finish, setFinish] = useState(false)
    const trans = useSelector(state => state.trans)
    const data = reduce(trans)

    useEffect(() => {
        if (pay === '2') {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [pay])

    const handlePay = () => {
        if (data.sub_total > 0) {
            handleShow()
        } else {
            alert('Data belanjaan anda masih kosong!')
        }
    }

    const handleCheck = (e) => {
        const val = e.target.value
        setPay(val)
    }

    const cashBack = (e) => {
        const tunai = e.target.value
        const total = tunai - data.sub_total
        setCash(tunai)
        setCashback(total)
        if (tunai >= data.sub_total) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }

    const donate = (e) => {
        const sedekah = e.target.value
        const total = cash - data.sub_total - sedekah
        setSedekah(sedekah)
        setCashback(total)
    }

    const bayar = () => {
        let details = []
        trans.forEach(el => {
            details.push({
                productId: el.productId,
                barcode: el.barcode,
                desc: el.desc,
                qty: el.qty,
                hpp: el.hpp,
                sales: el.sales,
                disc: el.disc
            })
        });
        const snap = {
            payment_method: (pay === '1') ? 'CASH' : 'DEBIT/CREDIT',
            cash: (pay === '1') ? cash : 0,
            sedekah, bank, ccno: debit, code,
            items: details
        }
        hit(snap)
    }

    const hit = async (body) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
            }
            const hit = await axios.post(`${process.env.REACT_APP_API_POS}/transaction/create`, body, config)
            if (hit.data.status) {
                setFinish(true)
            } else {
                alert(hit.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white" onClick={props.history}>
                            <img src={history} alt="" height="70" className="mx-auto d-block" />
                            HISTORY
                        </div>
                    </div>
                </div>
                <div className="row top">
                    <div className="col-md-6">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white" onClick={props.product}>
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
                <button className="btn btn-danger btn-lg btn-bayar shadow" onClick={handlePay}>BAYAR</button>
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Total Bayar Rp. {numberFormat(data.sub_total)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label><input type="radio" name="type" value="1" defaultChecked={true} onChange={e => handleCheck(e)} /> Tunai</label><br />
                        <label><input type="radio" name="type" value="2" onChange={e => handleCheck(e)} /> Debit/Kredit</label>
                    </div>
                    <hr />
                    {(pay === '1') ?
                        <div>
                            <div className="form-group mt-2">
                                <label>Uang Tunai <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" placeholder="input manual disini" onChange={e => cashBack(e)} />
                            </div>
                            <div className="form-group">
                                <label>Sedekah</label>
                                <input type="text" className="form-control" placeholder="Masukan nominal sedekah" onChange={e => donate(e)} />
                            </div>
                            <div className="form-group">
                                <label>Kembalian</label>
                                <input type="text" className="form-control" readOnly value={numberFormat(cashback)} />
                            </div>
                        </div>
                        :
                        <div>
                            <div className="form-group">
                                <label>BANK</label>
                                <select className="form-control" onChange={e => setBank(e.target.value)}>
                                    <option value="">---Pilih Penyedia Bank---</option>
                                    <option value="BCA">BCA</option>
                                    <option value="BRI">BRI</option>
                                    <option value="BNI">BNI</option>
                                    <option value="Mandiri">Mandiri</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nomor Kartu Debit/Kredit <span className="text-danger">*</span></label>
                                <input type="number" className="form-control" placeholder="Masukan nomor kartu" onChange={e => setDebit(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Approval Code <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" placeholder="Masukan kode approval" onChange={e => setCode(e.target.value)} value={code} />
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {(!finish) ?
                        <div>
                            <Button variant="secondary" onClick={handleClose}>
                                Batal
                            </Button>
                            <Button variant="success" className="ml-3" onClick={bayar} disabled={disable}>Proses</Button>
                        </div>
                        :
                        <div>
                            <Button variant="secondary" onClick={props.redirect}>Selesai</Button>
                            <Button variant="success" className="ml-3">Print Struk</Button>
                        </div>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Menu