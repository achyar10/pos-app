import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { numberFormat, printing } from '../../helpers'

const History = (props) => {

    const [histori, setHistory] = useState([])
    const [search, setSearch] = useState('')
    const [nik, setNik] = useState('')
    const [password, setPassword] = useState('')
    const [transId, setTransId] = useState('')
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {

    }, [search])

    const handleHistory = (e) => {
        setSearch(e.target.value)
        getHistory()
    }

    const showModal = (id) => {
        handleShow()
        setTransId(id)
    }

    const getHistory = async () => {
        try {
            const q = search
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
            }
            const hit = await axios.post(`${process.env.REACT_APP_API_POS}/transaction/history`, { q }, config)
            if (hit.data.status) {
                setHistory(hit.data.data)
            } else {
                alert(hit.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRetur = () => {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
        }
        axios.post(`${process.env.REACT_APP_API_URL}/auth/authorize`, { nik, password }, config)
            .then(res => {
                if (res.data.status) {
                    axios.post(`${process.env.REACT_APP_API_POS}/transaction/retur`, { transId }, config)
                    alert(res.data.message)
                    setNik('')
                    setPassword('')
                    getHistory()
                    handleClose()
                } else {
                    alert(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Daftar Transaksi Hari ini</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <button className="btn btn-info" type="button"><span
                                className="fa fa-search"></span></button>
                        </div>
                        <input type="text" className="form-control" placeholder="Ketik nomor transaksi..." onChange={e => handleHistory(e)} />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>No Transaksi</th>
                                    <th>Total</th>
                                    <th>Diskon</th>
                                    <th>Grand Total</th>
                                    <th>Retur</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {histori.map((el, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{el.no_trans}</td>
                                        <td>{numberFormat(el.grand_total)}</td>
                                        <td>{numberFormat(el.total_discount)}</td>
                                        <td>{numberFormat(el.grand_total + el.total_discount)}</td>
                                        <td>{(el.retur) ? 'Ya' : 'Tidak'}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={() => printing(el.id)}>Reprint</button>
                                            {(!el.retur) ? <button className="btn btn-danger btn-sm ml-1" onClick={() => showModal(el.id)}>Retur</button> : ''}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>Tutup</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Otorisasi Manager</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="nik">NIK Manager</label>
                        <input type="text" className="form-control" placeholder="Masukan NIK Store Manager" onChange={e => setNik(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password Manager</label>
                        <input type="password" className="form-control" placeholder="Masukan Password Store Manager" onChange={e => setPassword(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="btn-sm" onClick={handleClose}>Batal</Button>
                    <Button variant="danger" className="btn-sm" onClick={handleRetur}>Proses</Button>
                </Modal.Footer>
            </Modal>
        </>

    )

}
export default History