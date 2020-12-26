import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchGet, fetchPost, Alert } from '../../../helpers'
import { ppobHistory, prepaidCheck, postpaidCheck, printPreStruk, printPostStruk } from '../../../Endpoint'
import moment from 'moment'
import Pagination from 'react-js-pagination'
import { debounce } from 'lodash'
import '../home.css'


const History = (props) => {

    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [q, setQ] = useState('')
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hit = await fetchGet(`${ppobHistory}?date_start=${moment().format('YYYY-MM-DD')}&date_end=${moment().format('YYYY-MM-DD')}&page=${page}&q=${q}`)
                setData(hit.data.docs)
                setPage(page)
                setTotalPage(hit.data.total)
            } catch (error) {
                Alert('Server timeout!')
            }
        }
        if (props.fetching) {
            fetchData()
        }
    }, [props, page, q, isLoading])

    const printPrepaid = async (ref_id, data) => {
        try {
            setLoading(true)
            const hit = await fetchPost(prepaidCheck, { no_trans: ref_id })
            if (hit.status) {
                const paper = localStorage.getItem('paper') || 'small'
                const body = {
                    store: data.store,
                    hp: data.hp,
                    type: data.type,
                    no_trans: data.no_trans,
                    fullname: data.fullname,
                    tr_id: hit.data.tr_id,
                    sn: hit.data.sn,
                    operator: data.operator,
                    sales: data.sales,
                    cash: data.cash,
                    createdAt: data.createdAt,
                }
                const print = await fetchPost(printPreStruk, { data: body, paper })
                if (print.status) {
                    Alert('Cetak Berhasil')
                } else {
                    Alert(print.message)
                }
            } else {
                Alert(hit.message)
            }
            setLoading(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const printPostpaid = async (ref_id, obj) => {
        try {
            setLoading(true)
            const hit = await fetchPost(postpaidCheck, { no_trans: ref_id })
            if (hit.status) {
                const paper = localStorage.getItem('paper') || 'small'
                const print = await fetchPost(printPostStruk, { data: hit.data, obj, paper })
                if (print.status) {
                    Alert('Cetak Berhasil')
                } else {
                    Alert(print.message)
                }
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
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
                <Modal.Header closeButton>
                    Transaksi PPOB Hari ini
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
                                    <th>Jenis</th>
                                    <th>Nomor</th>
                                    <th>Sales</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((el, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{el.no_trans}</td>
                                        <td>{el.ppob_type}</td>
                                        <td>{el.hp}</td>
                                        <td>{numberFormat(el.sales)}</td>
                                        <td><span className={(el.status === 1) ? 'badge badge-success' : 'badge badge-danger'}>{(el.status === 1) ? 'Berhasil' : 'Menunggu'}</span></td>
                                        <td>
                                            {(el.ppob_type === 'prepaid') ? <button className="btn btn-primary btn-sm" onClick={() => printPrepaid(el.no_trans, el)}>Reprint</button> : <button className="btn btn-primary btn-sm" onClick={() => printPostpaid(el.no_trans, el)}>Reprint</button>}
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
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default History