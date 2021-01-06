import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, cleanSeparator, Alert } from '../../../helpers'
import { postpaidInquiry, postpaidTrans } from '../../../Endpoint'
import NumberFormat from 'react-number-format';
import '../home.css'


const Bpjs = (props) => {

    const [modal, setModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hp, setHp] = useState('')
    const [operator, setOperator] = useState('')
    const [bulan, setBulan] = useState(1)
    const [pay, setPay] = useState(0)
    const [cash, setCash] = useState(0)
    const [obj, setObj] = useState(null)
    const handleClose = () => setModal(false)

    useEffect(() => {

    }, [hp])

    const handleBuy = () => {
        setModal(true)
        setPay(obj.price)
    }

    const handlePay = async () => {
        try {
            setDisabled(true)
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
                Alert('Pembayaran BPJS Berhasil')
                handleClose()
                setObj(null)
            } else {
                Alert(hit.message)
            }
            setDisabled(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const inquiry = async () => {
        try {
            setDisabled(true)
            const hit = await fetchPost(postpaidInquiry, { code: operator, hp: hp, period: bulan, })
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
                    BPJS
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Jenis BPJS</label>
                        <select className="form-control" onChange={(e) => setOperator(e.target.value)}>
                            <option value="">--- Pilih Jenis ---</option>
                            <option value="BPJS">BPJS Kesehatan</option>
                            <option value="BPJSTK">BPJS Ketenagakerjaan</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Nomor BPJS</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor BPJS..." onChange={(e) => setHp(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Jumlah Bulan</label>
                        <input type="number" className="form-control" min="1" defaultValue="1" onChange={(e) => setBulan(e.target.value)} />
                    </div>
                    <button className="btn btn-danger" disabled={disabled} onClick={inquiry}>Cek Tagihan</button>
                    <hr />
                    {obj && <div><table className="table table-borderless table-sm table-hover">
                        <tbody>
                            <tr>
                                <td>Nama Pelanggan</td>
                                <td>:</td>
                                <td>{obj.tr_name}</td>
                            </tr>
                            <tr>
                                <td>Nominal Tagihan</td>
                                <td>:</td>
                                <td>Rp. {numberFormat(obj.nominal)}</td>
                            </tr>
                            <tr>
                                <td>Biaya Admin</td>
                                <td>:</td>
                                <td>Rp. {numberFormat(obj.admin)}</td>
                            </tr>
                            <tr className="font-weight-bold">
                                <td>Total Tagihan</td>
                                <td>:</td>
                                <td>Rp. {numberFormat(obj.price)}</td>
                            </tr>
                        </tbody>
                    </table>
                        <button className="btn btn-success btn-block" onClick={() => handleBuy()}>Bayar</button>
                    </div>}

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

export default Bpjs