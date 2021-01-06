import React, { useState, useEffect } from 'react'
import memberImage from '../../assets/img/member.png'
import history from '../../assets/img/history.png'
import product from '../../assets/img/product.png'
import open from '../../assets/img/open.png'
import clerek from '../../assets/img/clerek.png'
import ppob from '../../assets/img/ecommerce.png'
import { numberFormat, reduce, printing, fetchPost, fetchPut, cleanSeparator, Alert } from '../../helpers'
import { Modal, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { transUrl, smartMemberUrl, scanVoucherUrl, payVoucherUrl, qrisSnap, qrisWaiting } from '../../Endpoint'
import { useDispatch } from 'react-redux'
import QRCode from 'react-qr-code'
import NumberFormat from 'react-number-format';

const Menu = (props) => {

    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [pay, setPay] = useState('CASH')
    const [cash, setCash] = useState('')
    const [cashback, setCashback] = useState(0)
    const [sedekah, setSedekah] = useState(0)
    const [debit, setDebit] = useState()
    const [code, setCode] = useState('')
    const [bank, setBank] = useState()
    const [disable, setDisable] = useState(true)
    const [generate, setGenerate] = useState(false)
    const [labelGenerate, setLabelGenerate] = useState('Generate QR')
    const [finish, setFinish] = useState(false)
    const [transId, setTransId] = useState(null)
    const [partials, setPartial] = useState([])
    const [voucher, setVoucher] = useState('')
    const [voucherRp, setVoucherRp] = useState(0)
    const [qrisId, setQrisId] = useState(null)
    const [qrCode, setQrCode] = useState('')
    const [money, setMoney] = useState([])
    const [intervalId, setIntervalId] = useState(null)
    const trans = useSelector(state => state.trans)
    const member = useSelector(state => state.member)
    const data = reduce(trans)
    let pecahan = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]

    useEffect(() => {

    }, [pay, transId, partials, intervalId])

    const handleClose = () => {
        setPay('CASH')
        setShow(false)
        setVoucherRp(0)
        setQrisId(null)
        setQrCode('')
        clearInterval(intervalId)
    }
    const handleShow = () => setShow(true)

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
            Alert('Data belanjaan anda masih kosong!')
        }
    }

    const handleCheck = (e) => {
        const val = e.target.value
        setPay(val)
        if (val === 'MEMBER') {
            if (member.member_saldo > data.sub_total) {
                setDisable(false)
            } else {
                setDisable(true)
            }
        } else if (val === 'DEBIT/CREDIT') {
            setDisable(false)
        } else {
            setDisable(true)
        }
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
        const tunai = cleanSeparator(e.target.value)
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
        const sedekah = cleanSeparator(e.target.value)
        const total = cash - data.sub_total - sedekah
        setSedekah(sedekah)
        setCashback(total)
    }

    const bayar = async (idQris = null) => {
        try {
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
                member_kind: (member) ? member.member_kind : null,
                payment_method: (partials.length > 0) ? 'PARTIAL' : pay,
                cash: (pay === 'CASH' || pay === 'VOUCHER') ? cash : 0,
                sedekah, bank, ccno: debit, code,
                items: details, partials, 
                qrisId: idQris
            }
            if (member) {
                if (member.member_kind === 'smart') {
                    let grand_total = data.sub_total
                    if (snap.payment_method === 'PARTIAL') {
                        for (const el of partials) {
                            if (el.method_name === 'MEMBER') {
                                grand_total = el.amount
                            }
                        }
                    }
                    const body = {
                        memberId: member.memberId,
                        amount: grand_total
                    }
                    if (snap.payment_method === 'PARTIAL' || snap.payment_method === 'MEMBER') {
                        const res = await fetchPut(smartMemberUrl, body)
                        if (!res.status) {
                            return Alert(res.message)
                        }
                    }
                }
            }
            if (snap.payment_method === 'VOUCHER') {
                fetchPut(payVoucherUrl, { voucher_no: voucher })
                    .then(() => console.log('Vouhcer OK'))
                    .catch(() => console.log('Voucher error'))
            }
            hit(snap)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const hit = async (body) => {
        try {
            const hit = await fetchPost(transUrl, body)
            if (hit.status) {
                let id = hit.data
                setFinish(true)
                setTransId(id)
                printing(id)
            } else {
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const handlePrint = () => {
        printing(transId)
    }

    const handleRemain = () => {
        setPartial([
            {
                method_name: pay,
                amount: (pay === 'MEMBER') ? member.member_saldo : data.sub_total
            },
            {
                method_name: 'CASH',
                amount: (member) ? data.sub_total - member.member_saldo : 0
            }
        ])
        setDisable(false)
        const btnRemain = document.getElementById('btnRemain')
        btnRemain.style.display = 'none'
    }

    const handleVoucher = async () => {
        try {
            const hit = await fetchPost(scanVoucherUrl, { voucher_no: voucher })
            if (hit.status) {
                setVoucherRp(hit.data.amount)
                if (hit.data.amount >= data.sub_total) {
                    setDisable(false)
                    setCash(hit.data.amount)
                }
                Alert('Voucher valid')
            } else {
                setVoucherRp(0)
                setDisable(true)
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const handleQris = async () => {
        try {
            setGenerate(true)
            setLabelGenerate('Mohon tunggu...')
            const hit = await fetchPost(qrisSnap, { amount: data.sub_total })
            if (hit.status) {
                setGenerate(false)
                setLabelGenerate('Generate QR')
                setQrisId(hit.data.id)
                setQrCode(hit.data.qr_string)
                waitingQrisPaid(hit.data.id)
            } else {
                setDisable(true)
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const waitingQrisPaid = (id) => {
        const interval = setInterval(async () => {
            setIntervalId(interval)
            const res = await fetchPost(qrisWaiting, { id })
            if (res.status) {
                await bayar(id)
                document.getElementById('qris').remove()
                clearInterval(interval);
            }
        }, 5000)
    }

    const handleFinish = () => {
        setShow(false)
        setPay('CASH')
        setCash('')
        setCashback(0)
        setSedekah(0)
        setDebit()
        setCode('')
        setBank()
        setDisable(true)
        setFinish(false)
        setTransId(null)
        setPartial([])
        setMoney([])
        setQrisId(null)
        setQrCode('')
        setMoney([])
        dispatch({ type: 'CLERK', payload: false })
        dispatch({ type: 'HOLD', payload: false })
        dispatch({ type: 'TRANS', payload: [] })
        dispatch({ type: 'MEMBER', payload: null })
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
                            PRODUCT
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
                        <div className="card button-box text-center shadow p-3 mb-5 bg-white" onClick={props.ppob}>
                            <img src={ppob} alt="" height="70" className="mx-auto d-block" />
                            PPOB
                        </div>
                    </div>
                </div>
                <button className="btn btn-danger btn-lg btn-bayar shadow" onClick={handlePay}>BAYAR</button>
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} animation={false}>
                <Modal.Header>
                    <Modal.Title>Total Bayar Rp. {numberFormat(data.sub_total)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <select id="pay" className="form-control" onChange={e => handleCheck(e)}>
                            <option value="CASH">Tunai</option>
                            <option value="DEBIT/CREDIT">Debit/Kredit</option>
                            {(member) ? ((member.member_kind === 'smart') ? <option value="MEMBER">Kartu Smart</option> : null) : null}
                            <option value="QRIS">E-Wallet (LinkAja/Gopay/OVO/Dana/ShopeePay/BCA/Mandiri Pay/CIMB)</option>
                            <option value="VOUCHER">Voucher</option>
                            {/* <option value="PARTIAL">Parsial</option> */}
                        </select>
                    </div>
                    <hr />
                    {(() => {
                        switch (pay) {
                            case 'CASH':
                                return (<div>
                                    <div className="form-group mt-2">
                                        <label>Uang Tunai <span className="text-danger">*</span></label><br />
                                        <Button variant="success" size="sm" className="ml-2 mt-1" onClick={() => handleCash(data.sub_total)}>{numberFormat(data.sub_total)}</Button>
                                        {money.map(el => (
                                            <Button key={el} variant="success" size="sm" className="ml-2 mt-1" onClick={() => handleCash(el)}>{numberFormat(el)}</Button>
                                        ))}
                                        <NumberFormat className="form-control mt-2" placeholder="atau input manual disini" onChange={e => cashBack(e)} value={cash} thousandSeparator={true} />
                                    </div>
                                    <div className="form-group">
                                        <label>Sedekah</label>
                                        <NumberFormat className="form-control mt-2" placeholder="Masukan nominal sedekah" onChange={e => donate(e)} thousandSeparator={true} />
                                    </div>
                                    <div className="form-group">
                                        <label>Kembalian</label>
                                        <input type="text" className="form-control" readOnly value={numberFormat(cashback)} />
                                    </div>
                                </div>)
                            case 'DEBIT/CREDIT':
                                return (
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
                                )
                            case 'MEMBER':
                                if (member) {
                                    return (<div>
                                        <div className="form-group">
                                            <label>Sisa Saldo</label>
                                            <input type="text" className="form-control" readOnly value={numberFormat(member.member_saldo)} />
                                        </div>
                                        {(member.member_saldo < data.sub_total) ?
                                            <Button id="btnRemain" variant="success" size="sm" onClick={() => handleRemain()}>Tambah Sisa Tagihan</Button>
                                            : null
                                        }
                                        {partials.map((el, i) => (
                                            <div className="form-group" key={i}>
                                                <label>{el.method_name}</label>
                                                <input type="number" className="form-control" readOnly value={numberFormat(el.amount)} />
                                            </div>
                                        ))}
                                    </div>)
                                } else {
                                    return (<div>
                                        <p>Bukan Member Smart</p>
                                    </div>)
                                }
                            case 'VOUCHER':
                                return (<div>
                                    <div className="form-group">
                                        <label>Nomor Voucher <span className="text-danger">*</span></label>
                                        <input type="number" className="form-control" placeholder="Masukan nomor voucher" onChange={e => setVoucher(e.target.value)} />
                                    </div>
                                    {(voucherRp > 0) ? <div className="form-group">
                                        <label>Nominal Voucher</label>
                                        <input type="text" className="form-control" readOnly value={numberFormat(voucherRp)} />
                                    </div> : null}
                                    <button className="btn btn-danger" onClick={handleVoucher}>Cek</button>
                                </div>)
                            case 'QRIS':
                                return (<div id="qris" className="text-center">
                                    <button className="btn btn-danger" onClick={handleQris} disabled={generate}>{labelGenerate}</button><br /><br />
                                    <div className="">
                                        {(qrisId) ? <QRCode value={qrCode} /> : null}
                                        <p>Silakan Scan QRCode ini pada aplikasi E-Wallet anda!</p>
                                    </div>
                                </div>)
                            default:
                                return (<div className="form-group">
                                    <p>Belum Tersedia</p>
                                </div>)
                        }
                    })()}
                </Modal.Body>
                <Modal.Footer>
                    {(!finish) ?
                        <div>
                            <Button variant="secondary" onClick={handleClose}>
                                Batal
                            </Button>
                            <Button variant="success" className="ml-3" onClick={() => bayar()} disabled={disable}>Proses</Button>
                        </div>
                        :
                        <div>
                            <Button variant="secondary" onClick={handleFinish}>Selesai</Button>
                            <Button variant="success" className="ml-3" onClick={handlePrint}>Print Struk</Button>
                        </div>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Menu