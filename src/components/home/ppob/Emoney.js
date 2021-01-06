import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, cleanSeparator, Alert } from '../../../helpers'
import { prepaidByCode, prepaidTrans } from '../../../Endpoint'
import NumberFormat from 'react-number-format';
import '../home.css'


const Emoney = (props) => {

    const [modal, setModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hp, setHp] = useState('')
    const [product, setProduct] = useState([])
    const [pay, setPay] = useState(0)
    const [cash, setCash] = useState(0)
    const [obj, setObj] = useState({})
    const handleClose = () => setModal(false)

    useEffect(() => {

    }, [hp])

    const handleBuy = (val) => {
        setModal(true)
        setObj(val)
        setPay(val.pulsa_sell)
    }

    const handleOp = (val) => {
        getProduct(val)
    }

    const handlePay = async () => {
        try {
            setDisabled(true)
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
                Alert('Pembelian E-Wallet Berhasil')
                handleClose()
            } else {
                Alert(hit.message)
            }
            setDisabled(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const getProduct = async (val) => {
        try {
            const hit = await fetchPost(prepaidByCode, { pulsa_op: val })
            if (hit.status) {
                setProduct(hit.data)
            } else {
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }


    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='md' animation={false} className={modal && 'hide'}>
                <Modal.Header closeButton>
                    Topup E-Wallet
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Jenis E-Wallet</label>
                        <select className="form-control" onChange={(e) => handleOp(e.target.value)}>
                            <option value="">--- Pilih Jenis ---</option>
                            <option value="Mandiri E-Toll">Mandiri E-Toll</option>
                            <option value="Indomaret Card E-Money">E-Money</option>
                            <option value="TapCash BNI">TapCash BNI</option>
                            <option value="GoPay E-Money">Gopay</option>
                            <option value="DANA">DANA</option>
                            <option value="OVO">OVO</option>
                            <option value="LinkAja">LinkAja</option>
                            <option value="Shopee Pay">ShopeePay</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Nomor Handphone</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor handphone..." onChange={(e) => setHp(e.target.value)} />
                    </div>
                    <hr />
                    <div className="table-responsive">
                        <table className="table table-sm table-borderless table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Operator</th>
                                    <th>Nominal Pulsa</th>
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
                                            <button className="btn btn-success btn-sm" onClick={() => handleBuy(el)} disabled={(el.pulsa_sell <= 0) ? true : false}>Pilih</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <Modal show={modal} onHide={handleClose} backdrop="static" keyboard={false} size='md' animation={false}>
                <Modal.Header closeButton>
                    <span className="font-weight-bold">Menu Pembayaran</span>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Pilihan Pembayaran</label>
                        <input type="text" className="form-control" defaultValue="Tunai" readOnly />
                    </div>
                    <div className="form-group">
                        <label>Jumlah yang harus dibayarkan</label>
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

export default Emoney