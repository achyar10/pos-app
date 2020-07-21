import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { histories, returs, authorizes } from '../../Endpoint'
import { numberFormat, printing, fetchGet, fetchPost, Alert } from '../../helpers'
import { debounce } from 'lodash'
import Pagination from 'react-js-pagination'

const History = (props) => {

    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [q, setQ] = useState('')
    const [nik, setNik] = useState('')
    const [password, setPassword] = useState('')
    const [transId, setTransId] = useState('')
    const [show, setShow] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const hit = await fetchGet(`${histories}?page=${page}&q=${q}`)
                setData(hit.docs)
                setPage(page)
                setTotalPage(hit.total)
            } catch (error) {
                Alert('Server timeout!')
            }
        }
        fetch()
    }, [page, q, props, isLoading])

    const showModal = (id) => {
        handleShow()
        setTransId(id)
    }

    const handleRetur = async () => {
        try {
            setLoading(true)
            const check = await fetchPost(authorizes, { nik, password })
            if (check.status) {
                const res = await fetchPost(returs, { transId })
                Alert(res.message)
                setNik('')
                setPassword('')
                handleClose()
            } else {
                Alert(check.message)
            }
            setLoading(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const handleSearch = debounce((val) => {
        setQ(val)
    }, 500)

    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Daftar Transaksi Hari ini</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <button className="btn btn-info" type="button"><span
                                className="fa fa-search"></span></button>
                        </div>
                        <input type="text" className="form-control" placeholder="Ketik nomor transaksi..." onChange={e => handleSearch(e.target.value)} />
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
                                    <th>Transfer</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((el, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{el.no_trans}</td>
                                        <td>{numberFormat(el.grand_total)}</td>
                                        <td>{numberFormat(el.total_discount)}</td>
                                        <td>{numberFormat(el.grand_total + el.total_discount)}</td>
                                        <td>{(el.retur) ? 'Ya' : 'Tidak'}</td>
                                        <td>{(el.transfer) ? 'Ya' : 'Tidak'}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={() => printing(el.id)}>Reprint</button>
                                            {(!el.retur) ? <button className="btn btn-danger btn-sm ml-1" onClick={() => showModal(el.id)}>Retur</button> : ''}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        itemClass="page-item"
                        linkClass="page-link"
                        activePage={page}
                        itemsCountPerPage={5}
                        totalItemsCount={totalPage}
                        pageRangeDisplayed={5}
                        onChange={(page) => setPage(page)}
                    />
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