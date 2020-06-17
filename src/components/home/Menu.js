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

const Menu = (props) => {


    const [show, setShow] = useState(false)
    const [pay, setPay] = useState('1')
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const trans = useSelector(state => state.trans)
    const data = reduce(trans)

    useEffect(() => {

    }, [])
    // const pecahan = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]

    // function right(str, chr) {
    //     return str.slice(str.length - chr, str.length);
    // }
    // function left(str, chr) {
    //     return str.slice(0, chr - str.length);
    // }

    const handleCheck = (e) => {
        const val = e.target.value
        setPay(val)
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
                                <input type="number" name="cash" className="form-control" placeholder="atau input manual disini" />
                            </div>
                            <div className="form-group">
                                <label>Sedekah</label>
                                <input type="number" name="sedekah" className="form-control" placeholder="Masukan nominal sedekah" />
                            </div>
                            <div className="form-group">
                                <label>Kembalian</label>
                                <input type="text" name="cashback" className="form-control" readOnly />
                            </div>
                        </div>
                        : <div>
                            <div className="form-group">
                                <label>BANK</label>
                                <select className="form-control">
                                    <option value="">---Pilih Penyedia Bank---</option>
                                    <option value="BCA">BCA</option>
                                    <option value="BRI">BRI</option>
                                    <option value="BNI">BNI</option>
                                    <option value="Mandiri">Mandiri</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nomor Kartu Debit/Kredit <span className="text-danger">*</span></label>
                                <input type="number" name="no" className="form-control" placeholder="Masukan nomor kartu" />
                            </div>
                            <div className="form-group">
                                <label>Approval Code <span className="text-danger">*</span></label>
                                <input type="text" name="code" className="form-control" placeholder="Masukan kode approval" />
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Batal
                    </Button>
                    <Button variant="success">Proses</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Menu