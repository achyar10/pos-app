import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, cleanSeparator, Alert } from '../../../helpers'
import { prepaidInquiry, prepaidGet, prepaidTrans, postpaidInquiry, postpaidTrans } from '../../../Endpoint'
import NumberFormat from 'react-number-format';
import '../home.css'


const Listrik = (props) => {

    const [modal, setModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hp, setHp] = useState('')
    const [type, setType] = useState('')
    const [product, setProduct] = useState([])
    const [pay, setPay] = useState(0)
    const [cash, setCash] = useState(0)
    const [obj, setObj] = useState(null)
    const [cust, setCust] = useState(null)
    const handleClose = () => setModal(false)

    useEffect(() => {

    }, [hp, type])

    const handleBuyPre = async (params) => {
        try {
            const hit = await fetchPost(prepaidInquiry, { hp: hp })
            if (hit.status) {
                setModal(true)
                setCust(hit.data)
                setObj(params)
                setPay(params.pulsa_sell)
            } else {
                Alert(hit.message)
                setObj(null)
                setCust(null)
                setPay(0)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const handleBuyPost = () => {
        setModal(true)
        setPay(obj.price)
    }

    const handleType = (val) => {
        setType(val)
        if (val === '1') {
            getProduct()
        } else {
            setObj(null)
        }
    }

    const handlePay = async () => {
        try {
            setDisabled(true)
            if (type === '1') {
                const body = {
                    hp: hp,
                    code: obj.pulsa_code,
                    operator: obj.pulsa_op,
                    nominal: obj.pulsa_nominal,
                    hpp: obj.pulsa_price,
                    sales: obj.pulsa_sell,
                    type: obj.pulsa_type,
                    cash: cash
                }
                const hit = await fetchPost(prepaidTrans, body)
                if (hit.status) {
                    Alert('Pembelian Token Listrik Berhasil')
                    handleClose()
                    setObj(null)
                    setCust(null)
                } else {
                    Alert(hit.message)
                }
            } else {
                const body = {
                    hp: hp,
                    code: obj.code,
                    ref_id: obj.ref_id,
                    tr_id: obj.tr_id,
                    hpp: obj.selling_price,
                    sales: obj.price,
                    cash: cash
                }
                const hit = await fetchPost(postpaidTrans, body)
                if (hit.status) {
                    Alert('Pembayaran Tagihan Listrik Berhasil')
                    handleClose()
                    setObj(null)
                } else {
                    Alert(hit.message)
                }
            }
            setDisabled(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const getProduct = async () => {
        try {
            const hit = await fetchPost(prepaidGet, { pulsa_type: 'pln' })
            if (hit.status) {
                const filter = hit.data.filter(el => el.pulsa_op === 'PLN')
                setProduct(filter)
            } else {
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const inquiry = async () => {
        try {
            setDisabled(true)
            const hit = await fetchPost(postpaidInquiry, { code: 'PLNPOSTPAID', hp: hp })
            if (hit.status) {
                setObj(hit.data)
            } else {
                Alert(hit.message)
                setObj(null)
            }
            setDisabled(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }


    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='md' animation={false} className={modal && 'hide'}>
                <Modal.Header closeButton>
                    Beli Token atau Bayar Tagihan Listrik
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Jenis Produk Listrik</label>
                        <select className="form-control" onChange={(e) => handleType(e.target.value)}>
                            <option value="">--- Pilih Jenis ---</option>
                            <option value="1">Token Listrik</option>
                            <option value="2">Tagihan Listrik</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Nomor Meter / ID Pelanggan</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor Meter/ID Pelanggan" onChange={(e) => setHp(e.target.value)} />
                    </div>
                    {(() => {
                        switch (type) {
                            case '1':
                                return (<div>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-borderless table-hover">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Operator</th>
                                                    <th>Nominal</th>
                                                    <th>Harga</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.map((el, i) =>
                                                    <tr key={i}>
                                                        <td>{el.pulsa_op}</td>
                                                        <td>{numberFormat(el.pulsa_nominal)}</td>
                                                        <td>{numberFormat(el.pulsa_sell)}</td>
                                                        <td>
                                                            <button className="btn btn-success btn-sm" onClick={() => handleBuyPre(el)} disabled={(el.pulsa_sell <= 0) ? true : false}>Pilih</button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>)
                            case '2':
                                return (
                                    <div>
                                        <button className="btn btn-danger" disabled={disabled} onClick={inquiry}>Cek Tagihan</button>
                                        {obj && <div>
                                            <hr />
                                            <table className="table table-borderless table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Nama Pelanggan</td>
                                                        <td className="font-weight-bold">{obj.tr_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Periode Tagihan</td>
                                                        <td className="font-weight-bold">{obj.period}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tarif/Daya</td>
                                                        <td className="font-weight-bold">{`${obj.desc.tarif}/${obj.desc.daya}`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nominal Tagihan</td>
                                                        <td className="font-weight-bold">Rp. {numberFormat(obj.nominal)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Biaya Admin</td>
                                                        <td className="font-weight-bold">Rp. {numberFormat(obj.admin)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Tagihan</td>
                                                        <td className="font-weight-bold">Rp. {numberFormat(obj.price)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <button className="btn btn-success btn-block" onClick={() => handleBuyPost()}>Bayar</button>
                                        </div>}
                                    </div>)
                            default:
                                return (<div></div>)
                        }
                    })()}
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <Modal show={modal} onHide={handleClose} backdrop="static" keyboard={false} size='md' animation={false}>
                <Modal.Header closeButton>
                    <span className="font-weight-bold">Menu Pembayaran</span>
                </Modal.Header>
                <Modal.Body>
                    {cust && <div><div className="table-responsive">
                        <table className="table table-borderless table-sm">
                            <tbody>
                                <tr>
                                    <td>Nomor</td>
                                    <td className="font-weight-bold">{cust.subscriber_id}</td>
                                </tr>
                                <tr>
                                    <td>Nomor Meter</td>
                                    <td className="font-weight-bold">{cust.meter_no}</td>
                                </tr>
                                <tr>
                                    <td>Nama</td>
                                    <td className="font-weight-bold">{cust.name}</td>
                                </tr>
                                <tr>
                                    <td>Tarif/Daya</td>
                                    <td className="font-weight-bold">{cust.segment_power}</td>
                                </tr>
                                <tr>
                                    <td>Harga</td>
                                    <td className="font-weight-bold">Rp. {numberFormat(pay)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div></div>}
                    <div className="form-group">
                        <label>Total Tagihan</label>
                        <input type="text" className="form-control" value={numberFormat(pay)} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Uang Tunai</label>
                        <NumberFormat className="form-control" onChange={e => setCash(cleanSeparator(e.target.value))} thousandSeparator={true} prefix={'Rp. '} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" disabled={disabled} onClick={handlePay}>BAYAR</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Listrik