import React, { useState, useEffect } from 'react'
import memberImage from '../../assets/img/member.png'
import history from '../../assets/img/history.png'
import product from '../../assets/img/product.png'
import open from '../../assets/img/open.png'
import clerek from '../../assets/img/clerek.png'
import ecommerce from '../../assets/img/ecommerce.png'
import { numberFormat, reduce, printing } from '../../helpers'
import { Modal, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Menu = (props) => {

    const [show, setShow] = useState(false)
    const [pay, setPay] = useState('1')
    const [cash, setCash] = useState('')
    const [cashback, setCashback] = useState(0)
    const [sedekah, setSedekah] = useState(0)
    const [debit, setDebit] = useState()
    const [code, setCode] = useState('')
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [bank, setBank] = useState()
    const [disable, setDisable] = useState(true)
    const [finish, setFinish] = useState(false)
    const [transId, setTransId] = useState(null)
    const [money, setMoney] = useState([])
    const trans = useSelector(state => state.trans)
    const member = useSelector(state => state.member)
    const data = reduce(trans)
    let pecahan = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]
    
    useEffect(() => {
        if (pay === '2') {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [pay, transId])

    const handlePay = () => {
        if (data.sub_total > 0) {
            handleShow()
            if (data.sub_total > 100000) {
                let pecah = right(data.sub_total.toString(), 5)
                let hasil = pecahan.filter(el => el >= parseInt(pecah))
                let arr = []
                let result = []
                hasil.map(el => arr.push((data.sub_total - parseInt(pecah)) + el))
                arr.forEach(el => {
                    if (el > data.sub_total) {
                        result.push(el)
                    }
                })
                setMoney(result)
            } else {
                let hasil = pecahan.filter(el => el >= data.sub_total)
                let arr = []
                let result = []
                hasil.map(el => arr.push((data.sub_total - data.sub_total) + el))
                arr.forEach(el => {
                    if (el !== data.sub_total) {
                        result.push(el)
                    }
                })
                setMoney(result)
            }
        } else {
            alert('Data belanjaan anda masih kosong!')
        }
    }

    const handleCheck = (e) => {
        const val = e.target.value
        setPay(val)
    }

    const handleCash = (val) => {
        setCash(val)
        const total = val - data.sub_total
        setCashback(total)
        if (val >= data.sub_total) {
            setDisable(false)
        } else {
            setDisable(true)
        }
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
            memberId: (member) ? member.memberId : null,
            member_no: (member) ? member.member_no : null,
            member_fullname: (member) ? member.member_fullname : null,
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
                let id = hit.data.data
                setFinish(true)
                setTransId(id)
                printing(id)
            } else {
                alert(hit.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePrint = () => {
        printing(transId)
    }

    function right(str, chr) {
        return str.slice(str.length - chr, str.length);
    }

    return (
        <>
            <div className="mt-2 text-bayar">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white" onClick={props.member}>
                            <img src={memberImage} alt="" height="70" className="mx-auto d-block" />
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
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white" onClick={props.hold}>
                            <img src={open} alt="" height="70" className="mx-auto d-block" />
                            OPEN HOLD
                        </div>
                    </div>
                </div>
                <div className="row top">
                    <div className="col-md-6">
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white" onClick={props.clerk}>
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
                <Modal.Header>
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
                                <label>Uang Tunai <span className="text-danger">*</span></label><br/>
                                <Button variant="success" size="sm" className="ml-2 mt-1" onClick={() => handleCash(data.sub_total)}>{numberFormat(data.sub_total)}</Button>
                                {money.map(el => (
                                    <Button key={el} variant="success" size="sm" className="ml-2 mt-1" onClick={() => handleCash(el)}>{numberFormat(el)}</Button>
                                ))}
                                <input type="text" className="form-control mt-2" placeholder="atau input manual disini" onChange={e => cashBack(e)} value={cash} />
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
                            <Button variant="success" className="ml-3" onClick={handlePrint}>Print Struk</Button>
                        </div>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Menu