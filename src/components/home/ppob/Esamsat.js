import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, cleanSeparator, Alert } from '../../../helpers'
import { postpaidInquiry, postpaidTrans, postpaidByCode } from '../../../Endpoint'
import NumberFormat from 'react-number-format';
import '../home.css'


const Esamsat = (props) => {

    const [modal, setModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hp, setHp] = useState('')
    const [ktp, setKtp] = useState('')
    const [operator, setOperator] = useState('')
    const [pay, setPay] = useState(0)
    const [cash, setCash] = useState(0)
    const [obj, setObj] = useState(null)
    const [data, setData] = useState([])
    const handleClose = () => setModal(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hit = await fetchPost(postpaidByCode, { type: 'pajak-kendaraan' })
                setData(hit.data)
            } catch (error) {
                Alert('Server timeout!')
            }
        }
        if (props.fetching) {
            fetchData()
        }
    }, [hp, props])

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
                Alert('Pembayaran E-Samsat Berhasil')
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
            const hit = await fetchPost(postpaidInquiry, { code: operator, hp, ktp })
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
                    E-Samsat Online
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Wilayah</label>
                        <select className="form-control" onChange={(e) => setOperator(e.target.value)}>
                            <option value="">--- Pilih Wilayah ---</option>
                            {data.map((el, i) =>
                                <option key={i} value={el.code}>{el.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Kode Pembayaran</label>
                        <input type="text" className="form-control" placeholder="Masukan Kode Pembayaran..." onChange={(e) => setHp(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>No Identitas</label>
                        <input type="text" className="form-control" placeholder="Masukan Nomor identitas..." onChange={(e) => setKtp(e.target.value)} />
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
                                <td>Periode Tagihan</td>
                                <td className="font-weight-bold">{obj.period}</td>
                            </tr>
                            <tr>
                                <td>Nomor Identitas</td>
                                <td className="font-weight-bold">{obj.desc.nomor_identitas}</td>
                            </tr>
                            <tr>
                                <td>Merk Kendaraan</td>
                                <td className="font-weight-bold">{obj.desc.merek_kb}</td>
                            </tr>
                            <tr>
                                <td>Jenis Kendaraan</td>
                                <td className="font-weight-bold">{obj.desc.model_kb}</td>
                            </tr>
                            <tr>
                                <td>Tahun Kendaraan</td>
                                <td className="font-weight-bold">{obj.desc.tahun_buatan}</td>
                            </tr>
                            <tr>
                                <td>Nomor Polisi</td>
                                <td className="font-weight-bold">{obj.desc.nomor_polisi}</td>
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

export default Esamsat