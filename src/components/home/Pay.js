import React, { useEffect } from 'react'
import ScannerDetector from 'js-scanner-detection'
import { numberFormat, reduce } from '../../helpers'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import './home.css'

const Pay = (props) => {

    const trans = useSelector(state => state.trans)
    const dispatch = useDispatch()

    useEffect(() => {

    }, [])


    const scanner = async barcode => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
            }
            const hit = await axios.post(`${process.env.REACT_APP_API_POS}/item/scan`, { barcode }, config)
            if (hit.data.status) {
                const item = hit.data.data
                const index = trans.findIndex(e => e.productId === item.productId)
                if (index === -1) {
                    dispatch({
                        type: 'TRANS', payload: [...trans, {
                            productId: item.productId,
                            barcode: item.barcode,
                            desc: item.desc,
                            hpp: item.hpp,
                            sales: item.sales,
                            qty: 1,
                            disc: 0,
                            sub_total: item.sales - item.disc
                        }]
                    })
                } else {
                    let copyData = [...trans]
                    copyData[index].qty += 1
                    copyData[index].sub_total = copyData[index].sales * copyData[index].qty
                    dispatch({ type: 'TRANS', payload: copyData })
                }
            } else {
                alert('Data produk tidak ditemukan!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const remove = (index) => {
        let copyData = [...trans]
        if (index > -1) {
            copyData.splice(index, 1)
        }
        dispatch({ type: 'TRANS', payload: copyData })
    }

    const updateQty = (index, val) => {
        let copyData = [...trans]
        if (index > -1) {
            copyData[index].qty = parseInt(val) || 0
            copyData[index].sub_total = copyData[index].sales * copyData[index].qty
        }
        dispatch({ type: 'TRANS', payload: copyData })
    }

    new ScannerDetector({
        onComplete: scanner
    })
    const data = reduce(trans)

    return (
        <>
            <div className="row box-pay shadow ml-1 mt-2">
                <div className="col-md-6">
                    <table className="text-bayar mt-2">
                        <tbody>
                            <tr>
                                <td>Member</td>
                                <td>:</td>
                                <td id="memberName">-</td>
                            </tr>
                            <tr>
                                <td>Total Item</td>
                                <td>:</td>
                                <td>{numberFormat(data.qty)}</td>
                            </tr>
                            <tr>
                                <td>Diskon %</td>
                                <td>:</td>
                                <td id="totalDisc">0</td>
                            </tr>
                            <tr>
                                <td>Total Potongan</td>
                                <td>:</td>
                                <td>Rp. 0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <span className="text-danger font-weight-bold">Total Bayar :</span><br />
                    <span className="text-info font-weight-bold">Rp. </span><span className="text-info total-bayar">{numberFormat(data.sub_total)}</span>
                </div>
            </div>
            <div className="row mt-2 ml-1">
                <div className="table-responsive table-bayar over-flow">
                    <table className="table">
                        <thead className="bg-danger text-white">
                            <tr>
                                <th>Produk</th>
                                <th>Qty</th>
                                <th>Harga Per Item</th>
                                <th>Diskon</th>
                                <th>Sub Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {(trans.length > 0) ? trans.map((el, i) =>
                                <tr key={i}>
                                    <td>{el.desc}</td>
                                    <td><input type="number" className="form-control" min="1" value={el.qty} onChange={e => updateQty(i, e.target.value)} onKeyDown={e => (e.keyCode === 13) ? e.target.blur() : ''} /></td>
                                    <td>{numberFormat(el.sales)}</td>
                                    <td>{numberFormat(el.disc)}</td>
                                    <td>{numberFormat(el.sub_total)}</td>
                                    <td><span className="fa fa-times" style={{ cursor: 'pointer' }} onClick={() => remove(i)} ></span></td>
                                </tr>
                            ) : <tr><td colSpan="6" align="center">Belanjaan tidak ada</td></tr>}
                        </tbody>
                    </table>
                    {(trans.length > 0) ? <button className="btn btn-warning text-white float-right">Hold Transaksi</button> : ''}
                </div>
            </div>
        </>
    )
}
export default Pay