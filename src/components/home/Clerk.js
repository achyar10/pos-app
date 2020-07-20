import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { clerks } from '../../Endpoint'
import { numberFormat, fetchPost, fetchGet } from '../../helpers'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter  } from 'react-router-dom'

const Clerk = (props) => {

    const [data, setData] = useState({
        total_cash: 0,
        total_debit: 0,
        total_trans: 0,
        total_sedekah: 0,
        total_disc: 0,
        total_retur: 0,
        count_retur: 0,
        count_sales: 0,
        count_qty: 0
    })
    const [selisih, setSelisih] = useState(0)
    const [disable, setDisable] = useState(false)
    const [buttonName, setButtonName] = useState('Proses Clerk')
    const dispatch = useDispatch()
    const clerk = useSelector(state => state.clerk)

    useEffect(() => {

    }, [])

    const getClerk = async () => {
        const hit = await fetchGet(clerks)
        if (hit.status) {
            setData(hit.data)
        } else {
            alert(hit.message)
        }
    }

    const handleClerk = async () => {
        const grand_total = data.total_trans - data.total_retur + data.total_sedekah
        let body = {
            ...data, ...{
                grand_total, setoran: grand_total + selisih
            }
        }
        setDisable(true)
        setButtonName('Proses...')
        const res = await fetchPost(clerks, body)
        if (res.status) {
            dispatch({ type: 'CLERK', payload: false })
            dispatch({ type: 'HOLD', payload: false })
            dispatch({ type: 'TRANS', payload: [] })
            dispatch({ type: 'MEMBER', payload: null })
            localStorage.removeItem('authJwt')
            props.history.push('/login')
        } else {
            setDisable(false)
            setButtonName('Proses Clerk')
            alert('Server time out!')
        }
    }

    if (clerk) {
        getClerk()
        dispatch({ type: 'CLERK', payload: false })
    }

    const handleSetor = (e) => {
        const setoran = parseInt(e.target.value) || 0
        const grand_total = data.total_trans - data.total_retur + data.total_sedekah
        setSelisih(setoran - grand_total)
    }

    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
                <Modal.Header>
                    <Modal.Title>Sales per shift</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped">
                            <tbody>
                                <tr>
                                    <td>Jumlah Transaksi</td>
                                    <td>:</td>
                                    <td>{numberFormat(data.count_sales)}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah QTY</td>
                                    <td>:</td>
                                    <td>{numberFormat(data.count_qty)}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah Retur</td>
                                    <td>:</td>
                                    <td>{numberFormat(data.count_retur)}</td>
                                </tr>
                                <tr>
                                    <td>Total Tunai</td>
                                    <td>:</td>
                                    <td>Rp. {numberFormat(data.total_cash)}</td>
                                </tr>
                                <tr>
                                    <td>Total Non Tunai</td>
                                    <td>:</td>
                                    <td>Rp. {numberFormat(data.total_debit)}</td>
                                </tr>
                                <tr>
                                    <td>Total Nominal Diskon</td>
                                    <td>:</td>
                                    <td>Rp. {numberFormat(data.total_disc)}</td>
                                </tr>
                                <tr>
                                    <td>Total Nominal Retur</td>
                                    <td>:</td>
                                    <td>Rp. {numberFormat(data.total_retur)}</td>
                                </tr>
                                <tr>
                                    <td>Total Nominal Sedekah</td>
                                    <td>:</td>
                                    <td>Rp. {numberFormat(data.total_sedekah)}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold">Grand Total</td>
                                    <td className="font-weight-bold">:</td>
                                    <td className="font-weight-bold">Rp. {numberFormat(data.total_trans - data.total_retur + data.total_sedekah)}</td>
                                </tr>
                                <tr>
                                    <td>Input Setoran</td>
                                    <td>:</td>
                                    <td><input type="number" className="form-control"
                                        autoComplete="off" placeholder="Masukan setoran" onChange={e => handleSetor(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Selisih</td>
                                    <td>:</td>
                                    <td><input type="text" className="form-control" readOnly value={numberFormat(selisih)} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>Tutup</Button>
                    <Button variant="danger" className="ml-2" disabled={disable} onClick={() => handleClerk()}>{buttonName}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}
export default withRouter(Clerk)