import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { numberFormat, fetchGet, fetchDelete, Alert } from '../../helpers'
import { holdUrl } from '../../Endpoint'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

const Hold = (props) => {

    const [holds, setHold] = useState([])
    const dispatch = useDispatch()
    const hold = useSelector(state => state.hold)

    const getHolds = async () => {
        try {
            const hit = await fetchGet(holdUrl)
            if (hit.status) {
                setHold(hit.data)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const handleHold = async (obj) => {
        try {
            obj.items.forEach(el => {
                el.sub_total = (el.sales * el.qty) - (el.disc * el.qty)
                el.valueDisc = el.disc * el.qty
            })
            dispatch({ type: 'TRANS', payload: obj.items })
            if (obj.memberId) {
                dispatch({ type: 'MEMBER', payload: { memberId: obj.memberId, member_no: obj.member_no, member_fullname: obj.member_fullname } })
            }
            const res = await fetchDelete(holdUrl, { id: obj.id })
            if (res.status) {
                getHolds()
                console.log('Delete hold berhasil')
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    if (hold) {
        getHolds()
        dispatch({ type: 'HOLD', payload: false })
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Daftar Transaksi Hold</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>No Transaksi</th>
                                    <th>Grand Total</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holds.map((el, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{el.no_trans}</td>
                                        <td>{numberFormat(el.grand_total)}</td>
                                        <td>{moment(el.createdAt).format('DD MMM YYYY')}</td>
                                        <td><button className="btn btn-success btn-sm" onClick={() => handleHold(el)} >Pilih</button></td>
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
        </div>
    )
}

export default Hold
