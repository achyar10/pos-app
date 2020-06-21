import React from 'react'
import moment from 'moment'
import { numberFormat } from '../../helpers'
moment.locale('id')

const DataPromo = ({ promotion, loading }) => {
    if (loading) {
        return <h2>Mohon tunggu...</h2>
    }
    return (
        <div className="table-responsive">
            <table className="table table-sm table-hover table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Nama Produk</th>
                        <th>Harga</th>
                        <th>Harga Promo</th>
                        <th>Periode</th>
                    </tr>
                </thead>
                <tbody>
                    {promotion.map((p, i) => (
                        <tr key={i}>
                            <td>{p.desc}</td>
                            <td>{numberFormat(p.temp_item.sales)}</td>
                            <td>{numberFormat(p.temp_item.sales - p.amount)}</td>
                            <td>{moment(p.period_start).format('DD MMM YYYY')} s/d {moment(p.period_end).format('DD MMM YYYY')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DataPromo
