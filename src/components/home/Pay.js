import React from 'react'
import './home.css'

const Pay = (props) => {
    return (
        <>
            <div className="row box-pay shadow ml-1 mt-2">
                <div className="col-md-6">
                    <table className="text-bayar">
                        <tbody>
                            <tr>
                                <td>Member</td>
                                <td>:</td>
                                <td id="memberName">-</td>
                            </tr>
                            <tr>
                                <td>Total Item</td>
                                <td>:</td>
                                <td id="totalItem">0</td>
                            </tr>
                            <tr>
                                <td>Diskon %</td>
                                <td>:</td>
                                <td id="totalDisc">0</td>
                            </tr>
                            <tr>
                                <td>Total Potongan</td>
                                <td>:</td>
                                <td>Rp. <span id="totalPot">0</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <span className="text-danger font-weight-bold">Total Bayar :</span><br />
                    <span className="text-info font-weight-bold">Rp. </span><span className="text-info total-bayar">0,-</span>
                </div>
            </div>
            <div className="row mt-2 ml-1">
                <div className="table-responsive table-bayar">
                    <table className="table table-hover">
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
                            <tr>
                                <td colSpan="6" align="center">Belanjaan tidak ada</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default Pay