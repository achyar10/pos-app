import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, Alert } from '../../../helpers'
import { prepaidGet, prepaidTrans } from '../../../Endpoint'
import { debounce } from 'lodash'
import '../home.css'


const Pulsa = (props) => {

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
        setPay(val.pulsa_price)
    }

    const handleProduct = debounce((val) => {
        getProduct(val)
    }, 1000)

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
                Alert('Pembelian Pulsa Prabayar Berhasil')
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
            setHp(val)
            const hit = await fetchPost(prepaidGet, { pulsa_type: 'pulsa', hp: val })
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
                    Pulsa Prabayar
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Nomor Handphone</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor handphone..." onChange={(e) => handleProduct(e.target.value)} />
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
                                        <td>{numberFormat(el.pulsa_price)}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={() => handleBuy(el)} disabled={(el.pulsa_price <= 0) ? true : false}>Pilih</button>
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
                        <input type="number" className="form-control" placeholder="Masukan uang tunai" defaultValue="0" onChange={(e) => setCash(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" disabled={disabled} onClick={handlePay}>BAYAR</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Pulsa