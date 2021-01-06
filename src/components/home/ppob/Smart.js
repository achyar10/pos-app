import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, cleanSeparator, Alert } from '../../../helpers'
import { topupUrl, scanMemberUrl } from '../../../Endpoint'
import NumberFormat from 'react-number-format';
import '../home.css'


const Smart = (props) => {

    const [modal, setModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [phone, setPhone] = useState('')
    const [pay, setPay] = useState(0)
    const [obj, setObj] = useState(null)
    const handleClose = () => setModal(false)

    useEffect(() => {

    }, [phone])

    const handleBuy = () => {
        setModal(true)
    }

    const handlePay = async () => {
        try {
            setDisabled(true)
            const body = { phone, amount: pay }
            const hit = await fetchPost(topupUrl, body)
            if (hit.status) {
                Alert('Topup Member Smart Berhasil')
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
            const hit = await fetchPost(scanMemberUrl, { phone: phone })
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
                    Topup Member Smart
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Nomor Member Smart</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor member..." onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <button className="btn btn-danger" disabled={disabled} onClick={inquiry}>Cek Member</button>
                    <hr />
                    {obj && <div><table className="table table-borderless table-sm table-hover">
                        <tbody>
                            <tr>
                                <td>Nama Member</td>
                                <td className="font-weight-bold">{obj.name}</td>
                            </tr>
                            <tr>
                                <td>Saldo Saat ini</td>
                                <td className="font-weight-bold">{numberFormat(obj.saldo)}</td>
                            </tr>
                            <tr>
                                <td>Point</td>
                                <td className="font-weight-bold">{numberFormat(obj.point)}</td>
                            </tr>
                        </tbody>
                    </table>
                        <button className="btn btn-success btn-block" onClick={() => handleBuy()}>Topup</button>
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
                        <label>Nominal Topup</label>
                        <NumberFormat className="form-control" onChange={e => setPay(cleanSeparator(e.target.value))} thousandSeparator={true} prefix={'Rp. '} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" disabled={disabled} onClick={handlePay}>BAYAR</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Smart