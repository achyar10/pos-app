import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, Alert } from '../../../helpers'
import { postpaidInquiry, postpaidTrans } from '../../../Endpoint'
import '../home.css'


const Tv = (props) => {

    const [modal, setModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hp, setHp] = useState('')
    const [operator, setOperator] = useState('')
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
                Alert('Pembayaran Internet/TV Kabel Berhasil')
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
            const hit = await fetchPost(postpaidInquiry, { code: operator, hp: hp })
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

    const data = [
        { code: 'TVBIG', name: 'BIG TV' },
        { code: 'TVDENS', name: 'DENS TV' },
        { code: 'TVFIRST', name: 'FIRSTMEDIA' },
        { code: 'TVINDVS', name: 'INDOVISION' },
        { code: 'TVNEX', name: 'NEX MEDIA' },
        { code: 'TVTLKMV', name: 'TELKOM VISION' },
        { code: 'CBN', name: 'CBN INTERNET' },
        { code: 'MYREPUBLIC', name: 'MY REPUBLIC' },
        { code: 'NET1', name: 'NET1' },
    ]

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='md' animation={false} className={modal && 'hide'}>
                <Modal.Header closeButton>
                    Internet & TV Kabel
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Layanan Internet / TV Kabel</label>
                        <select className="form-control" onChange={(e) => setOperator(e.target.value)}>
                            <option value="">--- Pilih Layanan ---</option>
                            {data.map((el, i) =>
                                <option key={i} value={el.code}>{el.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Nomor Handphone</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor handphone..." onChange={(e) => setHp(e.target.value)} />
                    </div>
                    <button className="btn btn-danger" disabled={disabled} onClick={inquiry}>Cek Tagihan</button>
                    <hr />
                    {obj && <div><table className="table table-borderless table-sm table-hover">
                        <tbody>
                            <tr>
                                <td>Nama Pelanggan</td>
                                <td className="font-weight-bold">{obj.tr_name}</td>
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

export default Tv