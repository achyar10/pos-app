import React from 'react'
import ScannerDetector from 'js-scanner-detection'
import { numberFormat, reduce, fetchPost, Alert } from '../../helpers'
import { scanUrl, holdUrl } from '../../Endpoint'
import { useSelector, useDispatch } from 'react-redux'
import './home.css'

const Pay = () => {

    const trans = useSelector(state => state.trans)
    const member = useSelector(state => state.member)
    const dispatch = useDispatch()

    const scanner = async barcode => {
        const hit = await fetchPost(scanUrl, { barcode })
        if (hit.status) {
            const item = hit.data
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
                        valueDisc: item.disc,
                        disc: item.disc,
                        sub_total: item.sales - item.disc
                    }]
                })
            } else {
                let copyData = [...trans]
                copyData[index].qty += 1
                copyData[index].disc = copyData[index].valueDisc * copyData[index].qty
                copyData[index].sub_total = (copyData[index].sales * copyData[index].qty) - copyData[index].disc
                dispatch({ type: 'TRANS', payload: copyData })
            }
        } else {
            Alert('Data produk tidak ditemukan!')
        }
    }

    const handleHold = () => {
        let details = []
        trans.forEach(el => {
            details.push({
                productId: el.productId,
                barcode: el.barcode,
                desc: el.desc,
                qty: el.qty,
                hpp: el.hpp,
                sales: el.sales,
                disc: el.disc
            })
        });
        const snap = {
            memberId: (member) ? member.memberId : null,
            member_no: (member) ? member.member_no : null,
            member_fullname: (member) ? member.member_fullname : null,
            items: details
        }
        hit(snap)
    }

    const hit = async (body) => {
        try {
            const hit = await fetchPost(holdUrl, body)
            if (hit.status) {
                dispatch({ type: 'TRANS', payload: [] })
                dispatch({ type: 'MEMBER', payload: null })
                Alert('Transaksi berhasil di tahan')
            } else {
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
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
            copyData[index].disc = copyData[index].valueDisc * copyData[index].qty
            copyData[index].sub_total = (copyData[index].sales * copyData[index].qty) - copyData[index].disc
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
                                <td>{(member) ? member.member_fullname : '-'}</td>
                            </tr>
                            <tr>
                                <td>Total Item</td>
                                <td>:</td>
                                <td>{numberFormat(data.qty)}</td>
                            </tr>
                            <tr>
                                <td>Diskon Member %</td>
                                <td>:</td>
                                <td>{(member) ? member.member_disc : 0}</td>
                            </tr>
                            <tr>
                                <td>Total Potongan</td>
                                <td>:</td>
                                <td>Rp. {numberFormat(data.disc)}</td>
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
                    {(trans.length > 0) ? <button className="btn btn-warning text-white float-right" onClick={() => handleHold()}>Hold Transaksi</button> : ''}
                </div>
            </div>
        </>
    )
}
export default Pay